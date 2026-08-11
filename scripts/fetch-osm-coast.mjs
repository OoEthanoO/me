// Real OSM building footprints, roads and critical infrastructure for the CORA
// station's bbox (downtown Miami and Miami Beach).
//
// Buildings come back as centroids rather than full polygons: at 10^5 m a
// footprint is sub-pixel, and the flood counters only need a centroid to look
// up against the DEM. The bbox is dense enough that one building query times
// out on every public mirror, so it is tiled.
import { writeFileSync } from 'node:fs';
import { overpass } from './overpass.mjs';

const B = { south: 25.735, north: 25.825, west: -80.205, east: -80.105 };
const bbox = `${B.south},${B.west},${B.north},${B.east}`;
const CRITICAL = ['hospital', 'clinic', 'school', 'college', 'university', 'fire_station', 'police'];
const TILES = 4;

const buildings = [];
for (let ty = 0; ty < TILES; ty++) {
  for (let tx = 0; tx < TILES; tx++) {
    const s0 = B.south + (ty / TILES) * (B.north - B.south);
    const s1 = B.south + ((ty + 1) / TILES) * (B.north - B.south);
    const w0 = B.west + (tx / TILES) * (B.east - B.west);
    const w1 = B.west + ((tx + 1) / TILES) * (B.east - B.west);
    process.stderr.write(`buildings tile ${ty * TILES + tx + 1}/${TILES * TILES}\n`);
    const b = await overpass(`[out:json][timeout:120];
way["building"](${s0},${w0},${s1},${w1});
out center tags qt;`);
    for (const el of b.elements) {
      const c = el.center;
      if (!c) continue;
      const t = el.tags || {};
      const amenity = t.amenity || t.healthcare || '';
      buildings.push({
        lat: +c.lat.toFixed(5),
        lon: +c.lon.toFixed(5),
        c: CRITICAL.includes(amenity) ? amenity : undefined,
      });
    }
  }
}

process.stderr.write('roads...\n');
const r = await overpass(`[out:json][timeout:180];
way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street)$"](${bbox});
out geom qt;`);

const roads = r.elements
  .filter(e => e.geometry?.length > 1)
  .map(e => ({
    k: ({ motorway: 3, trunk: 3, primary: 3, secondary: 2, tertiary: 2 })[e.tags.highway] ?? 1,
    g: e.geometry.map(p => [+p.lon.toFixed(5), +p.lat.toFixed(5)]),
  }));

writeFileSync(
  new URL('../public/data/osm-coast.json', import.meta.url),
  JSON.stringify({
    source: 'OpenStreetMap contributors (ODbL) via Overpass API',
    fetched: new Date().toISOString().slice(0, 10),
    bbox: B,
    buildings,
    roads,
  }),
);
console.log(`buildings=${buildings.length} critical=${buildings.filter(x => x.c).length} roads=${roads.length}`);
