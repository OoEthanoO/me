'use client';

/**
 * The stations whose instruments are figures rather than machines. Each one is
 * still drawn from real numbers; none of them is an illustration of a thing
 * that did not happen.
 */

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { PAPER, RECORD } from '@/lib/data/profile';
import { sunPosition, shadowLength, localHourToDate } from '@/lib/geo/solar';
import styles from './Small.module.css';

/* ── 10^7 m · the confidence trap ────────────────────────────────────────────
   finprint's most interesting measurement, drawn. A closed-set softmax is more
   confident on white noise than on a quiet real call, so confidence alone
   cannot reject garbage. Every number here is from the repository. */

export function Basin() {
  const [hover, setHover] = useState<string | null>(null);

  const marks = [
    { id: 'silence', x: 0.72, label: 'pure silence', note: 'scores 0.72 — and is nothing at all' },
    { id: 'noise', x: 0.95, label: 'white noise', note: 'scores 0.95 — more certain than most real calls' },
  ];

  return (
    <figure className={styles.fig}>
      <figcaption className="label">softmax confidence vs. what it is worth</figcaption>

      <svg viewBox="0 0 300 150" className={styles.svg} role="img"
           aria-label="Held-out accuracy is 0.97 above a confidence of 0.5 and 0.49 below it. Pure silence scores 0.72 and white noise 0.95, both above the threshold.">
        {/* accuracy steps */}
        <rect x={20} y={96} width={130} height={34} className={styles.blockLow} />
        <rect x={150} y={26} width={130} height={104} className={styles.blockHigh} />

        <text x={85} y={116} className={styles.blockText} textAnchor="middle">0.49</text>
        <text x={215} y={80} className={styles.blockTextHi} textAnchor="middle">0.97</text>

        {/* the threshold */}
        <line x1={150} y1={16} x2={150} y2={140} className={styles.threshold} />
        <text x={150} y={12} className={styles.tick} textAnchor="middle">0.5 — shown as an answer above here</text>

        {/* axis */}
        <line x1={20} y1={130} x2={280} y2={130} className={styles.axis} />
        <text x={20} y={143} className={styles.tick}>0.0</text>
        <text x={280} y={143} className={styles.tick} textAnchor="end">1.0 confidence</text>

        {/* the garbage that scores high */}
        {marks.map(m => {
          const x = 20 + m.x * 260;
          return (
            <g key={m.id}
               onMouseEnter={() => setHover(m.id)}
               onMouseLeave={() => setHover(null)}
               className={styles.mark}>
              <line x1={x} y1={26} x2={x} y2={130} className={styles.markLine} />
              <circle cx={x} cy={26} r={3.4} className={styles.markDot} />
              <text x={x} y={20} className={styles.markLabel} textAnchor="middle">{m.label}</text>
            </g>
          );
        })}
      </svg>

      <p className={styles.note}>
        {hover
          ? marks.find(m => m.id === hover)!.note
          : 'Both sit above the line that decides whether an answer is shown. So the audio itself is measured instead — silence and noise are rejected before the model is consulted.'}
      </p>
    </figure>
  );
}

/* ── 10^6 m · the paper ──────────────────────────────────────────────────────
   The published figures, as published. */

export function Gauges() {
  const [i, setI] = useState(0);
  const fig = PAPER.figures[i];
  return (
    <figure className={styles.fig}>
      <div className={styles.plateFrame}>
        <Image
          src={fig.src}
          alt={fig.caption}
          width={900}
          height={560}
          className={styles.figure}
          unoptimized
        />
      </div>
      <div className={styles.figNav}>
        {PAPER.figures.map((f, k) => (
          <button
            key={f.src}
            className="switch"
            data-on={k === i}
            onClick={() => setI(k)}
            aria-label={f.caption}
          >
            {k + 1}
          </button>
        ))}
        <span className={styles.figCaption}>{fig.caption}</span>
      </div>
      <p className={styles.cite}>
        {PAPER.author}. “{PAPER.title}.” <em>{PAPER.journal}</em>, {PAPER.volume}, {PAPER.pages}.
      </p>
    </figure>
  );
}

/* ── 10^2 m · the block ──────────────────────────────────────────────────────
   Real solar geometry against a block of buildings. The shadow lengths are
   computed, not drawn — height over the tangent of the sun's altitude. */

export function Block() {
  const [hour, setHour] = useState(16.5);
  const sun = useMemo(() => sunPosition(localHourToDate(hour, -7), 34.1, -117.71), [hour]);

  // A block, in metres, with heights that are stated as assumptions.
  const buildings = useMemo(
    () => [
      { x: 30, y: 40, w: 34, d: 22, h: 12 },
      { x: 96, y: 30, w: 26, d: 30, h: 30 },
      { x: 150, y: 46, w: 40, d: 20, h: 8 },
      { x: 44, y: 104, w: 22, d: 26, h: 18 },
      { x: 104, y: 110, w: 46, d: 22, h: 22 },
      { x: 172, y: 100, w: 24, d: 28, h: 14 },
    ],
    [],
  );

  const az = (sun.azimuth - 180) * (Math.PI / 180);
  const up = sun.altitude > 0;
  const dirX = Math.sin(az);
  const dirY = Math.cos(az);

  return (
    <figure className={styles.fig}>
      <svg viewBox="0 0 240 165" className={styles.svg} role="img"
           aria-label={`A block at ${hour.toFixed(1)} hours: the sun is ${sun.altitude.toFixed(0)} degrees above the horizon.`}>
        {/* the street grid */}
        <g className={styles.street}>
          <rect x={0} y={78} width={240} height={14} />
          <rect x={78} y={0} width={13} height={165} />
        </g>

        {up
          ? buildings.map((b, k) => {
              const len = Math.min(140, shadowLength(b.h, sun.altitude));
              return (
                <polygon
                  key={`s${k}`}
                  className={styles.shadow}
                  points={[
                    [b.x, b.y],
                    [b.x + b.w, b.y],
                    [b.x + b.w + dirX * len, b.y + dirY * len],
                    [b.x + dirX * len, b.y + dirY * len],
                  ]
                    .map(p => p.join(','))
                    .join(' ')}
                />
              );
            })
          : null}

        {buildings.map((b, k) => (
          <g key={k}>
            <rect x={b.x} y={b.y} width={b.w} height={b.d} className={styles.building} />
            <text x={b.x + 2} y={b.y + b.d - 3} className={styles.hLabel}>{b.h}m</text>
          </g>
        ))}

        {/* scale bar, in metres */}
        <line x1={190} y1={156} x2={230} y2={156} className={styles.axis} />
        <text x={210} y={152} className={styles.tick} textAnchor="middle">40 m</text>
      </svg>

      <div className={styles.row}>
        <label className="label" htmlFor="blockhour">hour</label>
        <input
          id="blockhour" className="slider" type="range" min={5} max={21} step={0.25}
          value={hour} onChange={e => setHour(+e.target.value)}
        />
        <output className={`num ${styles.out}`}>
          {String(Math.floor(hour)).padStart(2, '0')}:{String(Math.round((hour % 1) * 60)).padStart(2, '0')}
        </output>
      </div>

      <p className={styles.note}>
        {up ? (
          <>
            sun <strong className="num">{sun.altitude.toFixed(1)}°</strong> up, bearing{' '}
            <strong className="num">{sun.azimuth.toFixed(0)}°</strong> — a 30 m building throws{' '}
            <strong className="num">{shadowLength(30, sun.altitude).toFixed(0)} m</strong>
          </>
        ) : (
          'the sun is below the horizon — no shadows to model'
        )}
      </p>
    </figure>
  );
}

/* ── 10^1 m · the classroom ──────────────────────────────────────────────────
   The reconciliation loop: two systems that both think they own the truth. */

export function Classroom() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT(x => (x + 1) % 4), 1500);
    return () => clearInterval(id);
  }, []);

  const rows = [
    { name: 'enrolment', site: 'grade 9 · algebra', discord: 'grade 9 · algebra' },
    { name: 'role', site: 'student', discord: t >= 1 ? 'student' : '—' },
    { name: 'nickname', site: 'A. Chen', discord: t >= 2 ? 'A. Chen' : 'achen_2011' },
    { name: 'class channel', site: 'thu 19:00', discord: t >= 3 ? 'created' : 'not yet' },
  ];

  return (
    <figure className={styles.fig}>
      <figcaption className="label">the reconciliation loop</figcaption>
      <table className={`sheet ${styles.sync}`}>
        <thead>
          <tr>
            <th>field</th>
            <th>website</th>
            <th>discord</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const agree = r.site === r.discord;
            return (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{r.site}</td>
                <td data-drift={!agree}>{r.discord}</td>
                <td className={styles.syncMark}>{agree ? '=' : '→'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.note}>
        The website is the source of truth; the loop drives Discord back into agreement with it,
        continuously, without anyone pressing anything.
      </p>
      <div className={styles.impact}>
        <span><strong className="num">$3,480</strong> raised for SickKids</span>
        <span><strong className="num">331 h</strong> volunteered</span>
        <span><strong className="num">411</strong> commits</span>
      </div>
    </figure>
  );
}

/* ── 10^0 m · the datum ──────────────────────────────────────────────────────
   The origin of the whole atlas. */

export function Origin() {
  return (
    <figure className={styles.fig}>
      <div className={styles.datum}>
        <svg viewBox="0 0 200 200" className={styles.datumMark} aria-hidden="true">
          <circle cx={100} cy={100} r={62} className={styles.datumRing} />
          <circle cx={100} cy={100} r={30} className={styles.datumRing} />
          <line x1={100} y1={16} x2={100} y2={184} className={styles.datumHair} />
          <line x1={16} y1={100} x2={184} y2={100} className={styles.datumHair} />
          <circle cx={100} cy={100} r={3} className={styles.datumDot} />
          <text x={100} y={196} className={styles.tick} textAnchor="middle">1.000 m</text>
        </svg>
      </div>

      <table className={`sheet ${styles.record}`}>
        <tbody>
          {RECORD.map(r => (
            <tr key={r.name}>
              <td>
                {r.name}
                {r.year ? <span className={styles.year}> {r.year}</span> : null}
              </td>
              <td className="n">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/* ── 10^-1 m · hand & head ───────────────────────────────────────────────────
   Real screenshots, and the 10–20 montage at its real spacing. */

const SHOTS = [
  { src: '/ethantodolist1.jpeg', label: 'EthanToDoList' },
  { src: '/ethantodolist3.jpeg', label: 'EthanToDoList' },
  { src: '/macam1.png', label: 'Macam' },
];

/** The standard 10–20 positions, as fractions of the head outline. */
const MONTAGE: [string, number, number][] = [
  ['Fp1', -0.28, -0.72], ['Fp2', 0.28, -0.72],
  ['F7', -0.66, -0.42], ['F3', -0.34, -0.38], ['Fz', 0, -0.38], ['F4', 0.34, -0.38], ['F8', 0.66, -0.42],
  ['T3', -0.8, 0], ['C3', -0.4, 0], ['Cz', 0, 0], ['C4', 0.4, 0], ['T4', 0.8, 0],
  ['T5', -0.66, 0.42], ['P3', -0.34, 0.38], ['Pz', 0, 0.38], ['P4', 0.34, 0.38], ['T6', 0.66, 0.42],
  ['O1', -0.28, 0.72], ['O2', 0.28, 0.72],
];

export function Device() {
  return (
    <figure className={styles.fig}>
      <div className={styles.devices}>
        {SHOTS.map(s => (
          <div key={s.src} className={styles.phone}>
            <Image src={s.src} alt={s.label} width={340} height={720} className={styles.shot} unoptimized />
            <span className={styles.shotLabel}>{s.label}</span>
          </div>
        ))}

        <div className={styles.head}>
          <svg viewBox="-110 -120 220 240" role="img" aria-label="The 10–20 electroencephalography montage: nineteen electrode positions on a scalp.">
            <ellipse cx={0} cy={0} rx={88} ry={104} className={styles.scalp} />
            <path d="M -18 -104 L 0 -120 L 18 -104" className={styles.scalp} fill="none" />
            {MONTAGE.map(([name, x, y]) => (
              <g key={name}>
                <circle cx={x * 88} cy={y * 104} r={7.5} className={styles.electrode} />
                <text x={x * 88} y={y * 104 + 2.6} className={styles.electrodeLabel} textAnchor="middle">
                  {name}
                </text>
              </g>
            ))}
            <text x={0} y={116} className={styles.tick} textAnchor="middle">ad_eeg · 10–20 montage</text>
          </svg>
        </div>
      </div>
    </figure>
  );
}

/* ── 10^-5 m · tissue ────────────────────────────────────────────────────────
   Two real tiles from the repository, and the class list it predicts over. */

const CLASSES = ['adipose', 'complex', 'debris', 'empty', 'lympho', 'mucosa', 'stroma', 'tumor'];

export function Tissue() {
  const [pick, setPick] = useState<'mucosa' | 'debris'>('mucosa');
  return (
    <figure className={styles.fig}>
      <div className={styles.tiles}>
        {(['mucosa', 'debris'] as const).map(k => (
          <button
            key={k}
            className={styles.tile}
            data-on={pick === k}
            onClick={() => setPick(k)}
            aria-pressed={pick === k}
          >
            <Image src={`/tissue/${k}.png`} alt={`${k} tile`} width={300} height={300} unoptimized />
            <span className="label">{k}</span>
          </button>
        ))}
      </div>
      <ul className={styles.classes}>
        {CLASSES.map(c => (
          <li key={c} data-on={c === pick}>{c}</li>
        ))}
      </ul>
      <p className={styles.note}>
        Eight tissue classes over histology tiles. A field of view about 150 µm across — an
        epithelial cell is roughly 15 µm of it.
      </p>
    </figure>
  );
}
