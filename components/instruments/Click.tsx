'use client';

/**
 * finprint's front end, at 10^-3 m — a real log-mel spectrogram.
 *
 * Microphone → Hann window → FFT → mel filterbank → log. Nothing here is
 * `AnalyserNode.getByteFrequencyData`; the transform is the one in
 * `lib/dsp/mel.ts`, because the point of the station is the transform.
 *
 * With no microphone it runs the same chain over a synthesised sweep, so the
 * instrument still shows what it claims to show — and says which it is doing.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createMelAnalyser } from '@/lib/dsp/mel';
import styles from './Click.module.css';

const FFT = 1024;
const BANDS = 96;
const HISTORY = 220;

type Source = 'idle' | 'mic' | 'synth';

export default function Click() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState<Source>('idle');
  const [error, setError] = useState<string | null>(null);
  const [peak, setPeak] = useState<{ hz: number; db: number } | null>(null);

  const stateRef = useRef<{
    ctx?: AudioContext;
    stream?: MediaStream;
    raf?: number;
    column: Float32Array[];
    head: number;
  }>({ column: [], head: 0 });

  const stop = useCallback(() => {
    const s = stateRef.current;
    if (s.raf) cancelAnimationFrame(s.raf);
    s.stream?.getTracks().forEach(t => t.stop());
    void s.ctx?.close();
    s.ctx = undefined;
    s.stream = undefined;
    s.raf = undefined;
  }, []);

  // Tear the audio graph down when the instrument goes away — travelling to
  // another station unmounts it — and also when the tab stops being looked at.
  // Nothing here should still be making noise in a background tab.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) {
        stop();
        setSource('idle');
        setPeak(null);
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      stop();
    };
  }, [stop]);

  const start = useCallback(
    async (want: 'mic' | 'synth') => {
      stop();
      setError(null);
      const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtor();
      const s = stateRef.current;
      s.ctx = ctx;
      s.column = [];
      s.head = 0;

      // Autoplay policy: a context created before a gesture starts suspended.
      if (ctx.state === 'suspended') await ctx.resume();

      let node: AudioNode;
      let audible = false;
      if (want === 'mic') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          s.stream = stream;
          node = ctx.createMediaStreamSource(stream);
        } catch {
          setError('Microphone declined — running the same chain on a synthesised sweep instead.');
          void ctx.close();
          return start('synth');
        }
      } else {
        // A tone swept across the band, so the transform has something with
        // structure to show.
        //
        // Deliberately short and self-terminating. Audio a visitor did not ask
        // to keep hearing has to stop on its own; two sweeps is enough to fill
        // the spectrogram once, and the oscillator is scheduled to end rather
        // than left running until something remembers to kill it.
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const now = ctx.currentTime;
        const SWEEP = 6;
        const CYCLES = 2;
        for (let k = 0; k < CYCLES; k++) {
          osc.frequency.setValueAtTime(180, now + k * SWEEP * 2);
          osc.frequency.exponentialRampToValueAtTime(4200, now + k * SWEEP * 2 + SWEEP);
          osc.frequency.exponentialRampToValueAtTime(180, now + (k + 1) * SWEEP * 2);
        }
        const gain = ctx.createGain();
        gain.gain.value = 0.07;
        osc.connect(gain);
        osc.start();
        osc.stop(now + CYCLES * SWEEP * 2);
        osc.onended = () => {
          stop();
          setSource('idle');
          setPeak(null);
        };
        node = gain;
        audible = true;
      }

      // A ScriptProcessor would be simpler but is deprecated and janky; an
      // AnalyserNode gives raw time-domain samples, which is all this needs —
      // the transform is ours.
      const tap = ctx.createAnalyser();
      tap.fftSize = FFT;
      node.connect(tap);

      // Web Audio pulls the graph from the destination: a branch that reaches
      // nothing is never processed, and the analyser reads a flat floor. So the
      // tap has to terminate at the destination either way — through a muted
      // gain for the microphone, which must not be played back into the room.
      const sink = ctx.createGain();
      sink.gain.value = audible ? 1 : 0;
      tap.connect(sink);
      sink.connect(ctx.destination);

      const mel = createMelAnalyser(FFT, BANDS, ctx.sampleRate);
      const buf = new Float32Array(FFT);

      const tick = () => {
        tap.getFloatTimeDomainData(buf);
        const frame = mel.frame(buf);
        const copy = Float32Array.from(frame);
        s.column.push(copy);
        if (s.column.length > HISTORY) s.column.shift();

        let bestI = 0;
        let bestV = -Infinity;
        for (let i = 0; i < copy.length; i++) if (copy[i] > bestV) { bestV = copy[i]; bestI = i; }
        // Report the peak band's centre frequency, back out of the mel scale.
        const melMax = 2595 * Math.log10(1 + ctx.sampleRate / 2 / 700);
        const melMin = 2595 * Math.log10(1 + 40 / 700);
        const m = melMin + ((melMax - melMin) * (bestI + 1)) / (BANDS + 1);
        setPeak({ hz: 700 * (10 ** (m / 2595) - 1), db: bestV });

        s.raf = requestAnimationFrame(tick);
      };
      tick();
      setSource(want);
    },
    [stop],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const box = wrap.getBoundingClientRect();
    const w = Math.max(120, box.width);
    const h = Math.max(90, box.height);
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cols = stateRef.current.column;
    const cw = w / HISTORY;
    const ch = h / BANDS;

    const dark = document.documentElement.getAttribute('data-theme') === 'dark'
      || (!document.documentElement.getAttribute('data-theme')
        && window.matchMedia('(prefers-color-scheme: dark)').matches);

    for (let x = 0; x < cols.length; x++) {
      const col = cols[x];
      for (let b = 0; b < BANDS; b++) {
        // Map dB to ink density: quiet is paper, loud is ink. One channel, the
        // way a printed spectrogram works — no rainbow.
        const v = Math.max(0, Math.min(1, (col[b] + 85) / 70));
        if (v <= 0.02) continue;
        ctx.fillStyle = dark
          ? `rgba(236, 229, 215, ${v * 0.92})`
          : `rgba(22, 20, 15, ${v * 0.92})`;
        ctx.fillRect(x * cw, h - (b + 1) * ch, Math.ceil(cw), Math.ceil(ch));
      }
    }

    ctx.strokeStyle = getComputedStyle(wrap).getPropertyValue('--rule').trim();
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

    requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, [draw]);

  return (
    <div className={styles.rig}>
      <div className={styles.axisRow}>
        <div className={styles.axis}>
          <span>{Math.round(48000 / 2 / 1000)}k</span>
          <span>2k</span>
          <span>500</span>
          <span>40 Hz</span>
        </div>
        <div className={styles.canvasWrap} ref={wrapRef}>
          <canvas ref={canvasRef} role="img" aria-label="Live log-mel spectrogram" />
          {source === 'idle' ? (
            <div className={styles.overlay}>
              <span className="label">96 mel bands · 1024-point FFT · Hann</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.controls}>
        <button className="switch" data-on={source === 'mic'} onClick={() => start('mic')}>
          use my microphone
        </button>
        <button className="switch" data-on={source === 'synth'} onClick={() => start('synth')}>
          synthesised sweep
        </button>
        {source !== 'idle' ? (
          <button className="switch" onClick={() => { stop(); setSource('idle'); setPeak(null); }}>
            stop
          </button>
        ) : null}
        <span className={styles.peak}>
          {peak && source !== 'idle' ? (
            <>
              peak <strong className="num">{peak.hz < 1000 ? `${peak.hz.toFixed(0)} Hz` : `${(peak.hz / 1000).toFixed(2)} kHz`}</strong>
              {' at '}
              <strong className="num">{peak.db.toFixed(0)} dB</strong>
            </>
          ) : null}
        </span>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {source === 'synth' && !error ? (
        <p className={styles.error}>Synthesised, not recorded — a swept tone, so the transform has
        something with structure to show.</p>
      ) : null}
    </div>
  );
}
