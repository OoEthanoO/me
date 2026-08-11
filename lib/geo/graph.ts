/**
 * The walking graph, and Dijkstra over it twice.
 *
 * CoolRoute's claim is comparative — this route costs you a minute and saves
 * you sixteen percent of the sun — so the shortest path is not a baseline that
 * can be approximated. Both routes are computed exactly, over the same graph,
 * with the same solver, differing only in the edge cost.
 */

import { b64ToUint16 } from './dem';
import { sunPosition } from './solar';

export interface WalkGraph {
  bbox: { south: number; north: number; west: number; east: number };
  nodeCount: number;
  edgeCount: number;
  /** Quantised node coordinates, x/y interleaved. */
  nodes: Uint16Array;
  /** Edge endpoints, a/b interleaved. */
  edges: Uint16Array;
  /** Per-edge canopy prior, 0–100. */
  canopyPrior: Uint16Array;
  trees: Uint16Array;
  parks: Uint16Array;
  buildings: Uint16Array;
  /** CSR adjacency: offsets into `adjEdge`. */
  offsets: Int32Array;
  adjNode: Int32Array;
  adjEdge: Int32Array;
  /** Edge length in metres. */
  length: Float32Array;
  /** Edge bearing, degrees clockwise from north. */
  bearing: Float32Array;
  lon: Float32Array;
  lat: Float32Array;
}

let promise: Promise<WalkGraph> | null = null;

export function loadWalkGraph(): Promise<WalkGraph> {
  promise ??= fetch('/data/walk.json')
    .then(r => r.json())
    .then(j => build(j));
  return promise;
}

function build(j: {
  bbox: WalkGraph['bbox'];
  nodeCount: number;
  edgeCount: number;
  nodes: string;
  edges: string;
  canopyPrior: string;
  trees: string;
  parks: string;
  buildings: string;
}): WalkGraph {
  const nodes = b64ToUint16(j.nodes);
  const edges = b64ToUint16(j.edges);
  const canopyPrior = b64ToUint16(j.canopyPrior);
  const n = j.nodeCount;
  const m = j.edgeCount;

  // De-quantise once, into real coordinates.
  const lon = new Float32Array(n);
  const lat = new Float32Array(n);
  const lonSpan = j.bbox.east - j.bbox.west;
  const latSpan = j.bbox.north - j.bbox.south;
  for (let i = 0; i < n; i++) {
    lon[i] = j.bbox.west + (nodes[i * 2] / 65535) * lonSpan;
    lat[i] = j.bbox.north - (nodes[i * 2 + 1] / 65535) * latSpan;
  }

  const mPerDegLat = 110574;
  const mPerDegLon = 111320 * Math.cos(((j.bbox.north + j.bbox.south) / 2) * Math.PI / 180);

  const length = new Float32Array(m);
  const bearing = new Float32Array(m);
  const degree = new Int32Array(n);
  for (let e = 0; e < m; e++) {
    const a = edges[e * 2];
    const b = edges[e * 2 + 1];
    const dx = (lon[b] - lon[a]) * mPerDegLon;
    const dy = (lat[b] - lat[a]) * mPerDegLat;
    length[e] = Math.hypot(dx, dy);
    bearing[e] = (Math.atan2(dx, dy) * 180) / Math.PI;
    degree[a]++;
    degree[b]++;
  }

  // CSR, so the solver never allocates while it runs.
  const offsets = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) offsets[i + 1] = offsets[i] + degree[i];
  const cursor = Int32Array.from(offsets.subarray(0, n));
  const adjNode = new Int32Array(offsets[n]);
  const adjEdge = new Int32Array(offsets[n]);
  for (let e = 0; e < m; e++) {
    const a = edges[e * 2];
    const b = edges[e * 2 + 1];
    adjNode[cursor[a]] = b;
    adjEdge[cursor[a]++] = e;
    adjNode[cursor[b]] = a;
    adjEdge[cursor[b]++] = e;
  }

  return {
    bbox: j.bbox,
    nodeCount: n,
    edgeCount: m,
    nodes,
    edges,
    canopyPrior,
    trees: b64ToUint16(j.trees),
    parks: b64ToUint16(j.parks),
    buildings: b64ToUint16(j.buildings),
    offsets,
    adjNode,
    adjEdge,
    length,
    bearing,
    lon,
    lat,
  };
}

/**
 * Per-edge sun exposure in [0,1], for a given moment.
 *
 * Three contributions, all of them stated rather than tuned into a black box:
 * the canopy prior for the way's class (OSM maps too few individual trees to
 * route on — CoolRoute's own note is that Claremont has nineteen); a bonus for
 * mapped trees and parks actually near the edge; and building shadow, which
 * depends on the angle between the street and the sun, because a shadow cast
 * across a street shades it and one cast along it does not.
 */
export function exposureFor(
  g: WalkGraph,
  altitudeDeg: number,
  azimuthDeg: number,
  nearTree: Float32Array,
  nearBuilding: Float32Array,
): Float32Array {
  const exposure = new Float32Array(g.edgeCount);
  if (altitudeDeg <= 0) {
    // After sunset every edge is equally shaded, and saying so is more honest
    // than pretending the model still discriminates.
    exposure.fill(0);
    return exposure;
  }

  // A low sun throws long shadows, so buildings matter more; a high sun is
  // overhead and only canopy helps.
  const lowSun = Math.max(0, Math.min(1, (60 - altitudeDeg) / 60));

  for (let e = 0; e < g.edgeCount; e++) {
    const canopy = g.canopyPrior[e] / 100 + nearTree[e] * 0.25;

    // Angle between the street and the sun's azimuth. Perpendicular is 1.
    const rel = Math.abs(((g.bearing[e] - azimuthDeg + 540) % 360) - 180);
    const across = Math.abs(Math.sin((rel * Math.PI) / 180));
    const shadow = nearBuilding[e] * across * lowSun * 0.7;

    exposure[e] = Math.max(0, Math.min(1, 1 - canopy - shadow));
  }
  return exposure;
}

/** Proximity of mapped trees and buildings to each edge, computed once. */
export function proximity(g: WalkGraph): { tree: Float32Array; building: Float32Array } {
  const tree = new Float32Array(g.edgeCount);
  const building = new Float32Array(g.edgeCount);

  const cell = 400; // quantised units — a coarse grid is plenty for proximity
  const bucket = (arr: Uint16Array) => {
    const map = new Map<number, number[]>();
    for (let i = 0; i < arr.length; i += 2) {
      const key = ((arr[i] / cell) | 0) * 100000 + ((arr[i + 1] / cell) | 0);
      const list = map.get(key);
      if (list) list.push(i);
      else map.set(key, [i]);
    }
    return map;
  };
  const treeGrid = bucket(g.trees);
  const bldGrid = bucket(g.buildings);

  const count = (grid: Map<number, number[]>, x: number, y: number) => {
    let n = 0;
    const cx = (x / cell) | 0;
    const cy = (y / cell) | 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        n += grid.get((cx + dx) * 100000 + (cy + dy))?.length ?? 0;
      }
    }
    return n;
  };

  for (let e = 0; e < g.edgeCount; e++) {
    const a = g.edges[e * 2];
    const b = g.edges[e * 2 + 1];
    const mx = (g.nodes[a * 2] + g.nodes[b * 2]) / 2;
    const my = (g.nodes[a * 2 + 1] + g.nodes[b * 2 + 1]) / 2;
    tree[e] = Math.min(1, count(treeGrid, mx, my) / 4);
    building[e] = Math.min(1, count(bldGrid, mx, my) / 30);
  }
  return { tree, building };
}

export interface Route {
  nodes: number[];
  edges: number[];
  metres: number;
  /** Length-weighted mean sun exposure over the route. */
  exposure: number;
  /** Minutes at a 1.35 m/s walk. */
  minutes: number;
}

/**
 * Dijkstra with a binary heap over a typed-array graph.
 *
 * `weight` returns the cost of an edge; distance is always accumulated in
 * metres alongside it, so the two routes can be compared on the same terms
 * even though only one of them was optimised for distance.
 */
export function dijkstra(
  g: WalkGraph,
  from: number,
  to: number,
  weight: (edge: number) => number,
): Route | null {
  const n = g.nodeCount;
  const dist = new Float64Array(n).fill(Infinity);
  const prevNode = new Int32Array(n).fill(-1);
  const prevEdge = new Int32Array(n).fill(-1);
  const done = new Uint8Array(n);

  // Binary heap of (cost, node), in parallel typed arrays.
  const heapCost = new Float64Array(n * 4);
  const heapNode = new Int32Array(n * 4);
  let heapSize = 0;

  const push = (cost: number, node: number) => {
    if (heapSize >= heapNode.length) return;
    let i = heapSize++;
    heapCost[i] = cost;
    heapNode[i] = node;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heapCost[p] <= heapCost[i]) break;
      [heapCost[p], heapCost[i]] = [heapCost[i], heapCost[p]];
      [heapNode[p], heapNode[i]] = [heapNode[i], heapNode[p]];
      i = p;
    }
  };

  const pop = (): number => {
    const top = heapNode[0];
    heapSize--;
    if (heapSize > 0) {
      heapCost[0] = heapCost[heapSize];
      heapNode[0] = heapNode[heapSize];
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < heapSize && heapCost[l] < heapCost[m]) m = l;
        if (r < heapSize && heapCost[r] < heapCost[m]) m = r;
        if (m === i) break;
        [heapCost[m], heapCost[i]] = [heapCost[i], heapCost[m]];
        [heapNode[m], heapNode[i]] = [heapNode[i], heapNode[m]];
        i = m;
      }
    }
    return top;
  };

  dist[from] = 0;
  push(0, from);

  while (heapSize > 0) {
    const u = pop();
    if (done[u]) continue;
    done[u] = 1;
    if (u === to) break;
    for (let k = g.offsets[u]; k < g.offsets[u + 1]; k++) {
      const v = g.adjNode[k];
      if (done[v]) continue;
      const e = g.adjEdge[k];
      const nd = dist[u] + weight(e);
      if (nd < dist[v]) {
        dist[v] = nd;
        prevNode[v] = u;
        prevEdge[v] = e;
        push(nd, v);
      }
    }
  }

  if (!Number.isFinite(dist[to])) return null;

  const nodes: number[] = [];
  const edges: number[] = [];
  for (let v = to; v !== -1; v = prevNode[v]) {
    nodes.push(v);
    if (prevEdge[v] !== -1) edges.push(prevEdge[v]);
    if (v === from) break;
  }
  nodes.reverse();
  edges.reverse();

  return { nodes, edges, metres: 0, exposure: 0, minutes: 0 };
}

/** Fill in the comparable figures for a route. */
export function measure(g: WalkGraph, route: Route, exposure: Float32Array): Route {
  let metres = 0;
  let weighted = 0;
  for (const e of route.edges) {
    metres += g.length[e];
    weighted += exposure[e] * g.length[e];
  }
  route.metres = metres;
  route.exposure = metres > 0 ? weighted / metres : 0;
  route.minutes = metres / 1.35 / 60;
  return route;
}

/** Nearest graph node to a quantised point, by squared distance. */
export function nearestNode(g: WalkGraph, qx: number, qy: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < g.nodeCount; i++) {
    const dx = g.nodes[i * 2] - qx;
    const dy = g.nodes[i * 2 + 1] - qy;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export { sunPosition };
