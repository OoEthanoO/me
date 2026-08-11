'use client';

/**
 * orgchem, at 10^-10 m.
 *
 * A real valence-driven parser for condensed structural formulas, a real 2D
 * depiction engine, and — the part worth showing — the resolution cascade
 * made visible. You watch which stage claimed your input and which ones fell
 * through, because that is the actual architecture: each stage is strict
 * enough to fall through rather than guess.
 */

import { useEffect, useMemo, useState } from 'react';
import { ParseError, looksLikeMolecularFormula, parseCondensed, sub, type Molecule } from '@/lib/chem/parse';
import { depict } from '@/lib/chem/layout';
import styles from './Bond.module.css';

/** Trivial names, resolved before anything is parsed — as orgchem does. */
const DICTIONARY: Record<string, { formula: string; iupac: string }> = {
  ethanol: { formula: 'CH3CH2OH', iupac: 'ethanol' },
  methanol: { formula: 'CH3OH', iupac: 'methanol' },
  acetone: { formula: 'CH3C(=O)CH3', iupac: 'propan-2-one' },
  'acetic acid': { formula: 'CH3COOH', iupac: 'ethanoic acid' },
  vinegar: { formula: 'CH3COOH', iupac: 'ethanoic acid' },
  isobutane: { formula: 'CH3CH(CH3)CH3', iupac: '2-methylpropane' },
  'tert-butanol': { formula: '(CH3)3COH', iupac: '2-methylpropan-2-ol' },
  glycol: { formula: 'HOCH2CH2OH', iupac: 'ethane-1,2-diol' },
  'ethylene glycol': { formula: 'HOCH2CH2OH', iupac: 'ethane-1,2-diol' },
  glycerol: { formula: 'HOCH2CH(OH)CH2OH', iupac: 'propane-1,2,3-triol' },
  'stearic acid': { formula: 'CH3(CH2)16COOH', iupac: 'octadecanoic acid' },
  benzene: { formula: 'PhH', iupac: 'benzene' },
  phenol: { formula: 'PhOH', iupac: 'phenol' },
  toluene: { formula: 'PhCH3', iupac: 'methylbenzene' },
  styrene: { formula: 'PhCH=CH2', iupac: 'ethenylbenzene' },
  'benzoic acid': { formula: 'PhCOOH', iupac: 'benzoic acid' },
  tfa: { formula: 'CF3COOH', iupac: 'trifluoroacetic acid' },
  chloroform: { formula: 'CHCl3', iupac: 'trichloromethane' },
  formaldehyde: { formula: 'CH2O', iupac: 'methanal' },
  acetaldehyde: { formula: 'CH3CHO', iupac: 'ethanal' },
  acetonitrile: { formula: 'CH3CN', iupac: 'ethanenitrile' },
  nitromethane: { formula: 'CH3NO2', iupac: 'nitromethane' },
};

const EXAMPLES = [
  'CH₃CH(CH₃)CH₃',
  'CH₃(CH₂)₃CH₃',
  'CH₃CHOHCH₃',
  '(CH₃)₃COH',
  'PhCH₂COOH',
  'CH₃(CH₂)₁₆COOH',
  'CH₃CH₂CH₂CH₂CH₂',
];

type StageName = 'dictionary' | 'condensed' | 'formula';

interface StageResult {
  name: StageName;
  note: string;
  outcome: 'claimed' | 'fell through' | 'not reached';
}

interface Resolution {
  stages: StageResult[];
  mol?: Molecule;
  iupac?: string;
  error?: string;
}

function resolve(input: string): Resolution {
  const q = input.trim();
  const stages: StageResult[] = [];
  if (!q) return { stages: [] };

  // ── stage 1: the dictionary ────────────────────────────────────────────────
  const hit = DICTIONARY[q.toLowerCase()];
  if (hit) {
    stages.push({ name: 'dictionary', note: `“${q.toLowerCase()}” is on file`, outcome: 'claimed' });
    stages.push({ name: 'condensed', note: 'not reached', outcome: 'not reached' });
    stages.push({ name: 'formula', note: 'not reached', outcome: 'not reached' });
    try {
      return { stages, mol: parseCondensed(hit.formula), iupac: hit.iupac };
    } catch (e) {
      return { stages, error: (e as Error).message };
    }
  }
  stages.push({ name: 'dictionary', note: 'no entry', outcome: 'fell through' });

  // ── stage 2: the condensed structural formula ──────────────────────────────
  if (looksLikeMolecularFormula(q)) {
    stages.push({
      name: 'condensed',
      note: 'reads as a composition, not a structure',
      outcome: 'fell through',
    });
    stages.push({
      name: 'formula',
      note: 'a composition names many structures',
      outcome: 'claimed',
    });
    return {
      stages,
      error: `${q} is a molecular formula. It does not name one structure — orgchem answers these with the isomer list rather than picking one silently.`,
    };
  }

  try {
    const mol = parseCondensed(q);
    stages.push({
      name: 'condensed',
      note: mol.isGroup ? 'parsed — one bond spare, so a substituent' : 'parsed, and the valences close',
      outcome: 'claimed',
    });
    stages.push({ name: 'formula', note: 'not reached', outcome: 'not reached' });
    return { stages, mol };
  } catch (e) {
    const msg = e instanceof ParseError ? e.message : String(e);
    stages.push({ name: 'condensed', note: msg, outcome: 'fell through' });
    stages.push({ name: 'formula', note: 'no reading left', outcome: 'fell through' });
    return { stages, error: msg };
  }
}

export default function Bond() {
  const [input, setInput] = useState('CH₃CH(CH₃)CH₃');
  const [exampleIdx, setExampleIdx] = useState(0);
  const res = useMemo(() => resolve(input), [input]);

  // A slow cycle through the examples until the visitor types something.
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched) return;
    const t = setInterval(() => {
      setExampleIdx(i => {
        const next = (i + 1) % EXAMPLES.length;
        setInput(EXAMPLES[next]);
        return next;
      });
    }, 4200);
    return () => clearInterval(t);
  }, [touched]);

  return (
    <div className={styles.rig}>
      <div className={styles.inputRow}>
        <span className="label">formula</span>
        <input
          className="field"
          value={input}
          spellCheck={false}
          autoComplete="off"
          aria-label="Condensed structural formula"
          onChange={e => {
            setTouched(true);
            setInput(e.target.value);
          }}
        />
      </div>

      <div className={styles.stack}>
        <Cascade stages={res.stages} />
        <div className={styles.canvas}>
          {res.mol ? <Structure mol={res.mol} /> : null}
          {res.error ? <p className={styles.error}>{res.error}</p> : null}
        </div>
      </div>

      {res.mol ? (
        <div className={styles.summary}>
          <span className={`num ${styles.formulaOut}`}>{res.mol.formula}</span>
          {res.iupac ? <span className={styles.iupac}>{res.iupac}</span> : null}
          {res.mol.isGroup ? <span className={styles.group}>substituent group</span> : null}
        </div>
      ) : null}

      <div className={styles.examples}>
        {EXAMPLES.slice(0, 4).map(ex => (
          <button
            key={ex}
            className="switch"
            data-on={input === ex}
            onClick={() => {
              setTouched(true);
              setInput(ex);
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

function Cascade({ stages }: { stages: StageResult[] }) {
  return (
    <ol className={styles.cascade} aria-label="Resolution cascade">
      {stages.map(s => (
        <li key={s.name} data-outcome={s.outcome}>
          <span className={styles.stageName}>{s.name}</span>
          <span className={styles.stageMark}>
            {s.outcome === 'claimed' ? '✓' : s.outcome === 'fell through' ? '·' : ' '}
          </span>
          <span className={styles.stageNote}>{s.note}</span>
        </li>
      ))}
    </ol>
  );
}

const SHOW_LABEL = new Set(['O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'B', 'Si']);

function Structure({ mol }: { mol: Molecule }) {
  const d = useMemo(() => depict(mol), [mol]);

  const pad = 0.85;
  const vbW = d.width + pad * 2;
  const vbH = d.height + pad * 2;
  const X = (i: number) => d.pos[i].x - d.minX + pad;
  const Y = (i: number) => d.pos[i].y - d.minY + pad;

  // Carbons are drawn as vertices, not letters; heteroatoms get a label, and a
  // label needs the bond to stop short of it.
  const labelled = (i: number) => SHOW_LABEL.has(mol.atoms[i].el) || (mol.atoms.length === 1);
  const GAP = 0.26;

  const bonds = mol.bonds
    .filter(b => !d.hidden[b.a] && !d.hidden[b.b])
    .map((b, k) => {
      let x1 = X(b.a);
      let y1 = Y(b.a);
      let x2 = X(b.b);
      let y2 = Y(b.b);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      if (labelled(b.a)) { x1 += ux * GAP; y1 += uy * GAP; }
      if (labelled(b.b)) { x2 -= ux * GAP; y2 -= uy * GAP; }

      if (b.order === 1 || b.aromatic) {
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />;
      }
      // Double and triple bonds: offset copies perpendicular to the bond.
      const px = -uy;
      const py = ux;
      const o = b.order === 2 ? [0.075, -0.075] : [0.13, 0, -0.13];
      return (
        <g key={k}>
          {o.map((s, j) => (
            <line key={j} x1={x1 + px * s} y1={y1 + py * s} x2={x2 + px * s} y2={y2 + py * s} />
          ))}
        </g>
      );
    });

  // Aromatic rings get the inner circle rather than alternating lines.
  const aromaticRings = d.rings.filter(r =>
    r.length === 6 && r.every(a => mol.bonds.some(b => b.aromatic && (b.a === a || b.b === a))),
  );

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className={styles.svg} role="img" aria-label={`Structure of ${mol.formula}`}>
      <g className={styles.bonds} strokeLinecap="round">{bonds}</g>

      {aromaticRings.map((r, i) => {
        const cx = r.reduce((s, a) => s + X(a), 0) / r.length;
        const cy = r.reduce((s, a) => s + Y(a), 0) / r.length;
        const rad = Math.hypot(X(r[0]) - cx, Y(r[0]) - cy) * 0.62;
        return <circle key={i} cx={cx} cy={cy} r={rad} className={styles.aromatic} />;
      })}

      {mol.atoms.map((a, i) => {
        if (d.hidden[i] || !labelled(i)) return null;
        const h = d.labelH[i];
        return (
          <g key={i}>
            <circle cx={X(i)} cy={Y(i)} r={0.24} className={styles.labelBg} />
            <text x={X(i)} y={Y(i)} className={styles.atom} dominantBaseline="central" textAnchor="middle">
              {a.el}
              {h > 0 ? (h > 1 ? `H${sub(h)}` : 'H') : ''}
            </text>
          </g>
        );
      })}

      {/* Open valences — the dash a chemist writes to say "this continues". */}
      {mol.atoms.map((a, i) => {
        if (d.hidden[i] || a.free === 0) return null;
        return (
          <line
            key={`f${i}`}
            x1={X(i)}
            y1={Y(i)}
            x2={X(i) + 0.5}
            y2={Y(i)}
            className={styles.openValence}
          />
        );
      })}
    </svg>
  );
}
