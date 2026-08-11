/**
 * The optimisation ladder, in WGSL, measured on whoever's GPU is reading.
 *
 * These are the same four rungs cuda-from-scratch climbs, and each is one
 * change from the last:
 *
 *   1  naive        one thread per output, lane index mapped to the ROW
 *   2  coalesced    the same kernel with lane index mapped to the COLUMN
 *   3  tiled        a workgroup-shared tile, so each load feeds many FMAs
 *   4  register     4x4 outputs per thread, so each shared load feeds 8 FMAs
 *
 * Rung 2 differs from rung 1 by one swapped index and is typically several
 * times faster — that is the entire lesson about memory coalescing, and it is
 * the reason the ladder starts there.
 *
 * ── on the measurement ──────────────────────────────────────────────────────
 * A browser tab is a worse measurement environment than a Colab T4, and that
 * one was bad enough to produce three retracted numbers. So this follows the
 * methodology from the repo rather than pretending the problem away:
 *
 *   · every kernel is checked against a CPU reference before it is timed at
 *     all, and a kernel that fails is reported as wrong, not as slow
 *   · each timing is paired with an adjacent timing of the same reference
 *     kernel, and what gets reported is the median RATIO over several rounds,
 *     so drift in clocks and thermal state divides out
 *   · the spread across rounds is reported next to every number, because
 *     quoting an endpoint from a noisy sample is how you invent a result
 */

export type RungId = 'naive' | 'coalesced' | 'tiled' | 'register';

export interface Rung {
  id: RungId;
  label: string;
  change: string;
  why: string;
}

export const RUNGS: Rung[] = [
  {
    id: 'naive',
    label: 'naive',
    change: 'one thread per output, lane → row',
    why: 'a wave’s lanes stride by N, so each memory op touches as many lines as it has lanes',
  },
  {
    id: 'coalesced',
    label: 'coalesced',
    change: 'swap which index the lane maps to',
    why: 'the lanes now read consecutive addresses and collapse into one transaction',
  },
  {
    id: 'tiled',
    label: 'tiled',
    change: 'stage a 16×16 tile in workgroup memory',
    why: 'each global load is reused by every thread in the row and column of the tile',
  },
  {
    id: 'register',
    label: 'register 4×4',
    change: '16 outputs per thread',
    why: 'the register file is the real top of the memory hierarchy',
  },
];

const WGSL_HEAD = /* wgsl */ `
struct Dims { n: u32 };
@group(0) @binding(0) var<storage, read> A: array<f32>;
@group(0) @binding(1) var<storage, read> B: array<f32>;
@group(0) @binding(2) var<storage, read_write> C: array<f32>;
@group(0) @binding(3) var<uniform> d: Dims;
`;

/**
 * Rungs 1 and 2 are the same source with `lane_is_row` flipped. Keeping them
 * one string makes the claim checkable: nothing else differs.
 */
function scalarKernel(laneIsRow: boolean): string {
  const row = laneIsRow ? 'gid.x' : 'gid.y';
  const col = laneIsRow ? 'gid.y' : 'gid.x';
  return /* wgsl */ `
${WGSL_HEAD}
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = d.n;
  let row = ${row};
  let col = ${col};
  if (row >= n || col >= n) { return; }
  var acc = 0.0;
  for (var k = 0u; k < n; k = k + 1u) {
    acc = acc + A[row * n + k] * B[k * n + col];
  }
  C[row * n + col] = acc;
}
`;
}

const TILED = /* wgsl */ `
${WGSL_HEAD}
const TS: u32 = 16u;
var<workgroup> As: array<f32, 256>;
var<workgroup> Bs: array<f32, 256>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3u,
        @builtin(local_invocation_id) lid: vec3u) {
  let n = d.n;
  let col = gid.x;
  let row = gid.y;
  let tx = lid.x;
  let ty = lid.y;
  var acc = 0.0;

  let tiles = (n + TS - 1u) / TS;
  for (var t = 0u; t < tiles; t = t + 1u) {
    let aCol = t * TS + tx;
    let bRow = t * TS + ty;
    As[ty * TS + tx] = select(0.0, A[row * n + aCol], row < n && aCol < n);
    Bs[ty * TS + tx] = select(0.0, B[bRow * n + col], col < n && bRow < n);
    workgroupBarrier();
    for (var k = 0u; k < TS; k = k + 1u) {
      acc = acc + As[ty * TS + k] * Bs[k * TS + tx];
    }
    workgroupBarrier();
  }
  if (row < n && col < n) { C[row * n + col] = acc; }
}
`;

/**
 * 64x64 block per workgroup, 4x4 outputs per thread, K stepped 16 at a time.
 * 256 threads each stage 4 elements of A and 4 of B, which exactly fills both
 * tiles.
 */
const REGISTER = /* wgsl */ `
${WGSL_HEAD}
const BM: u32 = 64u;
const BN: u32 = 64u;
const BK: u32 = 16u;
const TM: u32 = 4u;
const TN: u32 = 4u;

var<workgroup> As: array<f32, 1024>;  // BM * BK
var<workgroup> Bs: array<f32, 1024>;  // BK * BN

@compute @workgroup_size(16, 16)
fn main(@builtin(workgroup_id) wid: vec3u,
        @builtin(local_invocation_id) lid: vec3u,
        @builtin(local_invocation_index) tid: u32) {
  let n = d.n;
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;

  var acc: array<f32, 16>;
  for (var i = 0u; i < 16u; i = i + 1u) { acc[i] = 0.0; }

  let tiles = (n + BK - 1u) / BK;
  for (var t = 0u; t < tiles; t = t + 1u) {
    // Stage A: 64x16 = 1024 values across 256 threads.
    for (var i = 0u; i < 4u; i = i + 1u) {
      let idx = tid + i * 256u;
      let r = idx / BK;
      let c = idx % BK;
      let gr = blockRow + r;
      let gc = t * BK + c;
      As[r * BK + c] = select(0.0, A[gr * n + gc], gr < n && gc < n);
    }
    // Stage B: 16x64 = 1024 values.
    for (var i = 0u; i < 4u; i = i + 1u) {
      let idx = tid + i * 256u;
      let r = idx / BN;
      let c = idx % BN;
      let gr = t * BK + r;
      let gc = blockCol + c;
      Bs[r * BN + c] = select(0.0, B[gr * n + gc], gr < n && gc < n);
    }
    workgroupBarrier();

    for (var k = 0u; k < BK; k = k + 1u) {
      var a: array<f32, 4>;
      var b: array<f32, 4>;
      for (var i = 0u; i < TM; i = i + 1u) { a[i] = As[(lid.y * TM + i) * BK + k]; }
      for (var j = 0u; j < TN; j = j + 1u) { b[j] = Bs[k * BN + lid.x * TN + j]; }
      for (var i = 0u; i < TM; i = i + 1u) {
        for (var j = 0u; j < TN; j = j + 1u) {
          acc[i * TN + j] = acc[i * TN + j] + a[i] * b[j];
        }
      }
    }
    workgroupBarrier();
  }

  for (var i = 0u; i < TM; i = i + 1u) {
    for (var j = 0u; j < TN; j = j + 1u) {
      let r = blockRow + lid.y * TM + i;
      let c = blockCol + lid.x * TN + j;
      if (r < n && c < n) { C[r * n + c] = acc[i * TN + j]; }
    }
  }
}
`;

const SOURCE: Record<RungId, string> = {
  naive: scalarKernel(true),
  coalesced: scalarKernel(false),
  tiled: TILED,
  register: REGISTER,
};

/** Workgroups needed to cover an N×N output, per rung. */
function dispatchFor(id: RungId, n: number): [number, number] {
  if (id === 'register') {
    const b = Math.ceil(n / 64);
    return [b, b];
  }
  const b = Math.ceil(n / 16);
  return [b, b];
}

export interface RungResult {
  id: RungId;
  /** Median seconds per multiply across rounds. */
  seconds: number;
  gflops: number;
  /** Median ratio against the reference rung, and its spread. */
  ratio: number;
  ratioMin: number;
  ratioMax: number;
  correct: boolean;
  maxError: number;
}

export interface LadderReport {
  backend: 'webgpu';
  adapter: string;
  n: number;
  rounds: number;
  reference: RungId;
  results: RungResult[];
  /** Spread of the reference kernel's own timings — the honesty line. */
  referenceSpread: [number, number];
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export async function webgpuAvailable(): Promise<boolean> {
  const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
  if (!gpu) return false;
  try {
    return !!(await gpu.requestAdapter());
  } catch {
    return false;
  }
}

/** A small CPU multiply, used as the oracle every rung must match. */
function referenceMultiply(a: Float32Array, b: Float32Array, n: number): Float32Array {
  const c = new Float32Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const aik = a[i * n + k];
      if (aik === 0) continue;
      for (let j = 0; j < n; j++) c[i * n + j] += aik * b[k * n + j];
    }
  }
  return c;
}

export interface LadderOptions {
  n?: number;
  rounds?: number;
  onProgress?: (msg: string) => void;
}

export async function runLadder(opts: LadderOptions = {}): Promise<LadderReport> {
  const n = opts.n ?? 512;
  const rounds = opts.rounds ?? 5;
  const report = opts.onProgress ?? (() => {});

  const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
  if (!gpu) throw new Error('WebGPU is not available in this browser');
  const adapter = await gpu.requestAdapter();
  if (!adapter) throw new Error('No GPU adapter');
  const device = await adapter.requestDevice();

  const info = (adapter as GPUAdapter & { info?: GPUAdapterInfo }).info;
  const adapterName = [info?.vendor, info?.architecture].filter(Boolean).join(' ') || 'unnamed adapter';

  // Deterministic inputs: the same matrices every visit, so a number quoted
  // from this page can be reproduced from it.
  let seed = 0x2545f491;
  const rnd = () => {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >> 17;
    seed ^= seed << 5; seed >>>= 0;
    return (seed / 0xffffffff) * 2 - 1;
  };
  const A = new Float32Array(n * n);
  const B = new Float32Array(n * n);
  for (let i = 0; i < A.length; i++) A[i] = rnd();
  for (let i = 0; i < B.length; i++) B[i] = rnd();

  const bytes = n * n * 4;
  const mk = (usage: GPUBufferUsageFlags) => device.createBuffer({ size: bytes, usage });
  const bufA = mk(GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
  const bufB = mk(GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
  const bufC = mk(GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
  device.queue.writeBuffer(bufA, 0, A);
  device.queue.writeBuffer(bufB, 0, B);

  const dims = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(dims, 0, new Uint32Array([n, 0, 0, 0]));

  const pipelines = new Map<RungId, GPUComputePipeline>();
  const bindGroups = new Map<RungId, GPUBindGroup>();
  for (const rung of RUNGS) {
    const module = device.createShaderModule({ code: SOURCE[rung.id], label: rung.id });
    const pipeline = await device.createComputePipelineAsync({
      layout: 'auto',
      compute: { module, entryPoint: 'main' },
      label: rung.id,
    });
    pipelines.set(rung.id, pipeline);
    bindGroups.set(
      rung.id,
      device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: bufA } },
          { binding: 1, resource: { buffer: bufB } },
          { binding: 2, resource: { buffer: bufC } },
          { binding: 3, resource: { buffer: dims } },
        ],
      }),
    );
  }

  const dispatch = (id: RungId, reps: number) => {
    const enc = device.createCommandEncoder();
    const pass = enc.beginComputePass();
    pass.setPipeline(pipelines.get(id)!);
    pass.setBindGroup(0, bindGroups.get(id)!);
    const [gx, gy] = dispatchFor(id, n);
    for (let r = 0; r < reps; r++) pass.dispatchWorkgroups(gx, gy);
    pass.end();
    device.queue.submit([enc.finish()]);
  };

  const time = async (id: RungId, reps: number): Promise<number> => {
    const t0 = performance.now();
    dispatch(id, reps);
    await device.queue.onSubmittedWorkDone();
    return (performance.now() - t0) / 1000 / reps;
  };

  // ── correctness, before anything is timed ──────────────────────────────────
  report('checking each rung against a CPU reference…');
  const CHECK_N = 64;
  const errors = new Map<RungId, number>();
  {
    const a = A.subarray(0, CHECK_N * CHECK_N);
    const b = B.subarray(0, CHECK_N * CHECK_N);
    // A separate, small device setup keeps the check independent of the timing
    // buffers — a kernel that scribbles outside its output cannot hide.
    const want = referenceMultiply(
      Float32Array.from(a),
      Float32Array.from(b),
      CHECK_N,
    );
    const smallBytes = CHECK_N * CHECK_N * 4;
    const sA = device.createBuffer({ size: smallBytes, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    const sB = device.createBuffer({ size: smallBytes, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    const sC = device.createBuffer({ size: smallBytes, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
    const sRead = device.createBuffer({ size: smallBytes, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
    const sDims = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(sA, 0, Float32Array.from(a));
    device.queue.writeBuffer(sB, 0, Float32Array.from(b));
    device.queue.writeBuffer(sDims, 0, new Uint32Array([CHECK_N, 0, 0, 0]));

    for (const rung of RUNGS) {
      const pipeline = pipelines.get(rung.id)!;
      const bg = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: sA } },
          { binding: 1, resource: { buffer: sB } },
          { binding: 2, resource: { buffer: sC } },
          { binding: 3, resource: { buffer: sDims } },
        ],
      });
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      const [gx, gy] = dispatchFor(rung.id, CHECK_N);
      pass.dispatchWorkgroups(gx, gy);
      pass.end();
      enc.copyBufferToBuffer(sC, 0, sRead, 0, smallBytes);
      device.queue.submit([enc.finish()]);
      await sRead.mapAsync(GPUMapMode.READ);
      const got = new Float32Array(sRead.getMappedRange().slice(0));
      sRead.unmap();
      let maxErr = 0;
      for (let i = 0; i < want.length; i++) {
        const e = Math.abs(got[i] - want[i]) / Math.max(1, Math.abs(want[i]));
        if (e > maxErr) maxErr = e;
      }
      errors.set(rung.id, maxErr);
    }
    for (const b of [sA, sB, sC, sRead, sDims]) b.destroy();
  }

  const correct = (id: RungId) => (errors.get(id) ?? 1) < 1e-3;

  // ── warm-up, then interleaved rounds ───────────────────────────────────────
  //
  // REPS is the same for every rung, and that is not a detail. Consecutive
  // dispatches inside one compute pass have no barrier between them, so the
  // GPU is free to overlap them — which means seconds-per-multiply falls as
  // the repeat count rises, by a different amount for each kernel. Giving the
  // fast rungs more repeats than the slow ones (the obvious way to get all the
  // measurements above the submission-overhead floor) therefore flatters
  // exactly the kernels that were already winning, and the paired ratio stops
  // cancelling anything. Measured: it put naive at 0.34x of tiled while the
  // absolute times said 0.21x. One repeat count, used everywhere.
  const REPS = 3;

  report('warming up…');
  for (let i = 0; i < 2; i++) {
    for (const rung of RUNGS) if (correct(rung.id)) await time(rung.id, REPS);
  }

  const REFERENCE: RungId = 'tiled';
  const raw = new Map<RungId, number[]>(RUNGS.map(r => [r.id, []]));
  const abs = new Map<RungId, number[]>(RUNGS.map(r => [r.id, []]));
  const refTimes: number[] = [];

  for (let round = 0; round < rounds; round++) {
    report(`round ${round + 1} of ${rounds}…`);
    for (const rung of RUNGS) {
      if (!correct(rung.id)) continue;

      // Two defences against measuring position instead of code.
      //
      // The primer is discarded: the first submission after an await absorbs
      // queue wake-up, and putting that cost on whichever kernel happens to go
      // first is how a benchmark ends up reporting the running order. It was
      // doing exactly that here — the reference, always timed first, came out
      // 3.5x slower as the reference than as a rung, and the ratio column
      // disagreed with the GFLOP/s column computed from the same samples.
      //
      // Alternating the order then cancels whatever first-position bias the
      // primer did not absorb, because across rounds each kernel goes first
      // equally often.
      await time(REFERENCE, 1);

      let ref: number;
      let t: number;
      if (round % 2 === 0) {
        ref = await time(REFERENCE, REPS);
        t = await time(rung.id, REPS);
      } else {
        t = await time(rung.id, REPS);
        ref = await time(REFERENCE, REPS);
      }

      refTimes.push(ref);
      raw.get(rung.id)!.push(t / ref);
      abs.get(rung.id)!.push(t);
    }
  }

  const flop = 2 * n ** 3;
  const results: RungResult[] = RUNGS.map(rung => {
    const ratios = raw.get(rung.id)!.filter(Number.isFinite);
    const times = abs.get(rung.id)!.filter(Number.isFinite);
    const seconds = times.length ? median(times) : NaN;
    return {
      id: rung.id,
      seconds,
      gflops: Number.isFinite(seconds) ? flop / seconds / 1e9 : NaN,
      ratio: ratios.length ? median(ratios) : NaN,
      ratioMin: ratios.length ? Math.min(...ratios) : NaN,
      ratioMax: ratios.length ? Math.max(...ratios) : NaN,
      correct: correct(rung.id),
      maxError: errors.get(rung.id) ?? NaN,
    };
  });

  for (const b of [bufA, bufB, bufC, dims]) b.destroy();
  device.destroy();

  return {
    backend: 'webgpu',
    adapter: adapterName,
    n,
    rounds,
    reference: REFERENCE,
    results,
    referenceSpread: refTimes.length ? [Math.min(...refTimes), Math.max(...refTimes)] : [NaN, NaN],
  };
}
