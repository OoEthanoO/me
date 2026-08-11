'use client';

/**
 * CORA, at 10^5 m — a real coastline going under.
 *
 * SRTM 1-arc-second elevation over Biscayne Bay, 14,399 OSM building
 * centroids and 4,063 road ways. Drag the waterline and the connected-flood
 * BFS re-runs over 65,536 cells, the isoline is re-contoured by marching
 * squares, and the exposure counters are recomputed from the actual data —
 * nothing here is a stored animation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  bathtub,
  connectedFlood,
  contour,
  loadDem,
  b64ToUint16,
  type Dem,
  type Segment,
} from '@/lib/geo/dem';
import styles from './Coast.module.css';

interface Coast {
  buildings: Uint16Array;
  buildingCount: number;
  criticalIdx: Uint16Array;
  criticalKind: string;
  criticalKinds: string[];
  roadRuns: Uint16Array;
  roadKinds: string;
  roadXY: Uint16Array;
  roadCount: number;
  bbox: { south: number; north: number; west: number; east: number };
}

let coastPromise: Promise<Coast> | null = null;
function loadCoast(): Promise<Coast> {
  coastPromise ??= fetch('/data/coast.json')
    .then(r => r.json())
    .then(j => ({
      ...j,
      buildings: b64ToUint16(j.buildings),
      criticalIdx: b64ToUint16(j.criticalIdx),
      roadRuns: b64ToUint16(j.roadRuns),
      roadXY: b64ToUint16(j.roadXY),
    }));
  return coastPromise;
}

const css = (el: HTMLElement, name: string) =>
  getComputedStyle(el).getPropertyValue(name).trim();

/** A CSS colour token as raw bytes, for writing straight into ImageData. */
function rgbOf(colour: string): [number, number, number] {
  const hex = colour.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const v = parseInt(hex[1], 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  const fn = colour.match(/(\d+(?:\.\d+)?)/g);
  if (fn && fn.length >= 3) return [+fn[0], +fn[1], +fn[2]];
  return [40, 78, 92];
}

interface Stats {
  buildings: number;
  critical: number;
  roadKm: number;
  areaKm2: number;
  bathtubBuildings: number;
}

export default function Coast() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState(1.0);
  const [showBathtub, setShowBathtub] = useState(false);
  const [data, setData] = useState<{ dem: Dem; coast: Coast } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([loadDem(), loadCoast()]).then(([dem, coast]) => {
      if (alive) setData({ dem, coast });
    });
    return () => { alive = false; };
  }, []);

  // Scratch buffers, allocated once. The slider fires continuously.
  const scratch = useMemo(
    () => ({ wet: null as Uint8Array | null, tub: null as Uint8Array | null }),
    [],
  );

  /** Grid coordinates for a quantised uint16 pair. */
  const toGrid = useCallback((dem: Dem) => {
    const sx = (dem.width - 1) / 65535;
    const sy = (dem.height - 1) / 65535;
    return (qx: number, qy: number) => [qx * sx, qy * sy] as const;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !data) return;
    const { dem, coast } = data;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const box = wrap.getBoundingClientRect();
    const side = Math.max(120, Math.min(box.width, box.height));
    if (canvas.width !== Math.round(side * dpr)) {
      canvas.width = Math.round(side * dpr);
      canvas.height = Math.round(side * dpr);
    }
    canvas.style.width = `${side}px`;
    canvas.style.height = `${side}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, side, side);

    const ink = css(wrap, '--ink');
    const ink3 = css(wrap, '--ink-3');
    const rule = css(wrap, '--rule');
    const ruleFine = css(wrap, '--rule-fine');
    const signal = css(wrap, '--signal');

    const S = side / dem.width; // grid → css px
    const gx = toGrid(dem);

    // ── flood ────────────────────────────────────────────────────────────────
    scratch.wet = connectedFlood(dem, level, scratch.wet ?? undefined);
    scratch.tub = bathtub(dem, level, scratch.tub ?? undefined);
    const wet = scratch.wet;
    const tub = scratch.tub;

    // The wash. Written as ImageData at grid resolution, then scaled up with
    // smoothing on, which gives a soft edge without drawing 65k rectangles.
    // Both colours come from the stylesheet so the plate stock can change
    // without the chart quietly staying light-mode blue.
    const sea = rgbOf(css(wrap, '--second'));
    const warn = rgbOf(css(wrap, '--signal'));
    const img = ctx.createImageData(dem.width, dem.height);
    const px = img.data;
    for (let i = 0; i < wet.length; i++) {
      const j = i * 4;
      if (wet[i]) {
        px[j] = sea[0]; px[j + 1] = sea[1]; px[j + 2] = sea[2]; px[j + 3] = 104;
      } else if (showBathtub && tub[i]) {
        // Below the waterline but unreachable from the sea: the difference a
        // connected model makes, in the colour reserved for "look at this".
        px[j] = warn[0]; px[j + 1] = warn[1]; px[j + 2] = warn[2]; px[j + 3] = 82;
      }
    }
    const off = document.createElement('canvas');
    off.width = dem.width;
    off.height = dem.height;
    off.getContext('2d')!.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, side, side);

    // ── contours ─────────────────────────────────────────────────────────────
    const drawSegs = (segs: Segment[], stroke: string, width: number) => {
      ctx.beginPath();
      for (const [x0, y0, x1, y1] of segs) {
        ctx.moveTo(x0 * S, y0 * S);
        ctx.lineTo(x1 * S, y1 * S);
      }
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    for (const m of [2, 4, 6, 8, 10]) {
      drawSegs(contour(dem, m), m % 4 === 0 ? rule : ruleFine, m % 4 === 0 ? 0.8 : 0.5);
    }

    // ── roads ────────────────────────────────────────────────────────────────
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    let p = 0;
    ctx.beginPath();
    for (let r = 0; r < coast.roadRuns.length; r++) {
      const n = coast.roadRuns[r];
      for (let k = 0; k < n; k++) {
        const [cx, cy] = gx(coast.roadXY[p * 2], coast.roadXY[p * 2 + 1]);
        if (k === 0) ctx.moveTo(cx * S, cy * S);
        else ctx.lineTo(cx * S, cy * S);
        p++;
      }
    }
    ctx.strokeStyle = ink3;
    ctx.globalAlpha = 0.42;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── buildings, and the count of what is under ────────────────────────────
    let flooded = 0;
    let bathtubFlooded = 0;
    ctx.fillStyle = ink;
    const dry: number[] = [];
    const under: number[] = [];
    for (let b = 0; b < coast.buildingCount; b++) {
      const [cx, cy] = gx(coast.buildings[b * 2], coast.buildings[b * 2 + 1]);
      const idx = Math.min(dem.z.length - 1, (Math.round(cy) * dem.width + Math.round(cx)) | 0);
      if (wet[idx]) { flooded++; under.push(cx, cy); } else dry.push(cx, cy);
      if (tub[idx]) bathtubFlooded++;
    }

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = ink;
    for (let i = 0; i < dry.length; i += 2) ctx.fillRect(dry[i] * S - 0.5, dry[i + 1] * S - 0.5, 1.1, 1.1);
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = signal;
    for (let i = 0; i < under.length; i += 2) ctx.fillRect(under[i] * S - 0.6, under[i + 1] * S - 0.6, 1.4, 1.4);
    ctx.globalAlpha = 1;

    // ── critical infrastructure ──────────────────────────────────────────────
    let criticalUnder = 0;
    for (let c = 0; c < coast.criticalIdx.length; c++) {
      const b = coast.criticalIdx[c];
      const [cx, cy] = gx(coast.buildings[b * 2], coast.buildings[b * 2 + 1]);
      const idx = Math.min(dem.z.length - 1, (Math.round(cy) * dem.width + Math.round(cx)) | 0);
      const isUnder = !!wet[idx];
      if (isUnder) criticalUnder++;
      ctx.beginPath();
      ctx.arc(cx * S, cy * S, 3.6, 0, Math.PI * 2);
      ctx.strokeStyle = isUnder ? signal : ink;
      ctx.lineWidth = isUnder ? 1.3 : 0.9;
      ctx.stroke();
    }

    // ── the waterline itself ─────────────────────────────────────────────────
    drawSegs(contour(dem, level), signal, 1.15);

    // ── road length under water ──────────────────────────────────────────────
    const mx = dem.metresPerSampleX;
    const my = dem.metresPerSampleY;
    let roadM = 0;
    p = 0;
    for (let r = 0; r < coast.roadRuns.length; r++) {
      const n = coast.roadRuns[r];
      let prevX = 0;
      let prevY = 0;
      for (let k = 0; k < n; k++) {
        const [cx, cy] = gx(coast.roadXY[p * 2], coast.roadXY[p * 2 + 1]);
        if (k > 0) {
          const midX = (cx + prevX) / 2;
          const midY = (cy + prevY) / 2;
          const idx = Math.min(dem.z.length - 1, (Math.round(midY) * dem.width + Math.round(midX)) | 0);
          if (wet[idx]) {
            const dx = (cx - prevX) * mx;
            const dy = (cy - prevY) * my;
            roadM += Math.hypot(dx, dy);
          }
        }
        prevX = cx;
        prevY = cy;
        p++;
      }
    }

    let wetCells = 0;
    for (let i = 0; i < wet.length; i++) wetCells += wet[i];

    // ── frame and graticule ──────────────────────────────────────────────────
    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, side - 1, side - 1);

    // Scale bar: 2 km, measured off the real sample spacing.
    const kmPx = (2000 / mx) * S;
    const bx = side - kmPx - 16;
    const by = side - 20;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + kmPx, by);
    ctx.moveTo(bx, by - 3.5);
    ctx.lineTo(bx, by + 3.5);
    ctx.moveTo(bx + kmPx, by - 3.5);
    ctx.lineTo(bx + kmPx, by + 3.5);
    ctx.stroke();
    ctx.font = '9px var(--font-mono, monospace)';
    ctx.fillStyle = ink3;
    ctx.fillText('2 km', bx + kmPx / 2 - 11, by - 7);

    setStats({
      buildings: flooded,
      critical: criticalUnder,
      roadKm: roadM / 1000,
      areaKm2: (wetCells * mx * my) / 1e6,
      bathtubBuildings: bathtubFlooded,
    });
  }, [data, level, showBathtub, scratch, toGrid]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const ro = new ResizeObserver(() => draw());
    if (wrapRef.current) ro.observe(wrapRef.current);
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, [draw]);

  const pct = data ? ((stats?.buildings ?? 0) / data.coast.buildingCount) * 100 : 0;

  return (
    <div className={styles.rig}>
      <div className={styles.canvasWrap} ref={wrapRef}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Biscayne Bay under ${level.toFixed(2)} metres of sea level rise: ${stats?.buildings ?? 0} buildings and ${(stats?.roadKm ?? 0).toFixed(1)} kilometres of road inundated.`}
        />
        {!data ? <span className={styles.loading}>loading 65,536 elevation samples…</span> : null}
      </div>

      <div className={styles.controls}>
        <div className={styles.sliderRow}>
          <label className="label" htmlFor="sea">
            waterline
          </label>
          <input
            id="sea"
            className="slider"
            type="range"
            min={0}
            max={4}
            step={0.05}
            value={level}
            onChange={e => setLevel(+e.target.value)}
          />
          <output className={`num ${styles.level}`}>
            +{level.toFixed(2)}
            <span className="unit"> m</span>
          </output>
        </div>

        <div className={styles.readouts}>
          <Readout label="buildings under" value={stats ? stats.buildings.toLocaleString() : '—'} sub={`${pct.toFixed(1)}%`} />
          <Readout label="road under" value={stats ? stats.roadKm.toFixed(1) : '—'} sub="km" />
          <Readout label="hospitals / schools" value={stats ? String(stats.critical) : '—'} sub={data ? `of ${data.coast.criticalIdx.length}` : ''} />
          <Readout label="area under" value={stats ? stats.areaKm2.toFixed(1) : '—'} sub="km²" />
        </div>

        <div className={styles.toggleRow}>
          <button
            className="switch"
            data-on={showBathtub}
            aria-pressed={showBathtub}
            onClick={() => setShowBathtub(v => !v)}
          >
            show bathtub difference
          </button>
          {showBathtub && stats ? (
            <span className={styles.diff}>
              a bathtub fill claims{' '}
              <strong className="num">{(stats.bathtubBuildings - stats.buildings).toLocaleString()}</strong>{' '}
              more buildings — low ground the sea cannot reach
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Readout({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className={styles.readout}>
      <span className="label">{label}</span>
      <span className={`num ${styles.value}`}>
        {value}
        {sub ? <span className="unit"> {sub}</span> : null}
      </span>
    </div>
  );
}
