// Crops the CORA station's DEM out of a real SRTM 1-arc-second tile.
//
// Source: NASA SRTM v3 (1", ~30 m) as redistributed by the AWS public
// elevation-tiles-prod dataset in Skadi (.hgt) form — raw big-endian int16,
// 3601x3601, row 0 at the tile's north edge, sample 0 at its west edge.
//
//   curl -o N25W081.hgt.gz \
//     https://s3.amazonaws.com/elevation-tiles-prod/skadi/N25/N25W081.hgt.gz
//   gunzip N25W081.hgt
//   node scripts/build-dem.mjs path/to/N25W081.hgt
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
if (!src) throw new Error('usage: build-dem.mjs <tile.hgt>');

const TILE_LAT = 25; // N25W081 → south-west corner
const TILE_LON = -81;
const DIM = 3601;
const VOID = -32768;

const B = { south: 25.735, north: 25.825, west: -80.205, east: -80.105 };
const OUT = 256;

const buf = readFileSync(src);
if (buf.length !== DIM * DIM * 2) throw new Error(`expected ${DIM * DIM * 2} bytes, got ${buf.length}`);

/** Nearest-sample lookup. Voids become null so they are never mistaken for 0 m. */
function sample(lat, lon) {
  const row = Math.round((TILE_LAT + 1 - lat) * (DIM - 1));
  const col = Math.round((lon - TILE_LON) * (DIM - 1));
  if (row < 0 || row >= DIM || col < 0 || col >= DIM) return null;
  const v = buf.readInt16BE((row * DIM + col) * 2);
  return v === VOID ? null : v;
}

const dm = new Int16Array(OUT * OUT); // decimetres
let min = Infinity;
let max = -Infinity;
let voids = 0;

for (let r = 0; r < OUT; r++) {
  const lat = B.north - (r / (OUT - 1)) * (B.north - B.south);
  for (let c = 0; c < OUT; c++) {
    const lon = B.west + (c / (OUT - 1)) * (B.east - B.west);
    const v = sample(lat, lon);
    if (v === null) {
      voids++;
      dm[r * OUT + c] = 0;
    } else {
      dm[r * OUT + c] = Math.max(-3000, Math.min(30000, Math.round(v * 10)));
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
}

// Histogram over the range that matters for a sea-level slider.
const hist = new Array(12).fill(0);
for (let i = 0; i < dm.length; i++) {
  const m = dm[i] / 10;
  hist[Math.max(0, Math.min(11, Math.floor(m)))]++;
}

const metresPerSampleX =
  (111320 * Math.cos(((B.north + B.south) / 2) * Math.PI / 180) * (B.east - B.west)) / (OUT - 1);
const metresPerSampleY = (110574 * (B.north - B.south)) / (OUT - 1);

writeFileSync(
  new URL('../public/data/dem-miami.json', import.meta.url),
  JSON.stringify({
    source: 'NASA SRTM v3, 1 arc-second (~30 m), via AWS elevation-tiles-prod (public domain)',
    tile: 'N25W081',
    note: 'Elevations are decimetres above the SRTM reference, base64 little-endian int16.',
    bbox: B,
    width: OUT,
    height: OUT,
    metresPerSampleX: +metresPerSampleX.toFixed(2),
    metresPerSampleY: +metresPerSampleY.toFixed(2),
    minMetres: min,
    maxMetres: max,
    voids,
    dm: Buffer.from(dm.buffer).toString('base64'),
  }),
);

console.log(`${OUT}x${OUT}  ${min}..${max} m  voids=${voids}  ~${metresPerSampleX.toFixed(0)}x${metresPerSampleY.toFixed(0)} m/sample`);
console.log('histogram 0..11 m:', hist.join(' '));
