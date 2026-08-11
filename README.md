# ethanyanxu.com

A portfolio arranged along eighteen orders of magnitude.

The site opens at 10⁰ m — a person — and the work radiates outward in both
directions. Scroll one way and you pull back through a classroom, a street
network, a coastline, a tide-gauge network, an ocean basin. Scroll the other
and you push in through a phone, a spectrogram, a histology tile, a cache line,
down to a 1.54 Å carbon–carbon bond. Every station sits at its subject's real
physical size; the axis is not a metaphor laid over the work, it is a property
of it.

The navigation is the scale rule down the left edge. There is no menu.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Every station is a working instrument

Nothing on the traverse is a screenshot or a stored animation. The heavy ones:

| scale | station | what actually runs |
|---|---|---|
| 10⁵ m | **CORA** | Real SRTM elevation over Biscayne Bay with 14,399 OSM building centroids and 4,063 road ways. Dragging the waterline re-runs a connected-flood BFS over 65,536 cells, re-contours the shoreline by marching squares, and recounts the exposure. The bathtub toggle draws the difference: ground below the waterline the sea cannot reach. |
| 10⁴ m | **CoolRoute** | A real 12,108-node OSM walking graph, real astronomical solar position for the hour you pick, and Dijkstra run twice — once on distance, once weighted by sun exposure. Both solve in about 17 ms. Click to move the destination. |
| 10⁻³ m | **finprint** | The real front end of the model: microphone → Hann window → FFT → mel filterbank → log. Written out in `lib/dsp/mel.ts` rather than handed to `AnalyserNode`, because the transform is the point. |
| 10⁻⁸ m | **cuda-from-scratch** | Four WGSL compute kernels — naive, coalesced, workgroup-tiled, register-blocked — benchmarked live on the visitor's own GPU. |
| 10⁻¹⁰ m | **orgchem** | A valence-driven parser for condensed structural formulas and a from-scratch 2D depiction engine, with the resolution cascade shown: which stage claimed your input, and which fell through. |

## The two decisions worth reading the source for

**`lib/chem/parse.ts` — asking the structure, not the notation.** Condensed
formulas are genuinely ambiguous, and the way out is one question: what still
has a bond free? In `CH₃CH(CH₃)CH₃` the CH has a spare valence and CH₃ is
monovalent, so the parenthesis is a branch. In `CH₃(CH₂)₃CH₃` the CH₂ is
divalent and can carry the chain onward, so it is a repeat unit. Same two
symbols, opposite meanings, settled by counting bonds.

```bash
node scripts/test-chem.mjs   # 23 cases, including the ones the ambiguity table names
```

**`lib/gemm/ladder.ts` — measuring the code and not the running order.** Two
bugs were found and fixed here while building the page, and both are recorded
in the comments because they are the same failure modes the repository this
station is about documents:

- Giving the fast rungs more repeats than the slow ones (the obvious way to lift
  every measurement above the submission-overhead floor) flatters exactly the
  kernels that were already winning, because consecutive dispatches inside one
  compute pass overlap. One repeat count, used everywhere.
- Timing the reference first in every pair puts queue wake-up cost on the
  reference. It read 3.5× slower as the reference than as a rung, and the ratio
  column disagreed with the GFLOP/s column computed from the same samples.
  Fixed with a discarded primer and by alternating the order across rounds.

Every kernel is checked against a CPU reference before it is allowed to be
timed, each timing is paired with an adjacent reference timing and the median
*ratio* reported, and the spread is printed beside every number. Quote the
range, never an endpoint.

## Data

All of it is real, fetched once at build time and committed — the site never
calls an external API at runtime.

| file | source |
|---|---|
| `public/data/dem-miami.json` | NASA SRTM v3, 1 arc-second, via the AWS `elevation-tiles-prod` public dataset |
| `public/data/coast.json` | OpenStreetMap (ODbL) via Overpass — buildings, roads, critical infrastructure |
| `public/data/walk.json` | OpenStreetMap (ODbL) via Overpass — the Claremont walking graph, trees, parks |
| `public/paper/` | The published figures and PDF, *The Columbia Junior Science Journal*, Vol. 11 |

Coordinates are quantised onto a 16-bit grid spanning each dataset's bbox —
about 0.17 m per step, far finer than OSM's own positional accuracy — which
cuts the payload roughly 6×. Refetch with `npm run data:coast` / `data:walk`;
see `scripts/build-dem.mjs` for the DEM crop.

## Layout

```
app/                 the traverse (/), the index (/work), project pages
components/          Station, Plate, ScaleRule, Hud
components/instruments/   one file per instrument
lib/scale.ts         the axis: stations, weights, the powers-of-ten dissolve
lib/camera.ts        scroll → z, outside React
lib/chem/            condensed-formula parser and 2D depiction
lib/gemm/            the WGSL ladder and its measurement harness
lib/dsp/             FFT, Hann, mel filterbank
lib/geo/             DEM, connected flood, marching squares, Dijkstra, solar position
scripts/             the build-time data bake
```

`/work` is the counterweight: every project in one dense list, no scrolling
mechanic and no canvas, for anyone who wants the reference rather than the
argument. It includes the projects that were scrapped, and why.

## Notes

- Two typefaces: Newsreader for prose, IBM Plex Mono for every number. No
  gradients, no glow, one vermilion, reserved for things being measured now.
- The camera lives outside React — twelve stations repositioning at 60 fps is a
  style write, not a state update.
- The traverse scrolls inside its own element at a fixed pixel length. A
  viewport-relative spacer made the document's height a function of the
  window's, which on a tall display pushed it past 16,384 px, Chrome's maximum
  texture dimension, where the compositor stops painting the page at all.
- Instruments mount only when their station is within reach, so a WebGPU
  context or an audio graph is never created for a station nobody visited.
