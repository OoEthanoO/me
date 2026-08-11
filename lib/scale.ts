/**
 * The scale axis.
 *
 * The site is a single continuous traverse along z = log10(metres), where z is
 * the width of the scene in metres. Every station sits at its subject's real
 * physical size: a C–C bond really is 1.54 Å, a humpback really is 15 m, the
 * Claremont walking graph really is a few kilometres across. Nothing here is
 * placed for convenience.
 *
 * z increases outward (ocean basins) and decreases inward (atoms). The page
 * opens at z = 0 — human scale — and the work radiates in both directions.
 */

export const Z_MAX = 7.6;
export const Z_MIN = -10.6;
export const Z_HOME = 0;

/**
 * Pixels of scroll per decade of zoom.
 *
 * Absolute, not viewport-relative, and deliberately so: a `vh`-based spacer
 * makes the document's height a function of the window's, and on a tall
 * display that pushed it past 16,384 px — Chrome's maximum texture dimension —
 * where the compositor stops painting the page at all. A fixed length keeps
 * the whole traverse under that ceiling on every screen, and has the nicer
 * property that the scroll distance between two stations is the same for
 * everyone.
 */
export const PX_PER_DECADE = 750;

export type StationId =
  | 'basin'
  | 'gauges'
  | 'coast'
  | 'streets'
  | 'block'
  | 'classroom'
  | 'origin'
  | 'device'
  | 'click'
  | 'tissue'
  | 'memory'
  | 'bond';

export interface Station {
  id: StationId;
  /** Centre of the station on the log axis. */
  z: number;
  /** How many decades either side it remains on screen. */
  span: number;
  /** Short label for the scale rule. */
  rule: string;
  /** What you are looking at, at this size. */
  subject: string;
  /** The measurement that justifies the placement. */
  ruler: string;
  project: string;
}

export const STATIONS: Station[] = [
  {
    id: 'basin',
    z: 6.6,
    span: 1.15,
    rule: 'ocean basin',
    subject: 'The ocean basin',
    ruler: 'baleen song carries 10–100 km',
    project: 'finprint',
  },
  {
    id: 'gauges',
    z: 5.6,
    span: 1.0,
    rule: 'gauge network',
    subject: 'Fifteen tide gauges',
    ruler: 'station spacing ~10⁵ m',
    project: 'Water-level residual correction — CJSJ v11',
  },
  {
    id: 'coast',
    z: 4.4,
    span: 1.15,
    rule: 'the coastline',
    subject: 'A coastline under a metre of water',
    ruler: '10 km of Biscayne Bay, Copernicus DEM',
    project: 'CORA',
  },
  {
    id: 'streets',
    z: 3.4,
    span: 1.0,
    rule: 'street network',
    subject: 'Every sidewalk in a town',
    ruler: '3 km of Claremont, CA',
    project: 'coolroute',
  },
  {
    id: 'block',
    z: 2.0,
    span: 1.0,
    rule: 'the block',
    subject: 'One block, and the shadow it throws',
    ruler: 'a 30 m building at 20° solar altitude casts 82 m',
    project: 'coolroute — shade model',
  },
  {
    id: 'classroom',
    z: 1.0,
    span: 0.9,
    rule: 'the classroom',
    subject: 'A room with students in it',
    ruler: '~10 m',
    project: 'YanLearn',
  },
  {
    id: 'origin',
    z: 0,
    span: 0.85,
    rule: 'you are here',
    subject: 'A person at a keyboard',
    ruler: '1.0 m',
    project: 'stroj — and the record',
  },
  {
    id: 'device',
    z: -1,
    span: 0.9,
    rule: 'hand & head',
    subject: 'What fits in a hand, and what sits on a scalp',
    ruler: '150 mm · 10–20 electrode spacing ~50 mm',
    project: 'the Apple suite · ad_eeg',
  },
  {
    id: 'click',
    z: -2.6,
    span: 1.15,
    rule: 'the click',
    subject: 'One echolocation click',
    ruler: '≈3 mm at 120 kHz in seawater',
    project: 'finprint — the DSP',
  },
  {
    id: 'tissue',
    z: -4.8,
    span: 1.3,
    rule: 'tissue',
    subject: 'Colonic mucosa at 20×',
    ruler: 'an epithelial cell, ~15 µm',
    project: 'colorectal-cancer',
  },
  {
    id: 'memory',
    z: -7.6,
    span: 1.4,
    rule: 'memory hierarchy',
    subject: 'A cache line, and the warp that missed it',
    ruler: 'a 128 B line on a ~10 nm process',
    project: 'cuda-from-scratch',
  },
  {
    id: 'bond',
    z: -9.8,
    span: 1.2,
    rule: 'the bond',
    subject: 'A carbon–carbon single bond',
    ruler: '1.54 Å',
    project: 'orgchem',
  },
];

export const STATION_BY_ID = new Map(STATIONS.map(s => [s.id, s]));

/** Total scroll length of the traverse, in pixels. */
export const TRAVERSE_PX = Math.round((Z_MAX - Z_MIN) * PX_PER_DECADE);

/** Scroll progress in [0,1] → z. Scrolling down zooms in. */
export function progressToZ(p: number): number {
  return Z_MAX - p * (Z_MAX - Z_MIN);
}

/** z → scroll progress in [0,1]. */
export function zToProgress(z: number): number {
  return (Z_MAX - z) / (Z_MAX - Z_MIN);
}

export function clampZ(z: number): number {
  return Math.min(Z_MAX, Math.max(Z_MIN, z));
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * How present a station is at the current z, in [0,1]. Flat-topped so a station
 * holds still while you read it, then falls off smoothly at the edges.
 */
export function weightAt(station: Station, z: number): number {
  const d = Math.abs(z - station.z);
  const plateau = station.span * 0.34;
  if (d <= plateau) return 1;
  const t = (d - plateau) / (station.span - plateau);
  return t >= 1 ? 0 : smoothstep(1 - t);
}

/**
 * The powers-of-ten dissolve: a station is small when you are zoomed out from
 * it and overruns the frame as you pass through it. The exponent is compressed
 * from the true 10× per decade, which is unreadably fast on a screen.
 */
export function scaleAt(station: Station, z: number): number {
  return Math.pow(10, (station.z - z) * 0.42);
}

export function nearestStation(z: number): Station {
  let best = STATIONS[0];
  let bestD = Infinity;
  for (const s of STATIONS) {
    const d = Math.abs(s.z - z);
    if (d < bestD) { bestD = d; best = s; }
  }
  return best;
}

/** "1.54 Å", "10 km", "3 mm" — a physical length rendered the way an
 *  instrument would label it. */
export function formatMetres(z: number): string {
  const m = Math.pow(10, z);
  const units: [number, string, number][] = [
    [1e6, 'Mm', 0],
    [1e3, 'km', 0],
    [1, 'm', 0],
    [1e-2, 'cm', 0],
    [1e-3, 'mm', 0],
    [1e-6, 'µm', 0],
    [1e-9, 'nm', 0],
    [1e-10, 'Å', 1],
  ];
  for (const [factor, label, dp] of units) {
    if (m >= factor * 0.999) {
      const v = m / factor;
      const digits = v >= 100 ? 0 : v >= 10 ? 0 : dp || (v >= 1 ? 1 : 2);
      return `${v.toFixed(digits)} ${label}`;
    }
  }
  return `${(m / 1e-12).toFixed(0)} pm`;
}

/** The exponent label: 10⁻⁸ etc. */
const SUPER: Record<string, string> = {
  '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
};

export function superscript(n: number): string {
  return String(n).split('').map(c => SUPER[c] ?? c).join('');
}

export function decadeLabel(n: number): string {
  return `10${superscript(n)} m`;
}
