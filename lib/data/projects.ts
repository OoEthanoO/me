import type { StationId } from '@/lib/scale';

export type Status = 'live' | 'active' | 'complete' | 'research' | 'archived' | 'scrapped';

export interface Metric {
  k: string;
  v: string;
  unit?: string;
  emph?: boolean;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  /** log10 of the subject's characteristic size, in metres. */
  z: number | null;
  station?: StationId;
  status: Status;
  years: string;
  stack: string[];
  repo?: string;
  live?: string;
  isPrivate?: boolean;
  commits?: number;
  summary: string;
  /** Why it is on the site at all — the one non-obvious thing. */
  point?: string;
  metrics?: Metric[];
  caveat?: string;
}

export const STATUS_LABEL: Record<Status, string> = {
  live: 'live',
  active: 'in progress',
  complete: 'complete',
  research: 'published',
  archived: 'archived',
  scrapped: 'scrapped',
};

export const PROJECTS: Project[] = [
  {
    slug: 'yanlearn',
    name: 'YanLearn',
    tagline: 'Free tutoring for grades 6–12, run by high schoolers.',
    z: 1,
    station: 'classroom',
    status: 'live',
    years: '2025–26',
    stack: ['Next.js', 'Supabase', 'Postgres', 'Discord API', 'Vitest'],
    live: 'https://learn.ethanyanxu.com',
    isPrivate: true,
    commits: 411,
    summary:
      'Accounts, courses, enrolments, scheduling, reminders and admin tooling for a volunteer tutoring programme that teaches over Discord. Every table is RLS-locked with deny-all policies and reached only through service-role API routes. A reconciliation loop continuously drives the Discord server — membership, roles, channels, nicknames — back into agreement with the website, and the reminders cron creates temporary live-class voice channels on a schedule.',
    point:
      'The largest thing here by a wide margin, and the only one with students depending on it. Reconciling two systems that both think they own the truth is the hard part, and it runs unattended.',
    metrics: [
      { k: 'Commits', v: '411', emph: true },
      { k: 'Raised for SickKids', v: '$3,480', emph: true },
      { k: 'Volunteer hours submitted', v: '331', unit: 'h' },
      { k: 'Grades served', v: '6–12' },
    ],
  },
  {
    slug: 'water-level',
    name: 'Water-level residual correction',
    tagline: 'Peer-reviewed. Terrain features correct a tide model’s residuals.',
    z: 5.6,
    station: 'gauges',
    status: 'research',
    years: '2025',
    stack: ['XGBoost', 'LightGBM', 'rasterio', 'pandas', 'NOAA CO-OPS'],
    repo: 'https://github.com/OoEthanoO/water-level-residual-ml',
    summary:
      'Harmonic tide predictions leave a residual — the part driven by weather, wind setup and the shape of the seabed and shore. This work shows that geospatial terrain features around a gauge carry enough signal to correct that residual, and that a terrain-aware XGBoost model beats a purely temporal LightGBM baseline. Published in The Columbia Junior Science Journal, Volume 11.',
    point:
      'Peer-reviewed and in print, written in high school. The interesting claim is not the model, it is that terrain around the gauge is a usable feature at all.',
    metrics: [
      { k: 'Autoregressive RMSE', v: '0.0763', unit: 'm', emph: true },
      { k: 'Stations', v: '15' },
      { k: 'Journal', v: 'CJSJ v11' },
      { k: 'Pages', v: '1–6' },
    ],
    caveat:
      'Figure 6 is not saved anywhere in the research repo: two validation scripts write to the same filename, so whichever ran last silently overwrote the other. Regenerating it reproduced the published 0.0763 m exactly.',
  },
  {
    slug: 'cora',
    name: 'CORA',
    tagline: 'Coastal flood risk, and what a sea wall actually buys you.',
    z: 4.4,
    station: 'coast',
    status: 'complete',
    years: '2025–26',
    stack: ['Python', 'PyQt6', 'GeoPandas', 'OSMnx', 'rasterio', 'reportlab'],
    repo: 'https://github.com/OoEthanoO/cora_project',
    commits: 23,
    summary:
      'A desktop application that loads a DEM, floods it with a connected-inundation model referenced to a real NOAA tidal baseline, and then counts what went under: buildings, kilometres of road, hospitals and schools, and — via WorldPop rasters — people. You can draw sea walls at a chosen height and wetland restoration areas with a flood-reduction factor, then export the whole assessment as a PDF.',
    point:
      'Connected flooding rather than a bathtub fill, which is the difference between a model that floods low ground behind a barrier and one that does not.',
    metrics: [
      { k: 'Version', v: 'v0.5.0' },
      { k: 'Ships as', v: '.dmg' },
      { k: 'Tidal baseline', v: 'NOAA' },
      { k: 'Exposure raster', v: 'WorldPop' },
    ],
  },
  {
    slug: 'coolroute',
    name: 'CoolRoute',
    tagline: 'Walk by shade, not just distance.',
    z: 3.4,
    station: 'streets',
    status: 'complete',
    years: '2026',
    stack: ['Next.js', 'OSM/Overpass', 'Leaflet', 'NOAA NWS', 'Open-Meteo'],
    repo: 'https://github.com/OoEthanoO/coolroute',
    summary:
      'A heat-safe pedestrian navigator built for the ASPIRE hackathon. It extracts a walking graph from OpenStreetMap, computes the sun’s altitude and azimuth astronomically for your chosen walk time, gives every edge a shade fraction from tree canopy, building shadows and park cooling, then runs Dijkstra twice — once for the shortest route and once weighted by sun exposure — and shows you the trade in plain terms: 16% less sun for one minute of extra walking.',
    point:
      'It states the price of the recommendation instead of just making it. Everything is static and client-side — no backend, no API keys.',
    metrics: [
      { k: 'Graph nodes', v: '48,579', emph: true },
      { k: 'Graph edges', v: '56,415' },
      { k: 'Building footprints', v: '5,128' },
      { k: 'Route time', v: '<50', unit: 'ms' },
    ],
    caveat:
      'OSM has only 19 individually mapped trees in Claremont, so tree shade uses priors by street type. Building shadows use footprint proximity and sun geometry, not true 3D ray casting.',
  },
  {
    slug: 'stroj',
    name: 'stroj',
    tagline: 'A self-hosted online judge, sandbox included.',
    z: 0,
    station: 'origin',
    status: 'complete',
    years: '2026',
    stack: ['Python', 'FastAPI', 'SQLite', 'vanilla JS'],
    repo: 'https://github.com/OoEthanoO/stroj-v2',
    commits: 69,
    summary:
      'Submit code against a problem’s test data; the judge compiles it, runs it under time, memory and output limits, compares against the answer and returns a verdict. Contests come with timed windows and ICPC or IOI scoreboards, subtasks with explicit point shares, and three output checkers. No Docker, no Redis, no build step — Python and SQLite in WAL mode, with judging on plain threads because the work is subprocess-bound.',
    point:
      'The sandbox writeup is the real artifact. It documents that macOS accepts RLIMIT_AS and then ignores it, so an RSS sampler *is* the memory limit there — and it reports the isolation actually in force rather than the one you asked for.',
    metrics: [
      { k: 'Languages', v: 'C++20, Java 21, Py3' },
      { k: 'Verdicts', v: '8' },
      { k: 'Scoreboards', v: 'ICPC, IOI' },
      { k: 'Runtime deps', v: 'none', emph: true },
    ],
    caveat:
      'Not a container, not a VM, and not a defence against someone who is actually trying. Adequate for a classroom or a practice server; not for hostile submissions from the open internet.',
  },
  {
    slug: 'finprint',
    name: 'finprint',
    tagline: 'What is calling, and how sure can we honestly be?',
    z: 6.6,
    station: 'basin',
    status: 'live',
    years: '2026',
    stack: ['PyTorch', 'librosa', 'FastAPI', 'Docker', 'Cloud Run'],
    repo: 'https://github.com/OoEthanoO/finprint',
    live: 'https://finprint.ethanyanxu.com',
    commits: 21,
    summary:
      'Upload or record a clip and finprint returns the marine mammal most likely to have made it — a CNN over log-mel spectrograms across 32 species — plus the call’s acoustic structure and the measurements behind that judgement. It leads with the family rather than the species, because the model’s mistakes stay inside the family: it confuses one dolphin for another, not a dolphin for a seal.',
    point:
      'The honesty engineering is the project. Silence and noise are rejected by measuring the audio, not by trusting confidence — a closed-set softmax is *more* certain on white noise (0.95) than on a quiet real call.',
    metrics: [
      { k: 'Group accuracy', v: '0.979', emph: true },
      { k: 'Species accuracy', v: '0.906' },
      { k: 'Top-3', v: '0.965' },
      { k: 'Macro-F1', v: '0.878' },
      { k: 'Shown-as-answer accuracy', v: '0.973' },
      { k: 'Species', v: '32' },
    ],
    caveat:
      'Call type is signal analysis with documented thresholds, not a trained model — the Watkins database has no call-type labels. A clip from any species outside the 32 still comes back as its nearest match.',
  },
  {
    slug: 'orgchem',
    name: 'orgchem',
    tagline: 'Type the formula the way you write it by hand.',
    z: -9.8,
    station: 'bond',
    status: 'complete',
    years: '2026',
    stack: ['Next.js', 'TypeScript', 'OpenChemLib', 'OPSIN', 'PubChem'],
    repo: 'https://github.com/OoEthanoO/orgchem',
    summary:
      'Type anything that names or describes an organic compound and see its structure: condensed structural formulas, IUPAC names, trade names, SMILES, or a bare molecular formula. A resolution cascade tries each reading in turn, and a stage only wins if what it produced actually parses.',
    point:
      'The condensed-formula parser is the part no name-to-structure service handles, and it is valence-driven rather than heuristic — which is what lets it decide whether (CH₃) is a branch or a repeat unit by asking what still has a bond free.',
    metrics: [
      { k: 'Dictionary compounds', v: '~260' },
      { k: 'Isomers, C₆H₁₄O', v: '32 on file' },
      { k: 'Stereo pairs', v: '3D, shared rotation' },
    ],
    caveat:
      'Predicted properties are estimates from OpenChemLib’s models, not measurements. The offline name parser covers introductory nomenclature only and defers to OPSIN beyond that.',
  },
  {
    slug: 'cuda-from-scratch',
    name: 'cuda-from-scratch',
    tagline: 'Eight SGEMM kernels, and the three measurement bugs found along the way.',
    z: -7.6,
    station: 'memory',
    status: 'complete',
    years: '2026',
    stack: ['CUDA C++', 'Tesla T4', 'cuBLAS (as baseline only)'],
    repo: 'https://github.com/OoEthanoO/cuda-from-scratch',
    commits: 7,
    summary:
      'A neural network written entirely in hand-authored CUDA C++ — no PyTorch, no cuDNN, cuBLAS present only as the thing to be measured against. The artifact is the optimisation ladder: eight kernels, each one change from the last, each with the hardware reason it helped. A host emulator for the CUDA execution model means kernel logic is debugged on a laptop with no GPU; only timing needs silicon.',
    point:
      'It records predictions before each run and scores them afterwards — including one that came out backwards, one that turned out to be explaining noise, and one where he was wrong about his own error bars.',
    metrics: [
      { k: 'Naive → dispatched', v: '3.2% → 94.3%', emph: true },
      { k: 'End to end', v: '~28×' },
      { k: 'Correctness checks', v: '322' },
      { k: 'Across-session spread', v: '5–15%' },
    ],
    caveat:
      'The headline is one run of six. Across Colab sessions the same code moves 5–15%, cuBLAS included: the dispatcher scored 94.3%, 84.5% and 88.0% in three consecutive rounds without a line changing.',
  },
  {
    slug: 'colorectal-cancer',
    name: 'colorectal-cancer',
    tagline: 'Tissue class from a histology tile.',
    z: -4.8,
    station: 'tissue',
    status: 'archived',
    years: '2024',
    stack: ['Python', 'CNN', 'Flask'],
    repo: 'https://github.com/OoEthanoO/colorectal-cancer',
    summary:
      'A classifier over colorectal histology tiles with a small web front end for dropping an image in and getting a tissue class back. Early work, and it shows next to the later projects — but it is the first thing here that took a real medical imaging dataset seriously rather than a toy one.',
    metrics: [{ k: 'Classes', v: 'mucosa, debris, …' }],
    caveat:
      'From 2024 and not maintained. Included because the trajectory matters, not because the model is good by current standards.',
  },
  {
    slug: 'ad-eeg',
    name: 'ad_eeg',
    tagline: 'Alzheimer’s detection from electroencephalography.',
    z: -1,
    station: 'device',
    status: 'archived',
    years: '2025',
    stack: ['Python', 'MNE', 'C'],
    isPrivate: true,
    summary:
      'Signal processing and classification over resting-state EEG recordings, aimed at separating Alzheimer’s patients from controls. Private, and by far the largest dataset handled here.',
    metrics: [{ k: 'Repo size', v: '≈126', unit: 'GB' }],
    caveat: 'Private repository — the data is not redistributable.',
  },
  {
    slug: 'yanpresence',
    name: 'yanpresence',
    tagline: 'Apple Music → Discord, laid out like Discord’s own Spotify integration.',
    z: -1,
    station: 'device',
    status: 'complete',
    years: '2026',
    stack: ['Node.js', 'AppleScript', 'Discord IPC', 'ffmpeg', 'S3/R2'],
    repo: 'https://github.com/OoEthanoO/yanpresence',
    commits: 9,
    summary:
      'Watches the Music app over Apple Events and mirrors playback into Discord: the song on the status line rather than the artist, 1024×1024 album art, three clickable links through to Apple Music, a live progress bar with seek detection, and animated album art transcoded from Apple’s HLS motion masters to AVIF.',
    point:
      'It is a protocol-archaeology project. Discord will not render a cdn.discordapp.com attachment as a presence asset because those URLs carry a mandatory signed query string — confirmed by bisecting until the identical JPEG rendered from Apple’s CDN and failed from Discord’s.',
    metrics: [
      { k: 'Album art', v: '1024²' },
      { k: 'Animated art', v: 'AVIF' },
    ],
  },
  {
    slug: 'ethantodolist',
    name: 'EthanToDoList',
    tagline: 'A todo list that schedules itself.',
    z: -1,
    station: 'device',
    status: 'complete',
    years: '2025',
    stack: ['Swift', 'SwiftUI', 'SwiftData'],
    repo: 'https://github.com/OoEthanoO/EthanTodoList',
    commits: 21,
    summary:
      'An iOS task manager with automatic time allocation, Pomodoro streaks and daily progress tracking, built on SwiftData with local notifications.',
  },
  {
    slug: 'macam',
    name: 'Macam',
    tagline: 'The camera app the Mac does not ship with.',
    z: -1,
    station: 'device',
    status: 'complete',
    years: '2024',
    stack: ['Swift', 'SwiftUI', 'AppKit', 'AVFoundation'],
    repo: 'https://github.com/STRNerds/Macam',
    commits: 20,
    summary:
      'A small macOS app for taking a picture with the built-in camera without opening Photo Booth. Built with Dean (Penguin60).',
  },
  {
    slug: 'yan-dashboard',
    name: 'YanDashboard',
    tagline: 'Academic tracking with the grades encrypted end to end.',
    z: 1,
    station: 'classroom',
    status: 'live',
    years: '2025',
    stack: ['React Native', 'Expo', 'MongoDB', 'Node.js'],
    repo: 'https://github.com/OoEthanoO/yan-dashboard',
    live: 'https://dashboard.ethanyanxu.com',
    commits: 52,
    summary:
      'Assignments, courses, study sessions and grades, cross-platform via Expo, with grade storage encrypted end to end so the server cannot read them.',
  },
  {
    slug: 'yantodolist',
    name: 'YanToDoList',
    tagline: 'Cloud-synced tasks with a scheduling automator.',
    z: 1,
    station: 'classroom',
    status: 'live',
    years: '2025',
    stack: ['Next.js', 'Postgres', 'Prisma', 'NextAuth', 'SWR'],
    live: 'https://todo.ethanyanxu.com',
    isPrivate: true,
    commits: 25,
    summary:
      'Tasks with cloud sync, OAuth, and an automator that creates recurring tasks on flexible schedules with six different due-date strategies — relative, specific, dynamic, same-day, end-of-period, or none.',
  },
  {
    slug: 'musicgen',
    name: 'Steerable MusicGen',
    tagline: 'Continuous AI music you steer while it plays.',
    z: null,
    status: 'complete',
    years: '2026',
    stack: ['Next.js', 'Web Audio', 'Replicate', 'MusicGen'],
    repo: 'https://github.com/OoEthanoO/musicgen',
    summary:
      'Eight-second chunks, each conditioned on the previous one, buffered ahead and crossfaded in the Web Audio API by a lookahead scheduler. Edit the prompt mid-playback and the next chunk follows.',
    point:
      'It ships a keyless procedural synth backend so the whole steering, buffering and crossfade path works offline with no API token — the risky parts were solved before the model was plugged in.',
  },
  {
    slug: 'yanstudio',
    name: 'YanStudio',
    tagline: 'The freelance practice, in two languages.',
    z: null,
    status: 'live',
    years: '2026',
    stack: ['Next.js 16', 'React 19', 'TypeScript'],
    isPrivate: true,
    summary:
      'A bilingual marketing site for commissioned work — websites, iOS apps, AI agents, consulting. The content lives in one typed dictionary per language, and adding a field to one language makes the compiler demand it in the other, so the two cannot silently drift.',
  },
  {
    slug: 'dotfiles',
    name: 'dotfiles',
    tagline: 'Arch, Hyprland, and a NixOS configuration.',
    z: null,
    status: 'complete',
    years: '2025',
    stack: ['Hyprland', 'Neovim', 'Waybar', 'Nix'],
    repo: 'https://github.com/OoEthanoO/dotfiles',
    commits: 8,
    summary: 'The Arch Linux setup, plus a separate declarative NixOS configuration.',
  },
];

/**
 * The graveyard. Shown deliberately: a portfolio that hides what was abandoned
 * is a brochure. Each one is here with what it was and why it stopped.
 */
export const SCRAPPED: { name: string; what: string; why: string }[] = [
  {
    name: 'gate-to-glass',
    what: 'An RV32I core in Verilog on an iCE40, with a display controller, sigma-delta audio and a 16-step sequencer in firmware.',
    why: 'Reached 1.51 CPI in simulation and a machine-checked board design, then stopped before fabrication.',
  },
  {
    name: 'silicon-to-sapphire',
    what: 'A second RISC-V core with a small kernel, I²C, an IMU driver and a Swift link library.',
    why: 'Overlapped with gate-to-glass; the second core taught less than the first.',
  },
  {
    name: 'silicon-to-skin',
    what: 'A PPG wearable — HR and HRV from an optical pulse sensor on an nRF52840, with the DSP verified against a Python oracle before any hardware shipped.',
    why: 'Blocked on physical parts. The signal chain was proven in software and never met a wrist.',
  },
  {
    name: 'sensor-to-screen',
    what: 'A soil-moisture sensor and the iPhone app that refuses to lie about it.',
    why: 'Firmware and app both verified, 44 firmware tests and 41 app tests passing. No ESP32 was ever flashed.',
  },
  {
    name: 'feeding-the-beast',
    what: 'A GPT trained end to end on hand-written CUDA kernels, reaching 95 ms/step against torch’s 64.8.',
    why: 'The CUDA line consolidated into cuda-from-scratch.',
  },
  {
    name: 'yanengine',
    what: 'An LLM inference engine in CUDA C++, benchmarked against cuBLAS, vLLM and TensorRT-LLM.',
    why: 'Same consolidation.',
  },
];

export const BY_SLUG = new Map(PROJECTS.map(p => [p.slug, p]));
export const BY_STATION = PROJECTS.reduce((m, p) => {
  if (p.station) (m[p.station] ??= []).push(p);
  return m;
}, {} as Record<string, Project[]>);
