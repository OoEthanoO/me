'use client';

/**
 * The fixed chrome: who this is, where you are on the axis, and the two ways
 * out (the index, and the theme). Deliberately thin — the rule is the
 * navigation, and this is the instrument's nameplate.
 */

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { flyTo, getActiveStation, subscribeStation } from '@/lib/camera';
import { PROFILE } from '@/lib/data/profile';
import { STATIONS, Z_HOME } from '@/lib/scale';
import styles from './Hud.module.css';

function useActiveStation() {
  return useSyncExternalStore(
    subscribeStation,
    () => getActiveStation(),
    () => STATIONS[6],
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') setTheme(stored);
    else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  return (
    <button
      className={styles.chromeBtn}
      onClick={() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem('theme', next);
        } catch {}
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} plate`}
      title="Plate stock"
    >
      {theme === 'dark' ? 'dark plate' : 'light plate'}
    </button>
  );
}

export default function Hud() {
  const active = useActiveStation();

  return (
    <>
      <header className={styles.top}>
        <button className={styles.name} onClick={() => flyTo(Z_HOME)} title="Return to 10⁰ m">
          {PROFILE.name}
        </button>
        <span className={styles.sub}>
          an atlas by scale · {PROFILE.location}
        </span>

        <nav className={styles.chrome}>
          <span className={styles.where} aria-live="polite">
            {active.rule}
          </span>
          <Link className={styles.chromeBtn} href="/work">
            index
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <footer className={styles.bottom}>
        <span className="label">
          scroll to change scale · ← → between stations
        </span>
        <span className={styles.credit}>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">
            github/{PROFILE.handle}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </span>
      </footer>
    </>
  );
}
