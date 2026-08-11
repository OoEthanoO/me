export const PROFILE = {
  name: 'Ethan Yan Xu',
  handle: 'OoEthanoO',
  location: 'Toronto',
  email: 'ethanxucoder@gmail.com',
  github: 'https://github.com/OoEthanoO',
  site: 'https://www.ethanyanxu.com',
} as const;

export const PAPER = {
  title:
    'A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features',
  author: 'Yan (Ethan) Xu',
  journal: 'The Columbia Junior Science Journal',
  volume: 'Volume 11, 2025–2026',
  pages: 'pp. 1–6',
  issue: 'https://cjsjournal.squarespace.com/20252026-cjsj',
  pdf: '/paper/xu-cjsj-v11.pdf',
  figures: [
    { src: '/paper/fig2-xgboost-feature-importance.png', caption: 'Fig. 2 — XGBoost feature importance' },
    { src: '/paper/fig4-xgboost-onestep.png', caption: 'Fig. 4 — XGBoost, one-step-ahead' },
    { src: '/paper/fig6-xgboost-autoregressive.png', caption: 'Fig. 6 — XGBoost, autoregressive' },
    { src: '/paper/fig1-lightgbm-feature-importance.png', caption: 'Fig. 1 — LightGBM feature importance' },
    { src: '/paper/fig3-lightgbm-onestep.png', caption: 'Fig. 3 — LightGBM, one-step-ahead' },
    { src: '/paper/fig5-lightgbm-autoregressive.png', caption: 'Fig. 5 — LightGBM, autoregressive' },
  ],
} as const;

export interface Result {
  name: string;
  value: string;
  year?: string;
}

export const RECORD: Result[] = [
  { name: 'CCC Junior', value: '75 / 75', year: '2023' },
  { name: 'CCC Senior', value: '45 / 75', year: '2024' },
  { name: 'USACO', value: 'Silver' },
  { name: 'ACSL Senior', value: 'Bronze', year: '2025' },
  { name: 'AP Computer Science A', value: '5' },
  { name: 'Volunteering, submitted', value: '331 h' },
  { name: 'Raised for SickKids', value: '$3,480' },
];

/**
 * The measurement-honesty material. These are Ethan's own words from his own
 * READMEs — the retractions, the negative results, the things he checked and
 * found he had got wrong. It is the least common thing in a portfolio and the
 * most characteristic thing in his repositories, so it is quoted rather than
 * paraphrased.
 */
export interface Retraction {
  repo: string;
  quote: string;
}

export const RETRACTIONS: Retraction[] = [
  {
    repo: 'cuda-from-scratch',
    quote:
      'My benchmark had a 50% noise floor at small N and I did not notice for three rounds. I had already published an explanation for a 1.9% “regression” that this noise had invented.',
  },
  {
    repo: 'cuda-from-scratch',
    quote:
      'The 50% error did not change a single conclusion. It was common-mode, so it cancelled in every ratio and ranking I had drawn from it. “Noisy” and “wrong” are different claims.',
  },
  {
    repo: 'cuda-from-scratch',
    quote:
      'Across Colab sessions the same code moves 5–15%, cuBLAS included. Quote the range, never an endpoint.',
  },
  {
    repo: 'cuda-from-scratch',
    quote:
      'Six rungs of optimisation bought this network nothing; the dispatcher did.',
  },
  {
    repo: 'finprint',
    quote:
      'We originally wanted to predict behavioral context. After surveying the data, that isn’t honestly possible — the Watkins database has no behavioral or call-type labels. So instead of fabricating a “behavior” model, finprint classifies calls by their acoustic structure.',
  },
  {
    repo: 'finprint',
    quote:
      'Confidence alone cannot catch silence: a closed-set softmax is more certain on garbage than on a quiet real call — pure silence scores 0.72 and white noise 0.95.',
  },
  {
    repo: 'coolroute',
    quote:
      'OSM has only 19 individually mapped trees in Claremont, so tree shade uses priors by street type.',
  },
  {
    repo: 'stroj-v2',
    quote:
      'macOS accepts RLIMIT_AS and then ignores it — a submission with a 256 MiB limit will happily allocate several GiB. This is not a container, a VM, or a defence against someone who is actually trying.',
  },
  {
    repo: 'orgchem',
    quote:
      'C₆H₁₄O has 39 constitutional isomers in principle and 32 on file. The list counts structures rather than records.',
  },
];
