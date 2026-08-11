// Checks the condensed-formula parser against the ambiguities orgchem's README
// calls out by name, plus the examples it advertises on its front page.
// Node 22.6+ strips TypeScript types on import, so the parser is exercised
// exactly as the browser gets it — no build step, no second copy.
import { parseCondensed } from '../lib/chem/parse.ts';

let pass = 0;
let fail = 0;

function check(input, expectFormula, expectGroup, note) {
  try {
    const m = parseCondensed(input);
    const okF = m.formula === expectFormula;
    const okG = m.isGroup === expectGroup;
    if (okF && okG) {
      pass++;
      console.log(`  ok   ${input.padEnd(24)} ${m.formula}${m.isGroup ? '  (group)' : ''}`);
    } else {
      fail++;
      console.log(`  FAIL ${input.padEnd(24)} got ${m.formula}${m.isGroup ? ' (group)' : ''}, want ${expectFormula}${expectGroup ? ' (group)' : ''}${note ? '  — ' + note : ''}`);
    }
  } catch (e) {
    fail++;
    console.log(`  FAIL ${input.padEnd(24)} threw: ${e.message}`);
  }
}

console.log('\nthe ambiguities the README calls out');
check('CH3CH(CH3)CH3', 'C₄H₁₀', false, 'branch, not repeat');
check('CH3(CH2)3CH3', 'C₅H₁₂', false, 'repeat, not branch');
check('CH3CHOHCH3', 'C₃H₈O', false, 'OH must branch mid-formula');
check('CH3CH2OH', 'C₂H₆O', false);
check('CH3CH2CH2CH2CH2', 'C₅H₁₁', true, 'pentyl group — one bond spare');

console.log('\nthe front-page examples');
check('CH3CH2CH2CH2CH2', 'C₅H₁₁', true);
check('(CH3)3COH', 'C₄H₁₀O', false, 'tert-butanol');
check('CH3(CH2)16COOH', 'C₁₈H₃₆O₂', false, 'stearic acid');
check('CH3CH=CHCH3', 'C₄H₈', false);
check('HOCH2CH2OH', 'C₂H₆O₂', false, 'reversed left-hand group');
check('CH3COOH', 'C₂H₄O₂', false);
check('PhCH2COOH', 'C₈H₈O₂', false);
check('CF3COOH', 'C₂HF₃O₂', false);
check('tBuOH', 'C₄H₁₀O', false);

console.log('\nmore');
check('CH4', 'CH₄', false);
check('CH3CH2CH2CH3', 'C₄H₁₀', false);
check('CH3CH(CH3)CH2CH3', 'C₅H₁₂', false);
check('CH3C(=O)CH3', 'C₃H₆O', false, 'acetone');
check('CH3CN', 'C₂H₃N', false, 'acetonitrile');
check('CH3CHO', 'C₂H₄O', false, 'acetaldehyde');
check('HOOCCH2COOH', 'C₃H₄O₄', false, 'malonic acid');
checkRefuses('C6H6', 'molecular formula');
checkRefuses('C4H10O', 'molecular formula');


function checkRefuses(input, expectIn) {
  try {
    const m = parseCondensed(input);
    fail++;
    console.log(`  FAIL ${input.padEnd(24)} parsed as ${m.formula}, should have been refused`);
  } catch (e) {
    if (String(e.message).includes(expectIn)) {
      pass++;
      console.log(`  ok   ${input.padEnd(24)} refused: ${e.message}`);
    } else {
      fail++;
      console.log(`  FAIL ${input.padEnd(24)} wrong refusal: ${e.message}`);
    }
  }
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
