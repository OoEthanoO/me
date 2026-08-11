/**
 * 2D depiction: turning a molecular graph into something a chemist recognises.
 *
 * Chains are drawn as the 120° zig-zag everyone expects, branches take the
 * free side, and rings are laid out as regular polygons. The rule for picking
 * a direction is the same everywhere: of the candidate angles at 60° steps,
 * take the one that lands furthest from every atom already on the page. That
 * one rule handles straight chains, branch points and substituted rings
 * without any of them being a special case.
 */

import type { Molecule } from './parse';

export const BOND = 1;

export interface Point {
  x: number;
  y: number;
}

export interface Depiction {
  pos: Point[];
  /** Atoms folded into a neighbour's label rather than drawn. */
  hidden: boolean[];
  /** Hydrogens shown in an atom's label, after folding. */
  labelH: number[];
  rings: number[][];
  width: number;
  height: number;
  minX: number;
  minY: number;
}

function adjacency(mol: Molecule): number[][] {
  const adj: number[][] = mol.atoms.map(() => []);
  for (const b of mol.bonds) {
    adj[b.a].push(b.b);
    adj[b.b].push(b.a);
  }
  return adj;
}

/** Every simple cycle, found by removing tree-like atoms until only rings remain. */
function findRings(mol: Molecule, adj: number[][]): number[][] {
  const degree = adj.map(a => a.length);
  const removed = new Array(mol.atoms.length).fill(false);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < degree.length; i++) {
      if (!removed[i] && degree[i] <= 1) {
        removed[i] = true;
        changed = true;
        for (const j of adj[i]) if (!removed[j]) degree[j]--;
      }
    }
  }

  const rings: number[][] = [];
  const seen = new Set<number>();
  for (let start = 0; start < mol.atoms.length; start++) {
    if (removed[start] || seen.has(start)) continue;
    // Walk the cycle this atom belongs to.
    const ring = [start];
    seen.add(start);
    let prev = -1;
    let cur = start;
    for (;;) {
      const next = adj[cur].find(n => !removed[n] && n !== prev && !seen.has(n));
      if (next === undefined) break;
      ring.push(next);
      seen.add(next);
      prev = cur;
      cur = next;
    }
    if (ring.length >= 3) rings.push(ring);
  }
  return rings;
}

const RAD = Math.PI / 180;

export function depict(mol: Molecule): Depiction {
  const n = mol.atoms.length;
  const adj = adjacency(mol);
  const rings = findRings(mol, adj);
  const ringOf = new Map<number, number>();
  rings.forEach((r, i) => r.forEach(a => ringOf.set(a, i)));

  // Explicit single-bonded hydrogens are folded into their neighbour's label:
  // a chemist writes CHO, not C with a stick to an H.
  const hidden = new Array<boolean>(n).fill(false);
  const labelH = mol.atoms.map(a => a.h);
  for (let i = 0; i < n; i++) {
    if (mol.atoms[i].el === 'H' && adj[i].length === 1) {
      hidden[i] = true;
      labelH[adj[i][0]]++;
    }
  }

  const pos: Point[] = new Array(n);
  const placed: boolean[] = new Array(n).fill(false);

  const dist2 = (p: Point, q: Point) => (p.x - q.x) ** 2 + (p.y - q.y) ** 2;

  /** Distance from a candidate position to the nearest atom already drawn. */
  function clearance(from: Point, angle: number): number {
    const p = { x: from.x + Math.cos(angle * RAD) * BOND, y: from.y + Math.sin(angle * RAD) * BOND };
    let score = Infinity;
    for (let i = 0; i < n; i++) {
      if (!placed[i] || hidden[i]) continue;
      score = Math.min(score, dist2(p, pos[i]));
    }
    return score;
  }

  /**
   * The first candidate with room, falling back to the roomiest.
   *
   * Order matters more than the scoring does. A straight chain has two equally
   * clear options at every step, so a pure "furthest from everything" rule
   * turns the same way each time and coils the molecule into a spiral. The
   * caller puts the alternating choice first, and this only overrides it when
   * that choice would actually collide.
   */
  function pickAngle(from: Point, candidates: number[]): number {
    const ROOM = 0.8 * 0.8;
    let best = candidates[0];
    let bestScore = -Infinity;
    for (const a of candidates) {
      const score = clearance(from, a);
      if (score >= ROOM) return a;
      if (score > bestScore) {
        bestScore = score;
        best = a;
      }
    }
    return best;
  }

  function placeRing(ringIdx: number, entry: number, entryPos: Point, inDir: number) {
    const ring = rings[ringIdx];
    const k = ring.length;
    const interior = 360 / k;
    // Centre sits one circumradius along the incoming direction.
    const R = BOND / (2 * Math.sin(Math.PI / k));
    const cx = entryPos.x + Math.cos(inDir * RAD) * R;
    const cy = entryPos.y + Math.sin(inDir * RAD) * R;
    const startAngle = Math.atan2(entryPos.y - cy, entryPos.x - cx) / RAD;

    const order = ring.indexOf(entry) === -1 ? ring : rotate(ring, ring.indexOf(entry));
    order.forEach((atom, i) => {
      const a = (startAngle + i * interior) * RAD;
      pos[atom] = { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
      placed[atom] = true;
    });
  }

  function rotate<T>(arr: T[], k: number): T[] {
    return arr.slice(k).concat(arr.slice(0, k));
  }

  // Depth-first, iterative, so a long chain cannot blow the stack.
  // `flip` alternates the turn so the chain zig-zags along the page instead of
  // curling; starting at -30° with the first turn positive lays it horizontal.
  const stack: { atom: number; from: number; dir: number; flip: boolean }[] = [];
  const root = mol.atoms.findIndex((_, i) => !hidden[i]);
  pos[root] = { x: 0, y: 0 };
  placed[root] = true;

  if (ringOf.has(root)) placeRing(ringOf.get(root)!, root, pos[root], 0);

  for (const nb of adj[root]) if (!hidden[nb]) stack.push({ atom: nb, from: root, dir: -30, flip: true });

  const guard = n * 8;
  let steps = 0;
  while (stack.length && steps++ < guard) {
    const { atom, from, dir, flip } = stack.pop()!;
    if (hidden[atom]) continue;

    if (!placed[atom]) {
      const ring = ringOf.get(atom);
      const turn = flip ? 60 : -60;
      // A ring is entered straight on so the bond into it points at the ring's
      // centre; a chain turns by 60°, alternating, which is the 120° zig-zag.
      const candidates = ring !== undefined
        ? [dir, dir + turn, dir - turn, dir + 120, dir - 120]
        : [dir + turn, dir - turn, dir, dir + 120, dir - 120, dir + 180];
      const a = pickAngle(pos[from], candidates);
      pos[atom] = {
        x: pos[from].x + Math.cos(a * RAD) * BOND,
        y: pos[from].y + Math.sin(a * RAD) * BOND,
      };
      placed[atom] = true;
      if (ring !== undefined) placeRing(ring, atom, pos[atom], a);
    }

    const outDir = Math.atan2(pos[atom].y - pos[from].y, pos[atom].x - pos[from].x) / RAD;
    // The first neighbour continues the chain and keeps alternating; any others
    // are branches and take the opposite turn so they leave the backbone.
    let first = true;
    for (const nb of adj[atom]) {
      if (nb === from || hidden[nb] || placed[nb]) continue;
      stack.push({ atom: nb, from: atom, dir: outDir, flip: first ? !flip : flip });
      first = false;
    }
  }

  // Anything unreachable (a disconnected fragment) is parked to the right.
  let park = 0;
  for (let i = 0; i < n; i++) {
    if (!placed[i] && !hidden[i]) {
      pos[i] = { x: 3 + park * 1.5, y: 0 };
      placed[i] = true;
      park++;
    }
    pos[i] ??= { x: 0, y: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    if (hidden[i]) continue;
    minX = Math.min(minX, pos[i].x);
    maxX = Math.max(maxX, pos[i].x);
    minY = Math.min(minY, pos[i].y);
    maxY = Math.max(maxY, pos[i].y);
  }

  return {
    pos,
    hidden,
    labelH,
    rings,
    minX,
    minY,
    width: Math.max(1e-3, maxX - minX),
    height: Math.max(1e-3, maxY - minY),
  };
}
