/**
 * The camera along the scale axis.
 *
 * Native scroll drives it — a very tall spacer gives real scrollbars, real
 * trackpad inertia, real keyboard paging and a real position to deep-link to,
 * none of which a hijacked wheel handler gives you for free.
 *
 * The store is deliberately outside React. Twelve stations repositioning at
 * 60 fps is not a state update; it is a style write, and doing it through
 * React's reconciler would cost more than the drawing does. Components
 * subscribe and mutate their own node. Only a change of *which* station is
 * active is a real state change, and that has its own, much rarer, signal.
 */

import { Z_MAX, Z_MIN, clampZ, nearestStation, progressToZ, zToProgress, type Station } from './scale';

type Listener = (z: number) => void;

let z = 0;
let raf = 0;
let started = false;
let scroller: HTMLElement | null = null;
const frameListeners = new Set<Listener>();
const stationListeners = new Set<() => void>();
let activeStation: Station | null = null;

function scrollRange(): number {
  if (!scroller) return 1;
  return Math.max(1, scroller.scrollHeight - scroller.clientHeight);
}

function read() {
  const p = (scroller?.scrollTop ?? 0) / scrollRange();
  const next = progressToZ(Math.min(1, Math.max(0, p)));
  if (next !== z) {
    z = next;
    for (const fn of frameListeners) fn(z);
    const s = nearestStation(z);
    if (s !== activeStation) {
      activeStation = s;
      for (const fn of stationListeners) fn();
    }
  }
  raf = 0;
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(read);
}

/**
 * The traverse scrolls inside its own element rather than the document.
 *
 * This keeps the camera's input independent of document height and of the
 * mobile viewport chrome that changes it mid-gesture, and it means nothing
 * else on the page can move the camera by scrolling the window.
 */
export function startCamera(el: HTMLElement): () => void {
  scroller = el;
  if (started) return () => {};
  started = true;
  el.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  read();
  return () => {
    started = false;
    el.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (raf) cancelAnimationFrame(raf);
    scroller = null;
  };
}

export function getZ(): number {
  return z;
}

export function subscribeFrame(fn: Listener): () => void {
  frameListeners.add(fn);
  fn(z);
  return () => frameListeners.delete(fn);
}

export function subscribeStation(fn: () => void): () => void {
  stationListeners.add(fn);
  return () => stationListeners.delete(fn);
}

export function getActiveStation(): Station {
  return activeStation ?? nearestStation(z);
}

export function scrollYForZ(target: number): number {
  return zToProgress(clampZ(target)) * scrollRange();
}

/** Jump the camera. Honours the user's motion preference. */
export function flyTo(target: number, smooth = true) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scroller?.scrollTo({ top: scrollYForZ(target), behavior: smooth && !reduce ? 'smooth' : 'auto' });
}

/** Set the camera with no animation. */
export function jumpTo(target: number) {
  scroller?.scrollTo({ top: scrollYForZ(target), behavior: 'auto' });
  read();
}

export { Z_MAX, Z_MIN };
