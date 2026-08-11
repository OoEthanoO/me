'use client';

import type { ReactNode } from 'react';
import type { Row, PlateLink } from './Plate';
import type { StationId } from '@/lib/scale';
import { PAPER } from '@/lib/data/profile';

import Coast from './instruments/Coast';
import Bond from './instruments/Bond';
import Memory from './instruments/Memory';
import Streets from './instruments/Streets';
import Click from './instruments/Click';
import { Basin, Gauges, Block, Classroom, Origin, Device, Tissue } from './instruments/Small';

export interface PlateSpec {
  figure: ReactNode;
  body: ReactNode;
  status?: string;
  rows?: Row[];
  rowsCaption?: string;
  caveat?: ReactNode;
  links?: PlateLink[];
}

export const PLATES: Record<StationId, PlateSpec> = {
  basin: {
    figure: <Basin />,
    status: 'live',
    body: (
      <>
        <p>
          A humpback&rsquo;s song carries tens of kilometres, which makes the Watkins recordings a
          basin-scale instrument. <strong>finprint</strong> takes a clip and names the animal — a
          CNN over log-mel spectrograms, 32 species.
        </p>
        <p>
          It leads with the <em>family</em>, because that is where it is trustworthy: the mistakes
          stay inside the family. It confuses one dolphin for another, never a dolphin for a seal.
        </p>
      </>
    ),
    rowsCaption: 'held-out WMMS test split · 340 clips',
    rows: [
      { k: 'Group (toothed / baleen / pinniped)', v: '0.979', emph: true },
      { k: 'Species, top-1', v: '0.906' },
      { k: 'Species, top-3', v: '0.965' },
      { k: 'Macro-F1', v: '0.878' },
      { k: 'Accuracy of what it shows as an answer', v: '0.973', emph: true },
    ],
    caveat:
      'Call type is signal analysis against documented thresholds, not a trained model. The Watkins database has no call-type labels, and inventing a “behaviour” classifier would have been fabrication.',
    links: [
      { href: 'https://finprint.ethanyanxu.com', label: 'live' },
      { href: 'https://github.com/OoEthanoO/finprint', label: 'repo' },
      { href: '/work/finprint', label: 'notes' },
    ],
  },

  gauges: {
    figure: <Gauges />,
    status: 'published',
    body: (
      <>
        <p>
          A harmonic tide model predicts the astronomy and leaves a <em>residual</em> — the part
          driven by weather, wind setup and the shape of the seabed. This paper shows the terrain
          around a gauge carries enough signal to correct it.
        </p>
        <p>Peer-reviewed and in print: <strong>{PAPER.journal}</strong>, {PAPER.volume}.</p>
      </>
    ),
    rowsCaption: 'reported in the paper',
    rows: [
      { k: 'Autoregressive RMSE', v: '0.0763', unit: 'm', emph: true },
      { k: 'Stations', v: '15' },
      { k: 'Geospatial model', v: 'XGBoost' },
      { k: 'Temporal baseline', v: 'LightGBM' },
    ],
    caveat:
      'Figure 6 is saved nowhere in the research repo: two validation scripts write to the same filename, and whichever runs last silently overwrites the other. Regenerating it reproduced the published 0.0763 m exactly.',
    links: [
      { href: PAPER.pdf, label: 'read the pdf' },
      { href: PAPER.issue, label: 'the issue' },
      { href: '/work/water-level', label: 'notes' },
    ],
  },

  coast: {
    figure: <Coast />,
    status: 'complete',
    body: (
      <>
        <p>
          Real SRTM elevation over Biscayne Bay. Drag the waterline: a connected-flood search
          re-runs across 65,536 cells and the exposure counts are recomputed in front of you.
        </p>
        <p>
          <strong>CORA</strong> floods by connectivity, not by altitude. Turn on the bathtub
          difference and the gap appears — ground below the waterline the sea cannot reach, which
          a bathtub model drowns anyway.
        </p>
      </>
    ),
    rowsCaption: 'this instrument',
    rows: [
      { k: 'DEM', v: 'SRTM 1″ · ~39 m/sample' },
      { k: 'Cells searched per drag', v: '65,536', emph: true },
      { k: 'Buildings', v: '14,399' },
      { k: 'Road ways', v: '4,063' },
    ],
    caveat:
      'SRTM is a surface model — it includes buildings, so it overstates ground height downtown — and it is referenced to a geoid, not a tidal datum. CORA itself pulls a NOAA gauge for that; this browser version does not.',
    links: [
      { href: 'https://github.com/OoEthanoO/cora_project', label: 'repo' },
      { href: '/work/cora', label: 'notes' },
    ],
  },

  streets: {
    figure: <Streets />,
    status: 'complete',
    body: (
      <>
        <p>
          Every footpath, sidewalk street and stairway in central Claremont, California: a real
          walking graph of 12,108 nodes and 13,911 edges, extracted from OpenStreetMap.
        </p>
        <p>
          <strong>CoolRoute</strong> runs Dijkstra twice — once for the shortest walk, once weighted
          by sun exposure — and prices the difference honestly: so much less sun, for so much more
          walking.
        </p>
      </>
    ),
    caveat:
      'Ethan’s own graph covers greater Claremont at 48,579 nodes; this one is trimmed to the core so it can ship in the page.',
    links: [
      { href: 'https://github.com/OoEthanoO/coolroute', label: 'repo' },
      { href: '/work/coolroute', label: 'notes' },
    ],
  },

  block: {
    figure: <Block />,
    status: 'complete',
    body: (
      <>
        <p>
          At the scale of one block, shade stops being a statistic and becomes geometry. The sun&rsquo;s
          altitude and azimuth are computed astronomically for the time you choose; every building
          throws a shadow of the length that implies.
        </p>
        <p>
          A 30 m building at 20° solar altitude casts 82 m. That is the whole model, and it is why a
          route that turns one street earlier can be meaningfully cooler.
        </p>
      </>
    ),
    caveat:
      'Footprint proximity and sun geometry, not true 3D ray casting. Heights are inferred from OSM tags where present and assumed otherwise.',
  },

  classroom: {
    figure: <Classroom />,
    status: 'live',
    body: (
      <>
        <p>
          <strong>YanLearn</strong> is free tutoring for grades 6–12, taught over Discord by high
          school students. The site handles accounts, courses, enrolments, scheduling, reminders and
          the admin tooling behind them.
        </p>
        <p>
          Every table is RLS-locked with deny-all policies and reached only through service-role
          routes. A reconciliation loop continuously drives the Discord server — membership, roles,
          channels, nicknames — back into agreement with the website.
        </p>
      </>
    ),
    rows: [
      { k: 'Commits', v: '411', emph: true },
      { k: 'Raised for SickKids', v: '$3,480', emph: true },
      { k: 'Volunteer hours submitted', v: '331', unit: 'h' },
    ],
    links: [
      { href: 'https://learn.ethanyanxu.com', label: 'live' },
      { href: '/work/yanlearn', label: 'notes' },
    ],
  },

  origin: {
    figure: <Origin />,
    body: (
      <>
        <p>
          Ethan Yan Xu. A high school student in Toronto who builds things and then measures whether
          they work.
        </p>
        <p>
          At exactly this scale sits <strong>stroj</strong>, a self-hosted online judge — the thing
          that stands between a person and a problem and returns a verdict. Its sandbox writeup is
          the honest kind: it documents what the isolation does <em>not</em> do, and reports the
          isolation actually in force rather than the one you asked for.
        </p>
      </>
    ),
    links: [
      { href: 'https://github.com/OoEthanoO/stroj-v2', label: 'stroj' },
      { href: '/work', label: 'the full index' },
    ],
  },

  device: {
    figure: <Device />,
    body: (
      <>
        <p>
          The band where software meets a person: what fits in a hand, and what sits on a scalp.
        </p>
        <p>
          Native Apple work — a todo list that schedules itself, a camera app the Mac does not ship
          with, an Apple Music presence bridge built by reverse-engineering why Discord refuses to
          render its own CDN URLs. And <strong>ad_eeg</strong>, at the 50 mm spacing of a 10–20
          electrode montage.
        </p>
      </>
    ),
  },

  click: {
    figure: <Click />,
    body: (
      <>
        <p>
          A dolphin&rsquo;s echolocation click at 120 kHz is about 3 mm long in seawater. To classify
          one you first have to see it, which means a spectrogram — and that is a real signal chain,
          not a picture.
        </p>
        <p>
          This one runs on your microphone: short-time Fourier transform, a mel filterbank, log
          compression. The same preprocessing <strong>finprint</strong> puts in front of its CNN.
        </p>
      </>
    ),
    caveat:
      'Your microphone is not a hydrophone and your browser is not sampling at 256 kHz — this shows the transform, at speech bandwidth, not a marine mammal detection.',
  },

  tissue: {
    figure: <Tissue />,
    status: 'archived',
    body: (
      <>
        <p>
          Colonic mucosa at roughly 20×. An epithelial cell is about 15 µm across, which is the size
          at which tissue class becomes a visual question a network can answer.
        </p>
        <p>
          Early work, from 2024, and it shows next to what came later. It is here because the
          trajectory is part of the record.
        </p>
      </>
    ),
    caveat: 'Not maintained. Included for the trajectory, not because the model is good.',
  },

  memory: {
    figure: <Memory />,
    status: 'complete',
    body: (
      <>
        <p>
          A cache line is 128 bytes of physical SRAM. Whether a warp&rsquo;s 32 lanes land inside one of
          them or straddle 32 of them is the difference between 3% of cuBLAS and 94% of it — and it
          is a change of one index.
        </p>
        <p>
          <strong>cuda-from-scratch</strong> is eight kernels, each one change from the last. This
          instrument runs that ladder on your own GPU.
        </p>
      </>
    ),
    caveat:
      'Quote the range, never an endpoint. Across sessions the same code moves 5–15% — his dispatcher scored 94.3%, 84.5% and 88.0% in three consecutive rounds without a line changing.',
    links: [
      { href: 'https://github.com/OoEthanoO/cuda-from-scratch', label: 'repo' },
      { href: '/work/cuda-from-scratch', label: 'notes' },
    ],
  },

  bond: {
    figure: <Bond />,
    status: 'complete',
    body: (
      <>
        <p>
          1.54 Å — the length of a carbon–carbon single bond, and the bottom of the traverse.
        </p>
        <p>
          <strong>orgchem</strong> reads the notation people actually write by hand. The parser is
          valence-driven, which is what lets it settle the notation&rsquo;s ambiguities without
          guessing: in CH₃CH(CH₃)CH₃ the CH has a spare valence and CH₃ is monovalent, so it
          branches; in CH₃(CH₂)₃CH₃ the CH₂ is divalent, so it repeats.
        </p>
      </>
    ),
    caveat:
      'The depiction here is a from-scratch layout engine, not OpenChemLib — it handles chains, branches and simple rings. The real app renders server-side with a full cheminformatics toolkit.',
    links: [
      { href: 'https://github.com/OoEthanoO/orgchem', label: 'repo' },
      { href: '/work/orgchem', label: 'notes' },
    ],
  },
};
