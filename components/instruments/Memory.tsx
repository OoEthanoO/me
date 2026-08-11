'use client';

/**
 * cuda-from-scratch, at 10^-8 m — the ladder, run on the visitor's own GPU.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { RUNGS, runLadder, webgpuAvailable, type LadderReport } from '@/lib/gemm/ladder';
import styles from './Memory.module.css';

/** The measured T4 numbers from the repository, for comparison. */
const T4 = [
  { k: 'v1 naive', v: '3.2%' },
  { k: 'v2 coalesced', v: '11.0%' },
  { k: 'v3 tiled', v: '23.4%' },
  { k: 'v5 register 8×8', v: '80.5%' },
  { k: 'v7 double-buffered', v: '93.5%' },
  { k: 'auto-dispatch', v: '94.3%' },
];

type State =
  | { phase: 'idle' }
  | { phase: 'unsupported' }
  | { phase: 'running'; note: string }
  | { phase: 'done'; report: LadderReport }
  | { phase: 'failed'; error: string };

export default function Memory() {
  const [state, setState] = useState<State>({ phase: 'idle' });
  const started = useRef(false);

  useEffect(() => {
    webgpuAvailable().then(ok => {
      if (!ok) setState({ phase: 'unsupported' });
    });
  }, []);

  const run = useCallback(async () => {
    if (started.current) return;
    started.current = true;
    setState({ phase: 'running', note: 'requesting an adapter…' });
    try {
      const report = await runLadder({
        n: 512,
        rounds: 5,
        onProgress: note => setState({ phase: 'running', note }),
      });
      setState({ phase: 'done', report });
    } catch (e) {
      setState({ phase: 'failed', error: (e as Error).message });
    } finally {
      started.current = false;
    }
  }, []);

  return (
    <div className={styles.rig}>
      <Coalescing />

      <div className={styles.ladder}>
        <table className="sheet">
          <thead>
            <tr>
              <th>rung</th>
              <th>the one change</th>
              <th className="n">GFLOP/s</th>
              <th className="n">vs tiled</th>
            </tr>
          </thead>
          <tbody>
            {RUNGS.map(rung => {
              const r = state.phase === 'done' ? state.report.results.find(x => x.id === rung.id) : undefined;
              return (
                <tr key={rung.id} data-emph={rung.id === 'register' ? 'true' : 'false'}>
                  <td>{rung.label}</td>
                  <td className={styles.change}>{rung.change}</td>
                  <td className="n">
                    {r ? (r.correct ? r.gflops.toFixed(1) : 'wrong') : '—'}
                  </td>
                  <td className="n">
                    {r && r.correct ? (
                      <>
                        {(1 / r.ratio).toFixed(2)}×
                        <span className={styles.spread}>
                          {' '}
                          {(1 / r.ratioMax).toFixed(2)}–{(1 / r.ratioMin).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.control}>
        {state.phase === 'idle' ? (
          <>
            <button className="switch" onClick={run}>
              run the ladder on my gpu
            </button>
            <span className={styles.hint}>512 × 512, five interleaved rounds · a second or two</span>
          </>
        ) : null}

        {state.phase === 'running' ? (
          <span className={styles.running}>
            <span className={styles.pulse} aria-hidden="true" />
            {state.note}
          </span>
        ) : null}

        {state.phase === 'unsupported' ? (
          <span className={styles.hint}>
            No WebGPU in this browser, so there is nothing honest to measure — the numbers on the
            right are the ones from the repository, on a Tesla T4.
          </span>
        ) : null}

        {state.phase === 'failed' ? <span className={styles.hint}>Could not run: {state.error}</span> : null}

        {state.phase === 'done' ? (
          <div className={styles.honesty}>
            <span className="label label--signal">the honesty line</span>
            <p>
              {state.report.adapter}, N={state.report.n}, {state.report.rounds} rounds. Each timing
              was paired with an adjacent timing of the tiled kernel and the median{' '}
              <em>ratio</em> reported, because the reference itself moved{' '}
              <strong className="num">
                {((state.report.referenceSpread[1] / state.report.referenceSpread[0] - 1) * 100).toFixed(0)}%
              </strong>{' '}
              across this run. The range beside each number is the real spread. Quote the range,
              never an endpoint.
            </p>
          </div>
        ) : null}
      </div>

      <details className={styles.t4}>
        <summary className="label">the same ladder on a Tesla T4, from the repo</summary>
        <table className="sheet">
          <tbody>
            {T4.map(r => (
              <tr key={r.k}>
                <td>{r.k}</td>
                <td className="n">{r.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.hint}>Percentage of cuBLAS at N=4096. Different silicon, different
        API, different ceiling — comparable in shape, not in magnitude.</p>
      </details>
    </div>
  );
}

/**
 * Why rung 1 and rung 2 differ. Sixteen lanes of a wave, and the memory lines
 * they touch under each index mapping — the whole argument, drawn.
 */
function Coalescing() {
  const LANES = 16;
  const W = 320;
  const H = 74;
  const laneW = W / LANES;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.diagram} role="img"
         aria-label="Sixteen lanes mapped to rows touch sixteen separate memory lines; mapped to columns they touch one.">
      <text x={0} y={8} className={styles.dLabel}>lane → row</text>
      {Array.from({ length: LANES }, (_, i) => (
        <g key={i}>
          <rect x={i * laneW + 1} y={12} width={laneW - 2} height={7} className={styles.lane} />
          <line x1={i * laneW + laneW / 2} y1={19} x2={i * laneW + laneW / 2} y2={27} className={styles.trace} />
          <rect x={i * laneW + 1} y={27} width={laneW - 2} height={5} className={styles.lineHit} />
        </g>
      ))}
      <text x={W} y={8} className={styles.dCount} textAnchor="end">16 lines touched</text>

      <text x={0} y={50} className={styles.dLabel}>lane → column</text>
      {Array.from({ length: LANES }, (_, i) => (
        <g key={`c${i}`}>
          <rect x={i * laneW + 1} y={54} width={laneW - 2} height={7} className={styles.lane} />
          <line x1={i * laneW + laneW / 2} y1={61} x2={W / 2} y2={68} className={styles.traceHot} />
        </g>
      ))}
      <rect x={W / 2 - 40} y={68} width={80} height={5} className={styles.lineHitHot} />
      <text x={W} y={50} className={styles.dCountHot} textAnchor="end">1 line touched</text>
    </svg>
  );
}
