'use client';

/**
 * The scale rule: the only navigation on the site.
 *
 * It is a real logarithmic rule. Major ticks are decades, minor ticks are the
 * 2,3,…,9 subdivisions inside each decade, so their spacing is genuinely
 * log-distributed rather than drawn evenly — which is the whole reason a slide
 * rule looks the way it does. The cursor reads out the scene width in metres.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { flyTo, getZ, subscribeFrame } from '@/lib/camera';
import { STATIONS, Z_MAX, Z_MIN, clampZ, decadeLabel, formatMetres } from '@/lib/scale';
import styles from './ScaleRule.module.css';

const DECADES: number[] = [];
for (let d = Math.ceil(Z_MAX); d >= Math.floor(Z_MIN); d--) DECADES.push(d);

/** Fraction down the rule for a given z. */
const frac = (z: number) => (Z_MAX - z) / (Z_MAX - Z_MIN);

export default function ScaleRule() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return subscribeFrame(z => {
      const c = cursorRef.current;
      if (c) c.style.top = `${frac(z) * 100}%`;
      const r = readoutRef.current;
      if (r) r.textContent = formatMetres(z);
    });
  }, []);

  const zFromPointer = useCallback((clientY: number) => {
    const el = trackRef.current;
    if (!el) return getZ();
    const box = el.getBoundingClientRect();
    const p = (clientY - box.top) / Math.max(1, box.height);
    return clampZ(Z_MAX - Math.min(1, Math.max(0, p)) * (Z_MAX - Z_MIN));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => flyTo(zFromPointer(e.clientY), false);
    const up = () => setDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [dragging, zFromPointer]);

  return (
    <div className={styles.rail} aria-hidden="false">
      <div className={styles.readout}>
        <span className="label">scene width</span>
        <span className={`num ${styles.metres}`} ref={readoutRef}>
          1.0 m
        </span>
      </div>

      <div
        className={styles.track}
        ref={trackRef}
        onPointerDown={e => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          setDragging(true);
          flyTo(zFromPointer(e.clientY), false);
        }}
      >
        <div className={styles.spine} />

        {DECADES.map(d => {
          const top = frac(d) * 100;
          if (top < -2 || top > 102) return null;
          return (
            <div key={d} className={styles.decade} style={{ top: `${top}%` }}>
              <span className={styles.tickMajor} />
              <span className={`num ${styles.decadeLabel}`}>{decadeLabel(d)}</span>
            </div>
          );
        })}

        {/* Minor ticks: the 2..9 subdivisions, log-spaced inside each decade. */}
        {DECADES.slice(0, -1).flatMap(d =>
          [2, 3, 4, 5, 6, 7, 8, 9].map(k => {
            const z = d - 1 + Math.log10(k);
            const top = frac(z) * 100;
            if (top < 0 || top > 100) return null;
            return (
              <span
                key={`${d}-${k}`}
                className={styles.tickMinor}
                style={{ top: `${top}%`, width: k === 5 ? 9 : 6 }}
              />
            );
          }),
        )}

        {STATIONS.map(s => (
          <button
            key={s.id}
            className={styles.station}
            style={{ top: `${frac(s.z) * 100}%` }}
            onClick={e => {
              e.stopPropagation();
              flyTo(s.z);
            }}
            onPointerDown={e => e.stopPropagation()}
          >
            <span className={styles.stationTick} />
            <span className={styles.stationLabel}>{s.rule}</span>
          </button>
        ))}

        <div className={styles.cursor} ref={cursorRef}>
          <span className={styles.cursorHair} />
        </div>
      </div>
    </div>
  );
}
