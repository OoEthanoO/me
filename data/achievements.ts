export interface Achievement {
  /** Label printed at the timeline marker. */
  year: string;
  /** Ordering key; spans use the later year minus a fraction so they sit just below it. */
  sortYear: number;
  title: string;
  detail?: string;
  kind: "award" | "certificate";
  href?: string;
}

/** Scholastic excellence awards and certificates, newest first. */
export const achievements: Achievement[] = [
  {
    year: "2026",
    sortYear: 2026,
    kind: "award",
    title: "USA Computing Olympiad (USACO)",
    detail: "Gold Division competitor, February contest.",
  },
  {
    year: "2026",
    sortYear: 2026,
    kind: "award",
    title: "York Region Sci-Tech Fair",
    detail:
      "Silver Medal, and first place for the Canadian Meteorological and Oceanographic Society (CMOS) Award.",
    href: "https://cora.ethanyanxu.com/",
  },
  {
    year: "2026",
    sortYear: 2026,
    kind: "award",
    title: "Avogadro Chemistry Contest",
    detail:
      "29th in Canada out of 3,045 participants, and 158th worldwide out of 4,252.",
  },
  {
    year: "2026",
    sortYear: 2026,
    kind: "award",
    title: "Canadian Computing Competition — Senior",
    detail: "39/75, Honour Roll.",
  },
  {
    year: "2025–26",
    sortYear: 2025.9,
    kind: "award",
    title: "Columbia Junior Science Journal",
    detail:
      "Finalist, and published in the 2025–2026 volume, for “A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features.”",
    href: "https://tides.ethanyanxu.com/",
  },
  {
    year: "2025",
    sortYear: 2025,
    kind: "award",
    title: "Ignite CS Expo — Senior Division",
    detail:
      "2nd place in Data Science, for CORA, which models environmental impact and community flood risk from real-world geospatial data.",
    href: "https://cora.ethanyanxu.com/",
  },
  {
    year: "2025",
    sortYear: 2025,
    kind: "award",
    title: "Hack the North",
    detail: "Participant, University of Waterloo.",
  },
  {
    year: "2025",
    sortYear: 2025,
    kind: "certificate",
    title: "Canadian Senior Mathematics Contest",
    detail: "Top twenty-five percent of contestants.",
  },
  {
    year: "2025",
    sortYear: 2025,
    kind: "certificate",
    title: "Euclid Contest",
    detail: "Top twenty-five percent of contestants.",
  },
  {
    year: "2024–25",
    sortYear: 2024.9,
    kind: "award",
    title: "American Computer Science League",
    detail: "Senior Finals, Bronze Medalist.",
  },
  {
    year: "2024",
    sortYear: 2024,
    kind: "award",
    title: "Canadian Computing Competition — Senior",
    detail: "45/75, Honour Roll.",
  },
  {
    year: "2024",
    sortYear: 2024,
    kind: "award",
    title: "Hack the North",
    detail: "Participant, University of Waterloo.",
  },
  {
    year: "2024",
    sortYear: 2024,
    kind: "certificate",
    title: "Inspirit AI Scholars",
    detail: "Best Presentation certificate.",
  },
  {
    year: "2023",
    sortYear: 2023,
    kind: "award",
    title: "Canadian Computing Competition — Junior",
    detail: "75/75, Honour Roll.",
  },
  {
    year: "2023",
    sortYear: 2023,
    kind: "certificate",
    title: "Royal Canadian Air Cadet Band & Drill Competition",
    detail: "1st place in both the Compulsory and Supplementary categories.",
  },
  {
    year: "2023",
    sortYear: 2023,
    kind: "certificate",
    title: "Royal Conservatory of Music",
    detail:
      "History and Theory Level 10 with Honours, and Level 10 Piano with First Class Honours.",
  },
  {
    year: "2023",
    sortYear: 2023,
    kind: "certificate",
    title: "Canada Open Mathematics Challenge",
    detail: "Performance with Distinction.",
  },
];

/** Newest first, for the timeline. */
export const timeline = [...achievements].sort((a, b) => b.sortYear - a.sortYear);
