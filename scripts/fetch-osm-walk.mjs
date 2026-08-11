// Real pedestrian walking graph for central Claremont, CA — the same OSM way
// classes coolroute routes over, plus the shade inputs (mapped trees, parks,
// building footprints). Trimmed to the core so the baked graph stays small
// enough to ship; coolroute's own graph is 48,579 nodes over greater Claremont.
import { writeFileSync } from 'node:fs';
import { overpass } from './overpass.mjs';
const B = { south: 34.086, north: 34.116, west: -117.734, east: -117.694 };
const bbox = `${B.south},${B.west},${B.north},${B.east}`;
process.stderr.write('ways...\n');
const w = await overpass(`[out:json][timeout:180];
way["highway"~"^(footway|path|pedestrian|steps|residential|living_street|service|unclassified|tertiary|secondary|primary)$"]
   ["foot"!="no"]["access"!="private"](${bbox});
out geom qt;`);

// Build a node-deduplicated graph. Coordinates are quantised to ~1 m, which is
// also what merges ways that meet at an intersection.
const key = (lon, lat) => `${lon.toFixed(5)},${lat.toFixed(5)}`;
const idOf = new Map(); const nodes = [];
function node(lon, lat) {
  const k = key(lon, lat);
  let i = idOf.get(k);
  if (i === undefined) { i = nodes.length; idOf.set(k, i); nodes.push([+lon.toFixed(5), +lat.toFixed(5)]); }
  return i;
}
// canopy priors by way class — coolroute's approach where individually mapped
// trees are too sparse to route on
const PRIOR = { footway: 0.55, path: 0.5, pedestrian: 0.45, steps: 0.4, residential: 0.45,
  living_street: 0.4, service: 0.3, unclassified: 0.25, tertiary: 0.2, secondary: 0.12, primary: 0.08 };

const edges = [];
for (const e of w.elements) {
  const g = e.geometry; if (!g || g.length < 2) continue;
  const prior = PRIOR[e.tags.highway] ?? 0.25;
  for (let i = 1; i < g.length; i++) {
    const a = node(g[i - 1].lon, g[i - 1].lat), b = node(g[i].lon, g[i].lat);
    if (a !== b) edges.push([a, b, Math.round(prior * 100)]);
  }
}

process.stderr.write('trees, parks, buildings...\n');
const extra = await overpass(`[out:json][timeout:180];
(node["natural"="tree"](${bbox});
 way["leisure"~"^(park|garden)$"](${bbox});
 way["building"](${bbox}););
out center qt;`);
const trees = [], parks = [], footprints = [];
for (const el of extra.elements) {
  const t = el.tags || {};
  if (t.natural === 'tree' && el.lat) trees.push([+el.lon.toFixed(5), +el.lat.toFixed(5)]);
  else if (t.leisure && el.center) parks.push([+el.center.lon.toFixed(5), +el.center.lat.toFixed(5)]);
  else if (t.building && el.center) footprints.push([+el.center.lon.toFixed(5), +el.center.lat.toFixed(5)]);
}

writeFileSync(new URL('../public/data/osm-walk.json', import.meta.url), JSON.stringify({
  source: 'OpenStreetMap contributors (ODbL) via Overpass API',
  fetched: new Date().toISOString().slice(0, 10),
  bbox: B, nodes, edges, trees, parks, footprints,
}));
console.log(`nodes=${nodes.length} edges=${edges.length} trees=${trees.length} parks=${parks.length} buildings=${footprints.length}`);
