/**
 * The front end of finprint's model, written out.
 *
 * A radix-2 FFT, a Hann window, a mel filterbank and a log. This is the whole
 * preprocessing chain that stands between a recording and the CNN, and it is
 * short enough to write from scratch, which is the reason to.
 */

/** In-place iterative radix-2 Cooley–Tukey. `re`/`im` must be a power of two. */
export function fft(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  if ((n & (n - 1)) !== 0) throw new Error('fft length must be a power of two');

  // Bit-reversal permutation.
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k];
        const ui = im[i + k];
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr;
        im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr;
        im[i + k + len / 2] = ui - vi;
        const nr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = nr;
      }
    }
  }
}

export function hann(n: number): Float32Array {
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  return w;
}

const hzToMel = (hz: number) => 2595 * Math.log10(1 + hz / 700);
const melToHz = (mel: number) => 700 * (10 ** (mel / 2595) - 1);

/**
 * Triangular mel filterbank as a sparse set of (start, weights) rows — the
 * same construction librosa uses, and the reason a spectrogram's low end gets
 * so much more resolution than its top.
 */
export function melFilterbank(
  bands: number,
  fftSize: number,
  sampleRate: number,
  fMin = 40,
  fMax = sampleRate / 2,
): { start: Int32Array; weights: Float32Array[] } {
  const bins = fftSize / 2 + 1;
  const melMin = hzToMel(fMin);
  const melMax = hzToMel(fMax);
  const points = new Float32Array(bands + 2);
  for (let i = 0; i < points.length; i++) {
    const mel = melMin + ((melMax - melMin) * i) / (bands + 1);
    points[i] = Math.floor(((fftSize + 1) * melToHz(mel)) / sampleRate);
  }

  const start = new Int32Array(bands);
  const weights: Float32Array[] = [];
  for (let m = 0; m < bands; m++) {
    const left = points[m];
    const centre = points[m + 1];
    const right = points[m + 2];
    const lo = Math.max(0, Math.min(left, bins - 1));
    const hi = Math.max(lo + 1, Math.min(right, bins - 1));
    const w = new Float32Array(hi - lo + 1);
    for (let k = lo; k <= hi; k++) {
      let v = 0;
      if (k >= left && k <= centre && centre > left) v = (k - left) / (centre - left);
      else if (k > centre && k <= right && right > centre) v = (right - k) / (right - centre);
      w[k - lo] = v;
    }
    start[m] = lo;
    weights.push(w);
  }
  return { start, weights };
}

export interface MelAnalyser {
  fftSize: number;
  bands: number;
  /** One frame of log-mel energies in dB, from a block of samples. */
  frame(samples: Float32Array): Float32Array;
}

export function createMelAnalyser(fftSize: number, bands: number, sampleRate: number): MelAnalyser {
  const window = hann(fftSize);
  const bank = melFilterbank(bands, fftSize, sampleRate);
  const re = new Float32Array(fftSize);
  const im = new Float32Array(fftSize);
  const power = new Float32Array(fftSize / 2 + 1);
  const out = new Float32Array(bands);

  return {
    fftSize,
    bands,
    frame(samples: Float32Array): Float32Array {
      const n = Math.min(fftSize, samples.length);
      for (let i = 0; i < n; i++) re[i] = samples[i] * window[i];
      re.fill(0, n);
      im.fill(0);
      fft(re, im);
      for (let k = 0; k < power.length; k++) power[k] = re[k] * re[k] + im[k] * im[k];

      for (let m = 0; m < bands; m++) {
        let sum = 0;
        const w = bank.weights[m];
        const s = bank.start[m];
        for (let i = 0; i < w.length; i++) sum += power[s + i] * w[i];
        // dB, floored well below anything a microphone produces so silence is
        // a flat floor rather than negative infinity.
        out[m] = 10 * Math.log10(sum + 1e-10);
      }
      return out;
    },
  };
}
