/**
 * Terrain: loading a real DEM, contouring it, and flooding it.
 *
 * The flood is *connected*, not a bathtub fill. That distinction is the whole
 * argument of CORA: a bathtub model drowns every cell below the waterline,
 * including a low field sitting behind a ridge with no path to the sea.
 * Connected flooding starts at the ocean and can only spread through cells the
 * water could actually reach. The site draws both, because the gap between
 * them is the point.
 */

export interface Dem {
  width: number;
  height: number;
  /** Metres above the SRTM reference, row-major, north row first. */
  z: Float32Array;
  bbox: { south: number; north: number; west: number; east: number };
  metresPerSampleX: number;
  metresPerSampleY: number;
  minMetres: number;
  maxMetres: number;
  source: string;
}

interface RawDem {
  width: number;
  height: number;
  dm: string;
  bbox: Dem['bbox'];
  metresPerSampleX: number;
  metresPerSampleY: number;
  minMetres: number;
  maxMetres: number;
  source: string;
}

function b64ToInt16(b64: string): Int16Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

export function b64ToUint16(b64: string): Uint16Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Uint16Array(bytes.buffer);
}

let demPromise: Promise<Dem> | null = null;

export function loadDem(): Promise<Dem> {
  demPromise ??= fetch('/data/dem-miami.json')
    .then(r => r.json())
    .then((raw: RawDem) => {
      const dm = b64ToInt16(raw.dm);
      const z = new Float32Array(dm.length);
      for (let i = 0; i < dm.length; i++) z[i] = dm[i] / 10;
      return {
        width: raw.width,
        height: raw.height,
        z,
        bbox: raw.bbox,
        metresPerSampleX: raw.metresPerSampleX,
        metresPerSampleY: raw.metresPerSampleY,
        minMetres: raw.minMetres,
        maxMetres: raw.maxMetres,
        source: raw.source,
      };
    });
  return demPromise;
}

/**
 * Connected inundation. Seeds from every edge cell at or below the waterline —
 * the boundary of the tile is where the open sea is — then floods inward on a
 * 4-neighbourhood. Returns 1 for wet, 0 for dry.
 */
export function connectedFlood(dem: Dem, level: number, out?: Uint8Array): Uint8Array {
  const { width: w, height: h, z } = dem;
  const mask = out ?? new Uint8Array(w * h);
  mask.fill(0);

  // A typed ring buffer rather than an array of pushes: at 65k cells this runs
  // every time the slider moves, and allocation is the only thing here that
  // would show up.
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const push = (i: number) => {
    if (!mask[i] && z[i] <= level) {
      mask[i] = 1;
      queue[tail++] = i;
    }
  };

  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }

  while (head < tail) {
    const i = queue[head++];
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (y > 0) push(i - w);
    if (y < h - 1) push(i + w);
  }

  return mask;
}

/** Every cell below the waterline, connected to the sea or not. */
export function bathtub(dem: Dem, level: number, out?: Uint8Array): Uint8Array {
  const mask = out ?? new Uint8Array(dem.z.length);
  for (let i = 0; i < dem.z.length; i++) mask[i] = dem.z[i] <= level ? 1 : 0;
  return mask;
}

export type Segment = [number, number, number, number];

/**
 * Marching squares. Produces the true isoline of the elevation field at a
 * given level, in grid coordinates, with linear interpolation along each cell
 * edge so contours are smooth rather than stair-stepped.
 */
export function contour(dem: Dem, level: number): Segment[] {
  const { width: w, height: h, z } = dem;
  const segs: Segment[] = [];

  // Interpolated crossing point between two corners.
  const lerp = (a: number, b: number) => {
    const d = b - a;
    return Math.abs(d) < 1e-9 ? 0.5 : (level - a) / d;
  };

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = y * w + x;
      const tl = z[i];
      const tr = z[i + 1];
      const bl = z[i + w];
      const br = z[i + w + 1];

      let code = 0;
      if (tl > level) code |= 8;
      if (tr > level) code |= 4;
      if (br > level) code |= 2;
      if (bl > level) code |= 1;
      if (code === 0 || code === 15) continue;

      const top: [number, number] = [x + lerp(tl, tr), y];
      const right: [number, number] = [x + 1, y + lerp(tr, br)];
      const bottom: [number, number] = [x + lerp(bl, br), y + 1];
      const left: [number, number] = [x, y + lerp(tl, bl)];

      const add = (a: [number, number], b: [number, number]) =>
        segs.push([a[0], a[1], b[0], b[1]]);

      switch (code) {
        case 1: case 14: add(left, bottom); break;
        case 2: case 13: add(bottom, right); break;
        case 3: case 12: add(left, right); break;
        case 4: case 11: add(top, right); break;
        case 6: case 9: add(top, bottom); break;
        case 7: case 8: add(left, top); break;
        // Saddles: both crossings, resolved against the cell average.
        case 5:
          if ((tl + tr + bl + br) / 4 > level) { add(left, top); add(bottom, right); }
          else { add(left, bottom); add(top, right); }
          break;
        case 10:
          if ((tl + tr + bl + br) / 4 > level) { add(top, right); add(left, bottom); }
          else { add(left, top); add(bottom, right); }
          break;
      }
    }
  }
  return segs;
}
