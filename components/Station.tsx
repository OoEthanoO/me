'use client';

/**
 * One station on the traverse.
 *
 * The powers-of-ten dissolve happens here, and it happens outside React: the
 * component subscribes to the camera and writes transform/opacity straight to
 * its own node. Re-rendering twelve subtrees per frame to move them would cost
 * far more than the instruments' own drawing.
 *
 * Instruments mount only once their station is within reach and unmount well
 * after it leaves, so a WebGPU context or an audio graph is never created for
 * a station the visitor has not travelled to.
 */

import { useEffect, useRef, useState } from 'react';
import { subscribeFrame } from '@/lib/camera';
import { scaleAt, weightAt, type Station as StationDef } from '@/lib/scale';
import styles from './Station.module.css';

interface Props {
  station: StationDef;
  /** The drawing — scales and fades with the camera. */
  figure: React.ReactNode;
  /** The text — fades but does not scale, so it stays readable. */
  plate: React.ReactNode;
  /** Mount the figure only when the station is this close, in decades. */
  mountWithin?: number;
}

export default function Station({ station, figure, plate, mountWithin = 2.2 }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let live = false;
    return subscribeFrame(z => {
      const w = weightAt(station, z);
      const near = Math.abs(z - station.z) < mountWithin;
      if (near !== live) {
        live = near;
        setMounted(near);
      }

      const root = rootRef.current;
      if (root) {
        root.style.opacity = String(w);
        root.style.visibility = w <= 0.001 ? 'hidden' : 'visible';
        root.style.pointerEvents = w > 0.55 ? 'auto' : 'none';
        root.setAttribute('aria-hidden', w > 0.4 ? 'false' : 'true');
      }

      const fig = figureRef.current;
      if (fig) {
        const s = scaleAt(station, z);
        fig.style.transform = `scale(${s.toFixed(4)})`;
      }

      const pl = plateRef.current;
      if (pl) {
        // The plate lags the figure slightly — it settles as you arrive
        // rather than sliding the whole way in with it.
        const t = Math.max(0, (w - 0.28) / 0.72);
        pl.style.opacity = String(t);
        pl.style.transform = `translateY(${((1 - t) * 14).toFixed(2)}px)`;
      }
    });
  }, [station, mountWithin]);

  return (
    <section
      ref={rootRef}
      className={styles.station}
      style={{ opacity: 0, visibility: 'hidden' }}
      data-station={station.id}
    >
      <div className={styles.figure} ref={figureRef}>
        {mounted ? figure : null}
      </div>
      <div className={styles.plate} ref={plateRef}>
        {plate}
      </div>
    </section>
  );
}
