/**
 * A valence-driven parser for condensed structural formulas.
 *
 * This follows the architecture of Ethan's orgchem: the notation people write
 * by hand is genuinely ambiguous, and the way out is not a pile of heuristics
 * but a single question asked of the structure so far — what still has a bond
 * free?
 *
 *   CH₃CH(CH₃)CH₃   the CH has a spare valence and CH₃ is monovalent,
 *                   so the parenthesis is a BRANCH
 *   CH₃(CH₂)₃CH₃    the CH₃ before it is saturated and CH₂ is divalent,
 *                   so the parenthesis is a REPEAT UNIT
 *   CH₃CHOHCH₃      OH cannot carry what follows, so mid-formula it branches
 *   CH₃CH₂CH₂CH₂CH₂ the last CH₂ has a bond spare, so this is the pentyl
 *                   group rather than a molecule
 *
 * Same input, same two symbols, opposite meanings — settled by counting bonds
 * rather than by guessing.
 */

export interface Atom {
  el: string;
  /** Explicit hydrogens carried by this atom. */
  h: number;
  /** Bonds still unfilled once the parse finishes. */
  free: number;
}

export interface Bond {
  a: number;
  b: number;
  order: 1 | 2 | 3;
  /** Part of an aromatic ring, drawn with an inner circle. */
  aromatic?: boolean;
}

export interface Molecule {
  atoms: Atom[];
  bonds: Bond[];
  /** True when the formula describes a substituent, not a whole molecule. */
  isGroup: boolean;
  formula: string;
}

export class ParseError extends Error {
  /** Character offset into the normalised input, where known. */
  at?: number;

  constructor(message: string, at?: number) {
    super(message);
    this.at = at;
  }
}

export const VALENCE: Record<string, number> = {
  C: 4, N: 3, O: 2, S: 2, P: 3, H: 1,
  F: 1, Cl: 1, Br: 1, I: 1, B: 3, Si: 4,
};

const ELEMENTS = ['Cl', 'Br', 'Si', 'C', 'N', 'O', 'S', 'P', 'H', 'F', 'I', 'B'];

/** Multi-atom shorthands that are always written as one blob. */
const FRAGMENTS: Record<string, string> = {
  COOH: 'C(=O)OH',
  CO2H: 'C(=O)OH',
  CHO: 'C(=O)H',
  NO2: 'N(=O)=O',
  SO3H: 'S(=O)(=O)OH',
  CN: 'C#N',
};

/** Group abbreviations. Expanded before parsing. */
const ABBREV: Record<string, string> = {
  Me: 'CH3',
  Et: 'CH2CH3',
  Pr: 'CH2CH2CH3',
  iPr: 'CH(CH3)CH3',
  Bu: 'CH2CH2CH2CH3',
  tBu: 'C(CH3)(CH3)CH3',
  Ac: 'C(=O)CH3',
  Bn: 'CH2Ph',
  Cy: 'C6H11',
};

const SUB_DIGITS: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

/** Unicode subscripts, en/em dashes and the various bond glyphs, normalised. */
export function normalise(input: string): string {
  let s = input.trim();
  s = s.replace(/[₀-₉]/g, c => SUB_DIGITS[c] ?? c);
  s = s.replace(/[–—−]/g, '-');
  s = s.replace(/[≡]/g, '#');
  s = s.replace(/\s+/g, '');
  return s;
}

interface Builder {
  atoms: Atom[];
  bonds: Bond[];
}

function addAtom(b: Builder, el: string, h: number): number {
  const v = VALENCE[el];
  if (v === undefined) throw new ParseError(`Unknown element “${el}”`);
  if (h > v) throw new ParseError(`${el}H${h} exceeds ${el}'s valence of ${v}`);
  b.atoms.push({ el, h, free: v - h });
  return b.atoms.length - 1;
}

function addBond(b: Builder, i: number, j: number, order: 1 | 2 | 3, aromatic = false) {
  const A = b.atoms[i];
  const B = b.atoms[j];
  if (A.free < order) throw new ParseError(`${A.el} has no room for another bond`);
  if (B.free < order) throw new ParseError(`${B.el} has no room for another bond`);
  A.free -= order;
  B.free -= order;
  b.bonds.push({ a: i, b: j, order, aromatic });
}

/** A benzene ring, attached through its first carbon. */
function addPhenyl(b: Builder): number {
  const ring: number[] = [];
  for (let i = 0; i < 6; i++) ring.push(addAtom(b, 'C', i === 0 ? 0 : 1));
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6;
    // Kekulé alternation keeps the valence bookkeeping honest; the drawing
    // layer renders the ring with a circle instead of alternating lines.
    addBond(b, ring[i], ring[j], i % 2 === 0 ? 2 : 1, true);
  }
  return ring[0];
}

interface Token {
  kind: 'group' | 'open' | 'close' | 'bond' | 'phenyl';
  el?: string;
  h?: number;
  order?: 1 | 2 | 3;
  count?: number;
}

/**
 * Blob shorthands must not be matched by blind string replacement.
 *
 * `CHO` appears inside `CH₃CHOHCH₃`, where those three characters are a CH and
 * the start of an OH, not an aldehyde — replacing them turns propan-2-ol into
 * nonsense. So a fragment only matches when what follows it cannot be claiming
 * the fragment's last atom: no H, no subscript, no lowercase continuation.
 */
function fragmentAt(src: string, i: number): [string, string] | null {
  for (const [k, v] of FRAG_ORDER) {
    if (!src.startsWith(k, i)) continue;
    const after = src[i + k.length];
    if (after !== undefined && /[0-9a-zH]/.test(after)) continue;
    return [k, v];
  }
  return null;
}

const FRAG_ORDER = Object.entries(FRAGMENTS).sort((a, b) => b[0].length - a[0].length);

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  const readCount = (): number => {
    let n = '';
    while (i < src.length && /[0-9]/.test(src[i])) n += src[i++];
    return n ? parseInt(n, 10) : 1;
  };

  while (i < src.length) {
    const c = src[i];

    if (c === '(' || c === '[') { out.push({ kind: 'open' }); i++; continue; }
    if (c === ')' || c === ']') {
      i++;
      out.push({ kind: 'close', count: readCount() });
      continue;
    }
    if (c === '=') { out.push({ kind: 'bond', order: 2 }); i++; continue; }
    if (c === '#') { out.push({ kind: 'bond', order: 3 }); i++; continue; }
    if (c === '-') { out.push({ kind: 'bond', order: 1 }); i++; continue; }

    if (src.startsWith('Ph', i)) { out.push({ kind: 'phenyl' }); i += 2; continue; }

    const frag = fragmentAt(src, i);
    if (frag) {
      out.push(...tokenize(frag[1]));
      i += frag[0].length;
      continue;
    }

    const el = ELEMENTS.find(e => src.startsWith(e, i));
    if (!el) throw new ParseError(`Cannot read “${src.slice(i, i + 4)}”`, i);
    i += el.length;

    const selfCount = readCount(); // e.g. the 2 in "O2"
    let h = 0;
    if (src[i] === 'H') {
      i++;
      h = readCount();
    }

    if (el === 'H' && h === 0) {
      // A bare H, as in the leading H of HOCH2— or the trailing H of —CHO.
      out.push({ kind: 'group', el: 'H', h: 0 });
      for (let k = 1; k < selfCount; k++) out.push({ kind: 'group', el: 'H', h: 0 });
      continue;
    }

    for (let k = 0; k < selfCount; k++) out.push({ kind: 'group', el, h });
  }
  return out;
}

/**
 * Group abbreviations expand by substitution, longest first so tBu is not read
 * as t + Bu. Unlike the atom blobs these are unambiguous — no element symbol
 * spells Me, Et or tBu — so a plain replace is safe here.
 */
function expand(src: string): string {
  let s = src;
  for (const [k, v] of Object.entries(ABBREV).sort((a, b) => b[0].length - a[0].length)) {
    s = s.split(k).join(v);
  }
  return s;
}

/**
 * A bare molecular formula (C₆H₆, C₄H₁₀O) names a composition, not a
 * structure. orgchem answers those with the isomer list rather than silently
 * picking one, so they are detected and refused here rather than parsed into
 * whichever structure the reading order happens to produce.
 */
export function looksLikeMolecularFormula(src: string): boolean {
  const s = normalise(src);
  if (!/^[A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)*$/.test(s)) return false;
  // A composition has a repeated element count with no structural punctuation,
  // e.g. C6H6 — whereas CH3CH2OH repeats element symbols in sequence.
  return /^[A-Z][a-z]?\d{2,}/.test(s) || /^C\d+H\d+/.test(s);
}

/**
 * Left-hand groups are written mirrored — HO–, H₂N–, HOOC– — because that puts
 * the bond on the side the chain continues. Flip them so the parser only ever
 * has to read left to right.
 */
function unmirror(src: string): string {
  const flips: [RegExp, string][] = [
    [/^HOOC/, 'C(=O)OH'],
    [/^HO2C/, 'C(=O)OH'],
    [/^OHC/, 'C(=O)H'],
    [/^HO/, 'OH'],
    [/^H2N/, 'NH2'],
    [/^HN/, 'NH'],
    [/^H3C/, 'CH3'],
    [/^H2C/, 'CH2'],
  ];
  for (const [re, to] of flips) if (re.test(src)) return src.replace(re, to);
  return src;
}

/**
 * The parse. `chain` is the atom the next group will bond to; `pendingOrder`
 * carries an explicit = or # across to the next bond.
 */
export function parseCondensed(input: string): Molecule {
  const raw = normalise(input);
  if (!raw) throw new ParseError('Nothing to parse');
  if (looksLikeMolecularFormula(raw)) {
    throw new ParseError(`${raw} is a molecular formula — it names a composition, not one structure`);
  }
  const src = expand(unmirror(raw));
  const tokens = tokenize(src);

  const b: Builder = { atoms: [], bonds: [] };

  // Each frame is an open parenthesis: where the chain was when it opened, and
  // where the group inside it started.
  interface Frame { anchor: number | null; startAtom: number; startTok: number }
  const stack: Frame[] = [];

  let chain: number | null = null;
  let pending: 1 | 2 | 3 = 1;
  /** Groups parsed before the atom they hang off existed. */
  const orphans: number[] = [];

  const attach = (atom: number) => {
    if (chain !== null) addBond(b, chain, atom, pending);
    pending = 1;
    while (orphans.length) addBond(b, atom, orphans.pop()!, 1);
  };

  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];

    if (tok.kind === 'bond') {
      pending = tok.order!;
      continue;
    }

    if (tok.kind === 'open') {
      stack.push({ anchor: chain, startAtom: b.atoms.length, startTok: t });
      continue;
    }

    if (tok.kind === 'close') {
      const frame = stack.pop();
      if (!frame) throw new ParseError('Unbalanced parenthesis');
      const n = tok.count ?? 1;

      // ── the decision ────────────────────────────────────────────────────
      // Ask the group what it can do, not the notation what it looks like.
      //
      // Once bonded to its anchor, a group with no valence left can only ever
      // hang off the chain — it is a BRANCH. A group that still has a bond
      // free can carry the chain onward, so it is a REPEAT UNIT.
      //
      //   (CH₃)₃  CH₃ spends its one bond on the anchor → 0 free → branch
      //   (CH₂)₃  CH₂ spends one of two → 1 free → repeat unit
      // When the formula opened with the parenthesis there was no anchor to
      // bond to, so the group has not yet spent the valence it will spend on
      // the atom that follows. Discount it, or (CH₃)₃COH reads as a repeat.
      const groupFree = tailFree(b, frame.startAtom) - (frame.anchor === null ? 1 : 0);
      const isRepeat = groupFree > 0;

      if (isRepeat) {
        // Re-run the group's own tokens, each copy linked to the previous.
        for (let k = 1; k < n; k++) {
          const before = b.atoms.length;
          replay(b, tokens, frame.startTok + 1, t, chain);
          chain = tailOf(b, before);
        }
      } else {
        // n identical pendants, all on the same anchor.
        const roots = [frame.startAtom];
        for (let k = 1; k < n; k++) {
          const before = b.atoms.length;
          replay(b, tokens, frame.startTok + 1, t, frame.anchor);
          roots.push(before);
        }
        if (frame.anchor !== null) {
          chain = frame.anchor;
        } else {
          // A formula that opens with a branch — (CH₃)₃COH — has nothing to
          // hang the group on yet. Hold the copies aside and bond them to
          // whatever atom turns up next.
          orphans.push(...roots);
          chain = null;
        }
      }
      continue;
    }

    if (tok.kind === 'phenyl') {
      const idx = addPhenyl(b);
      attach(idx);
      chain = idx;
      continue;
    }

    // A plain atom group.
    const el = tok.el!;
    const h = tok.h ?? 0;

    if (el === 'H') {
      // A bare hydrogen terminates whatever it is written against.
      if (chain === null) throw new ParseError('A formula cannot begin with a bare H');
      const idx = addAtom(b, 'H', 0);
      addBond(b, chain, idx, 1);
      continue;
    }

    const idx = addAtom(b, el, h);

    // ── the other decision ───────────────────────────────────────────────
    // Mid-formula, a group that has no valence left after bonding cannot carry
    // the chain — so OH in CH₃CHOHCH₃ must hang off the CH rather than
    // continue from it. Bond it, but leave `chain` where it was.
    const carriesOn = VALENCE[el] - h - (chain === null ? 0 : pending) > 0;
    const more = tokens.slice(t + 1).some(x => x.kind === 'group' || x.kind === 'phenyl');
    attach(idx);
    if (carriesOn || !more) chain = idx;
    // else: chain stays put, and the next group bonds to it instead.
  }

  if (stack.length) throw new ParseError('Unbalanced parenthesis');

  const free = b.atoms.reduce((n, a) => n + a.free, 0);
  return {
    atoms: b.atoms,
    bonds: b.bonds,
    isGroup: free > 0,
    formula: molecularFormula(b.atoms),
  };
}

function tailOf(b: Builder, from: number): number {
  for (let i = b.atoms.length - 1; i >= from; i--) if (b.atoms[i].free > 0) return i;
  return b.atoms.length - 1;
}

/** Bonds still free across a parenthesised group, once it is bonded up. */
function tailFree(b: Builder, from: number): number {
  let n = 0;
  for (let i = from; i < b.atoms.length; i++) n += b.atoms[i].free;
  return n;
}

/** Re-parse a token range, bonding the first atom produced to `anchor`. */
function replay(b: Builder, tokens: Token[], from: number, to: number, anchor: number | null) {
  let chain = anchor;
  let pending: 1 | 2 | 3 = 1;
  for (let t = from; t < to; t++) {
    const tok = tokens[t];
    if (tok.kind === 'bond') { pending = tok.order!; continue; }
    if (tok.kind === 'open' || tok.kind === 'close') continue;
    if (tok.kind === 'phenyl') {
      const idx = addPhenyl(b);
      if (chain !== null) addBond(b, chain, idx, pending);
      pending = 1;
      chain = idx;
      continue;
    }
    const el = tok.el!;
    const h = tok.h ?? 0;
    if (el === 'H') {
      if (chain === null) continue;
      const idx = addAtom(b, 'H', 0);
      addBond(b, chain, idx, 1);
      continue;
    }
    const idx = addAtom(b, el, h);
    if (chain !== null) addBond(b, chain, idx, pending);
    pending = 1;
    const carriesOn = VALENCE[el] - h > 1;
    if (carriesOn) chain = idx;
  }
}

const HILL = ['C', 'H'];

export function molecularFormula(atoms: Atom[]): string {
  const counts: Record<string, number> = {};
  let h = 0;
  for (const a of atoms) {
    counts[a.el] = (counts[a.el] ?? 0) + 1;
    h += a.h;
  }
  counts.H = (counts.H ?? 0) + h;
  const keys = Object.keys(counts).sort((a, b) => {
    const ia = HILL.indexOf(a);
    const ib = HILL.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.localeCompare(b);
  });
  return keys
    .filter(k => counts[k] > 0)
    .map(k => k + (counts[k] > 1 ? sub(counts[k]) : ''))
    .join('');
}

const SUBS = '₀₁₂₃₄₅₆₇₈₉';
export function sub(n: number): string {
  return String(n).split('').map(d => SUBS[+d] ?? d).join('');
}
