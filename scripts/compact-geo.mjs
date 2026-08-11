// Repacks the fetched OSM JSON into a form worth shipping.
//
// Coordinates are quantised onto a 16-bit grid spanning each dataset's own
// bbox and stored as base64 uint16. At these bbox sizes one step is about
// 0.17 m north-south — far finer than OSM's own positional accuracy, so the
// quantisation is lossless in every sense that matters and cuts the payload
// by roughly 6x.
import { readFileSync, writeFileSync } from 'node:fs';

const u16 = arr => Buffer.from(new Uint16Array(arr).buffer).toString('base64');
const dir = new URL('../public/data/', import.meta.url);

function quantiser(b) {
  const lonSpan = b.east - b.west;
  const latSpan = b.north - b.south;
  return {
    x: lon => Math.max(0, Math.min(65535, Math.round(((lon - b.west) / lonSpan) * 65535))),
    y: lat => Math.max(0, Math.min(65535, Math.round(((b.north - lat) / latSpan) * 65535))),
  };
}

// ── coast ────────────────────────────────────────────────────────────────────
{
  const src = JSON.parse(readFileSync(new URL('osm-coast.json', dir), 'utf8'));
  const q = quantiser(src.bbox);

  const bxy = [];
  const criticalIdx = [];
  const criticalKind = [];
  const KINDS = ['hospital', 'clinic', 'school', 'college', 'university', 'fire_station', 'police'];
  src.buildings.forEach((b, i) => {
    bxy.push(q.x(b.lon), q.y(b.lat));
    if (b.c) {
      criticalIdx.push(i);
      criticalKind.push(KINDS.indexOf(b.c));
    }
  });

  // Roads flatten to one coordinate stream plus a run-length list, which
  // avoids an array-of-arrays and its per-entry overhead entirely.
  const rxy = [];
  const runs = [];
  const kinds = [];
  for (const r of src.roads) {
    runs.push(r.g.length);
    kinds.push(r.k);
    for (const [lon, lat] of r.g) rxy.push(q.x(lon), q.y(lat));
  }

  writeFileSync(
    new URL('coast.json', dir),
    JSON.stringify({
      source: src.source,
      fetched: src.fetched,
      bbox: src.bbox,
      buildingCount: src.buildings.length,
      buildings: u16(bxy),
      criticalIdx: u16(criticalIdx),
      criticalKind: criticalKind.join(''),
      criticalKinds: KINDS,
      roadCount: src.roads.length,
      roadRuns: u16(runs),
      roadKinds: kinds.join(''),
      roadXY: u16(rxy),
    }),
  );
  console.log(`coast: ${src.buildings.length} buildings, ${src.roads.length} roads, ${rxy.length / 2} road points`);
}

// ── walk ─────────────────────────────────────────────────────────────────────
{
  const src = JSON.parse(readFileSync(new URL('osm-walk.json', dir), 'utf8'));
  const q = quantiser(src.bbox);

  const nxy = [];
  for (const [lon, lat] of src.nodes) nxy.push(q.x(lon), q.y(lat));

  const ea = [];
  const shade = [];
  for (const [a, b, s] of src.edges) {
    ea.push(a, b);
    shade.push(s);
  }

  const pack = pts => {
    const out = [];
    for (const [lon, lat] of pts) out.push(q.x(lon), q.y(lat));
    return u16(out);
  };

  writeFileSync(
    new URL('walk.json', dir),
    JSON.stringify({
      source: src.source,
      fetched: src.fetched,
      bbox: src.bbox,
      nodeCount: src.nodes.length,
      edgeCount: src.edges.length,
      nodes: u16(nxy),
      edges: u16(ea),
      canopyPrior: u16(shade),
      trees: pack(src.trees),
      parks: pack(src.parks),
      buildings: pack(src.footprints),
    }),
  );
  console.log(`walk: ${src.nodes.length} nodes, ${src.edges.length} edges, ${src.trees.length} trees`);
}
