'use client';

/**
 * CoolRoute, at 10^4 m.
 *
 * A real OSM walking graph, real astronomical sun position for the hour you
 * pick, and Dijkstra run twice — once on distance, once on distance weighted
 * by sun exposure. Click anywhere to move the destination and both routes are
 * re-solved.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  dijkstra,
  exposureFor,
  loadWalkGraph,
  measure,
  nearestNode,
  proximity,
  sunPosition,
  type Route,
  type WalkGraph,
} from '@/lib/geo/graph';
import { localHourToDate } from '@/lib/geo/solar';
import styles from './Streets.module.css';

const css = (el: HTMLElement, name: string) => getComputedStyle(el).getPropertyValue(name).trim();

/** Claremont, CA — the town CoolRoute was built for. */
const UTC_OFFSET = -7;

export default function Streets() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [g, setG] = useState<WalkGraph | null>(null);
  const [hour, setHour] = useState(15.5);
  const [weight, setWeight] = useState(1.6);
  const [ends, setEnds] = useState<{ a: number; b: number } | null>(null);
  const [routes, setRoutes] = useState<{ short: Route; cool: Route } | null>(null);
  const [solveMs, setSolveMs] = useState(0);

  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadWalkGraph()
      .then(graph => {
        if (!alive) return;
        setG(graph);
        // Two nodes far enough apart that the two routes can actually differ.
        const a = nearestNode(graph, 12000, 48000);
        const b = nearestNode(graph, 52000, 16000);
        setEnds({ a, b });
      })
      .catch((e: unknown) => {
        // Without this the instrument sits on "loading…" forever and says
        // nothing about why, which is the one thing it must not do.
        if (alive) setFailed(e instanceof Error ? e.message : String(e));
      });
    return () => { alive = false; };
  }, []);

  const prox = useMemo(() => (g ? proximity(g) : null), [g]);

  const sun = useMemo(
    () => sunPosition(localHourToDate(hour, UTC_OFFSET), 34.1, -117.71),
    [hour],
  );

  const exposure = useMemo(
    () => (g && prox ? exposureFor(g, sun.altitude, sun.azimuth, prox.tree, prox.building) : null),
    [g, prox, sun],
  );

  // Solve both routes whenever anything they depend on moves.
  useEffect(() => {
    if (!g || !exposure || !ends) return;
    const t0 = performance.now();
    const short = dijkstra(g, ends.a, ends.b, e => g.length[e]);
    const cool = dijkstra(g, ends.a, ends.b, e => g.length[e] * (1 + weight * exposure[e]));
    const dt = performance.now() - t0;
    if (short && cool) {
      setRoutes({ short: measure(g, short, exposure), cool: measure(g, cool, exposure) });
      setSolveMs(dt);
    }
  }, [g, exposure, ends, weight]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !g || !exposure) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const box = wrap.getBoundingClientRect();
    const side = Math.max(120, Math.min(box.width, box.height));
    canvas.width = Math.round(side * dpr);
    canvas.height = Math.round(side * dpr);
    canvas.style.width = `${side}px`;
    canvas.style.height = `${side}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, side, side);

    const ink3 = css(wrap, '--ink-3');
    const signal = css(wrap, '--signal');
    const second = css(wrap, '--second');
    const rule = css(wrap, '--rule');

    const S = side / 65535;
    const X = (i: number) => g.nodes[i * 2] * S;
    const Y = (i: number) => g.nodes[i * 2 + 1] * S;

    // The network, drawn once, shaded by how much sun each edge gets.
    ctx.lineWidth = 0.55;
    ctx.lineCap = 'round';
    for (let e = 0; e < g.edgeCount; e++) {
      const a = g.edges[e * 2];
      const b = g.edges[e * 2 + 1];
      const ex = exposure[e];
      ctx.strokeStyle = ink3;
      ctx.globalAlpha = 0.12 + ex * 0.5;
      ctx.beginPath();
      ctx.moveTo(X(a), Y(a));
      ctx.lineTo(X(b), Y(b));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const drawRoute = (route: Route, colour: string, width: number, dash: number[]) => {
      ctx.save();
      ctx.setLineDash(dash);
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      route.nodes.forEach((nd, i) => {
        if (i === 0) ctx.moveTo(X(nd), Y(nd));
        else ctx.lineTo(X(nd), Y(nd));
      });
      ctx.stroke();
      ctx.restore();
    };

    if (routes) {
      drawRoute(routes.short, second, 1.6, [4, 3]);
      drawRoute(routes.cool, signal, 2.1, []);
    }

    if (ends) {
      for (const [nd, label] of [[ends.a, 'A'], [ends.b, 'B']] as const) {
        ctx.beginPath();
        ctx.arc(X(nd), Y(nd), 4, 0, Math.PI * 2);
        ctx.fillStyle = css(wrap, '--paper-raised');
        ctx.fill();
        ctx.strokeStyle = css(wrap, '--ink');
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = css(wrap, '--ink');
        ctx.font = '8px var(--font-mono, monospace)';
        ctx.fillText(label, X(nd) - 2.5, Y(nd) - 7);
      }
    }

    // A compass needle showing where the sun actually is.
    const cx = side - 34;
    const cy = 34;
    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.stroke();
    if (sun.altitude > 0) {
      const a = (sun.azimuth - 90) * (Math.PI / 180);
      ctx.strokeStyle = signal;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 14, cy + Math.sin(a) * 14);
      ctx.stroke();
    }
    ctx.fillStyle = ink3;
    ctx.font = '7px var(--font-mono, monospace)';
    ctx.fillText('N', cx - 2, cy - 18);

    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, side - 1, side - 1);
  }, [g, exposure, routes, ends, sun]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const ro = new ResizeObserver(() => draw());
    if (wrapRef.current) ro.observe(wrapRef.current);
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, [draw]);

  const onPick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!g || !ends) return;
    const r = e.currentTarget.getBoundingClientRect();
    const qx = ((e.clientX - r.left) / r.width) * 65535;
    const qy = ((e.clientY - r.top) / r.height) * 65535;
    setEnds({ a: ends.a, b: nearestNode(g, qx, qy) });
  };

  const saving = routes
    ? (routes.short.exposure - routes.cool.exposure) / Math.max(1e-6, routes.short.exposure)
    : 0;
  const costMin = routes ? routes.cool.minutes - routes.short.minutes : 0;

  return (
    <div className={styles.rig}>
      <div className={styles.canvasWrap} ref={wrapRef}>
        <canvas
          ref={canvasRef}
          onClick={onPick}
          className={styles.canvas}
          role="img"
          aria-label={
            routes
              ? `Two walking routes across Claremont: the shortest is ${Math.round(routes.short.metres)} metres, the shaded route ${Math.round(routes.cool.metres)} metres with ${Math.round(saving * 100)} percent less sun.`
              : 'Loading the walking graph'
          }
        />
        {!g && !failed ? <span className={styles.loading}>loading 12,108 nodes…</span> : null}
        {failed ? <span className={styles.loading}>graph unavailable — {failed}</span> : null}
      </div>

      <p className={styles.verdict}>
        {routes ? (
          <>
            <strong className="num">{(saving * 100).toFixed(0)}%</strong> less sun for{' '}
            <strong className="num">
              {costMin > 0.05 ? `${costMin.toFixed(1)} min` : 'no'}
            </strong>{' '}
            {costMin > 0.05 ? 'of extra walking' : 'extra walking'}
            {sun.altitude <= 0 ? ' — though the sun is down, so every route is equally shaded' : ''}
          </>
        ) : (
          'solving…'
        )}
      </p>

      <div className={styles.controls}>
        <div className={styles.row}>
          <label className="label" htmlFor="hour">hour</label>
          <input
            id="hour" className="slider" type="range" min={5} max={21} step={0.25}
            value={hour} onChange={e => setHour(+e.target.value)}
          />
          <output className={`num ${styles.out}`}>
            {String(Math.floor(hour)).padStart(2, '0')}:{String(Math.round((hour % 1) * 60)).padStart(2, '0')}
          </output>
        </div>

        <div className={styles.row}>
          <label className="label" htmlFor="w">shade weight</label>
          <input
            id="w" className="slider" type="range" min={0} max={4} step={0.1}
            value={weight} onChange={e => setWeight(+e.target.value)}
          />
          <output className={`num ${styles.out}`}>{weight.toFixed(1)}</output>
        </div>

        <div className={styles.readouts}>
          <Cell label="sun altitude" value={`${sun.altitude.toFixed(1)}°`} />
          <Cell label="azimuth" value={`${sun.azimuth.toFixed(0)}°`} />
          <Cell label="shortest" value={routes ? `${Math.round(routes.short.metres)} m` : '—'} tone="second" />
          <Cell label="coolroute" value={routes ? `${Math.round(routes.cool.metres)} m` : '—'} tone="signal" />
          <Cell label="both solved in" value={`${solveMs.toFixed(1)} ms`} />
        </div>

        <span className={styles.hint}>click the map to move B</span>
      </div>
    </div>
  );
}

function Cell({ label, value, tone }: { label: string; value: string; tone?: 'signal' | 'second' }) {
  return (
    <div className={styles.cell}>
      <span className="label">{label}</span>
      <span className={`num ${styles.value}`} data-tone={tone}>{value}</span>
    </div>
  );
}
