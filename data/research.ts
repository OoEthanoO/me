export interface ResearchStat {
  /** Headline figure, printed large. */
  value: string;
  label: string;
  /** The comparison the figure is measured against. */
  detail: string;
}

export interface ResearchPaper {
  title: string;
  venue: string;
  /** Full citation line as it should be printed. */
  citation: string;
  year: string;
  url: string;
  /** Why the problem is worth solving. */
  motivation: string;
  abstract: string;
  method: { label: string; detail: string }[];
  results: ResearchStat[];
  finding: string;
  technologies: string[];
}

export const papers: ResearchPaper[] = [
  {
    title:
      "A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features",
    venue: "The Columbia Junior Science Journal",
    citation: "The Columbia Junior Science Journal, Volume 11, 2025–2026",
    year: "2025",
    url: "https://tides.ethanyanxu.com/",
    motivation:
      "Flooding causes roughly $8.2 billion in damages every year in the United States alone. Harmonic tide predictions miss the residual — the part of the water level driven by weather and terrain — and that residual is where the damage lives.",
    abstract:
      "Standard water level forecasts model time and little else. This work asks whether the shape of the land around a station carries signal the clock does not, by pairing four years of NOAA station data with elevation clips taken from a global digital elevation model and measuring what the terrain adds.",
    method: [
      {
        label: "Data",
        detail:
          "15 NOAA water level stations, four years of verified readings at 6-minute intervals (August 2021 – August 2025).",
      },
      {
        label: "Terrain",
        detail:
          "Copernicus GLO-30 DEM at 30-metre resolution, sampled as 3 km × 3 km clips centred on each station.",
      },
      {
        label: "Models",
        detail:
          "A LightGBM baseline on 10 temporal features, against an XGBoost model on the same 10 temporal features plus 12 geospatial ones.",
      },
      {
        label: "Validation",
        detail:
          "70/30 train-test split with 5-fold temporal cross-validation through GridSearchCV, scored on RMSE and R² for both one-step-ahead and two-day autoregressive forecasting.",
      },
    ],
    results: [
      {
        value: "84.38%",
        label: "Lower error over a two-day forecast",
        detail:
          "At an unseen station, XGBoost with terrain held 0.0763 m RMSE where the temporal-only LightGBM drifted to 0.4887 m.",
      },
      {
        value: "0.0097 m",
        label: "One-step-ahead RMSE on validation data",
        detail: "Against 0.0102 m for the temporal-only baseline.",
      },
      {
        value: "28.26%",
        label: "Where the baseline still wins",
        detail:
          "One step ahead at unseen station 9411340, LightGBM's 0.0085 m beat XGBoost's 0.0118 m — reported rather than buried.",
      },
    ],
    finding:
      "Terrain features act as a stabilizing anchor: they barely matter one step ahead, but they stop the model drifting once it starts feeding on its own predictions. Elevation mean and maximum ranked as the top geospatial contributors alongside the first residual lag. The honest caveat is that with enough station history, the simpler temporal model still generalizes better in the short horizon.",
    technologies: [
      "Python",
      "XGBoost",
      "LightGBM",
      "Rasterio",
      "NumPy",
      "GridSearchCV",
      "NOAA Tides & Currents",
      "Copernicus GLO-30 DEM",
    ],
  },
];

export interface ResearchFigure {
  number: number;
  src: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  /** Long-form description of the chart for screen readers. */
  alt: string;
}

/** The published PDF, served from this site rather than hot-linked. */
export const paperPdf = "/research/xu-water-level-residual-correction-cjsj-v11.pdf";

/** Figures and captions as they appear in the paper. */
export const figures: ResearchFigure[] = [
  {
    number: 1,
    src: "/research/fig1-lightgbm-feature-importance.png",
    width: 711,
    height: 455,
    title: "LightGBM Feature Importance",
    caption:
      "Ranks the relative influence of temporal variables on residual prediction accuracy across 15 training stations. Lagged residuals (residual_lag1, residual_lag2) and the rate of change are the dominant predictors.",
    alt: "Horizontal bar chart of LightGBM feature importance. residual_lag1 dominates at 441352.492, followed by rate_of_change_m at 4495.545 and residual_lag2 at 2935.392, with dayofweek, predicted_m, hour, month, season and tide_phase far smaller.",
  },
  {
    number: 2,
    src: "/research/fig2-xgboost-feature-importance.png",
    width: 1035,
    height: 701,
    title: "XGBoost Feature Importance",
    caption:
      "Ranks the relative influence of combined temporal and geospatial variables on residual prediction accuracy across 15 training stations. Alongside temporal lags, static terrain metrics like mean and maximum elevation (elev_mean, elev_max) emerge as top predictors.",
    alt: "Horizontal bar chart of XGBoost feature importance. residual_lag1 ranks first at approximately 1044, residual_lag2 second, then elev_mean and elev_max as the leading geospatial features, followed by tide_phase, rate_of_change_m and further terrain statistics.",
  },
  {
    number: 3,
    src: "/research/fig3-lightgbm-onestep.png",
    width: 993,
    height: 503,
    title: "Model Validation: LightGBM (One-Step-Ahead)",
    caption:
      "Compares water level predictions at unseen NOAA station 9411340 over a two-day period (August 22–23, 2025) using true prior residuals. The graph displays the true measured level (observed_m, blue), NOAA's baseline prediction (predicted_m, orange), and the LightGBM-corrected prediction (corrected_predicted_m, green).",
    alt: "Time series over two days at station 9411340. The LightGBM-corrected line tracks the observed water level closely, sitting nearer to it than the NOAA baseline throughout.",
  },
  {
    number: 4,
    src: "/research/fig4-xgboost-onestep.png",
    width: 1012,
    height: 503,
    title: "Model Validation: XGBoost (One-Step-Ahead)",
    caption:
      "Compares water level predictions at unseen NOAA station 9411340 over a two-day period (August 22–23, 2025) using true prior residuals. The graph displays the true measured level (Observed, blue), NOAA's baseline prediction (Predicted (NOAA), orange), and the geospatially-informed XGBoost correction (Corrected Predicted (XGBoost), green).",
    alt: "Time series over two days at station 9411340. The geospatially-informed XGBoost correction tracks the observed water level closely against the NOAA baseline.",
  },
  {
    number: 5,
    src: "/research/fig5-lightgbm-autoregressive.png",
    width: 993,
    height: 503,
    title: "Model Validation: LightGBM (Autoregressive)",
    caption:
      "Evaluates autonomous multi-step forecasting at unseen NOAA station 9411340 over a two-day period. The LightGBM-corrected prediction (green) deviates significantly from the true observed level (blue) and NOAA baseline (orange), demonstrating rapid error accumulation.",
    alt: "Time series over two days at station 9411340. The LightGBM autoregressive forecast drifts progressively away from the observed water level as it feeds on its own predictions.",
  },
  {
    number: 6,
    src: "/research/fig6-xgboost-autoregressive.png",
    width: 1013,
    height: 502,
    title: "Model Validation: XGBoost (Autoregressive)",
    caption:
      "Evaluates autonomous multi-step forecasting at unseen NOAA station 9411340 over a two-day period. The XGBoost-corrected prediction (green) closely tracks the true observed level (blue) against the NOAA baseline (orange), demonstrating model stability.",
    alt: "Time series over two days at station 9411340. The XGBoost autoregressive forecast stays close to the observed water level across the full horizon, without the drift seen in the temporal-only model.",
  },
];
