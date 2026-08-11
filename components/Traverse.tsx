'use client';

import { useEffect, useRef } from 'react';
import { flyTo, getZ, jumpTo, startCamera } from '@/lib/camera';
import { STATIONS, TRAVERSE_PX, Z_HOME, decadeLabel, nearestStation } from '@/lib/scale';
import Station from './Station';
import Plate from './Plate';
import Hud from './Hud';
import ScaleRule from './ScaleRule';
import { PLATES } from './plates';
import styles from './Traverse.module.css';

export default function Traverse() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // The browser restores the previous scroll offset before React mounts,
    // which would drop a returning visitor at whatever magnification they left
    // at. The entry point is a designed thing: it is 10^0 m, and it is a person.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const stop = startCamera(el);

    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    const target = STATIONS.find(s => s.id === hash);
    // Deferred a frame: the spacer that gives the traverse its length has to be
    // laid out before an offset into it means anything.
    const entry = requestAnimationFrame(() => jumpTo(target ? target.z : Z_HOME));

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;

      const i = STATIONS.indexOf(nearestStation(getZ()));
      if (e.key === 'ArrowRight' || e.key === 'j') {
        if (i < STATIONS.length - 1) { e.preventDefault(); flyTo(STATIONS[i + 1].z); }
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        if (i > 0) { e.preventDefault(); flyTo(STATIONS[i - 1].z); }
      } else if (e.key === 'Home') {
        e.preventDefault();
        flyTo(Z_HOME);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(entry);
      stop();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      <a className="sr-only skip" href="/work">
        Skip the traverse — go to the plain index
      </a>

      <ScaleRule />
      <Hud />

      {/*
        The scroll surface. The stations are fixed-position children of it, so
        they pin to the viewport while a wheel or trackpad gesture anywhere over
        them still reaches this element — which is what makes the traverse move.
        The instruments inside stay clickable, because they are descendants
        rather than something layered underneath.
      */}
      <div className={styles.scroller} ref={scrollerRef}>
        <main className={styles.stage}>
          {STATIONS.map((s, i) => {
            const plate = PLATES[s.id];
            return (
              <Station
                key={s.id}
                station={s}
                figure={plate.figure}
                plate={
                  <Plate
                    index={i + 1}
                    scale={decadeLabel(Math.round(s.z))}
                    subject={s.subject}
                    project={s.project}
                    status={plate.status}
                    ruler={s.ruler}
                    rows={plate.rows}
                    rowsCaption={plate.rowsCaption}
                    caveat={plate.caveat}
                    links={plate.links}
                  >
                    {plate.body}
                  </Plate>
                }
              />
            );
          })}
        </main>

        <div style={{ height: `${TRAVERSE_PX + 1}px` }} aria-hidden="true" />
      </div>
    </>
  );
}
