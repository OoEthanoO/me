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
    citation: "The Columbia Junior Science Journal, Volume 11, 2025–2026, pp. 1–6",
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
