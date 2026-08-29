export interface Achievement {
  /** Label printed at the timeline marker. */
  year: string;
  /**
   * Ordering key, newest first. Where the month is known it is carried as
   * `year + month / 12`, so entries sit in date order inside their column;
   * the awards page floors this back to the calendar year to group them.
   * Entries with no recorded month use the bare year and fall to the bottom
   * of their column.
   */
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
    sortYear: 2026 + 6 / 12,
    kind: "award",
    title: "The York Catholic District School Board Recognizes",
  },
  {
    year: "2026",
    sortYear: 2026 + 5 / 12,
    kind: "award",
    title: "Avogadro Chemistry Contest",
    detail:
      "29th in Canada, out of 3045 participants. 158th in the world, out of 4252 participants.",
  },
  {
    year: "2026",
    sortYear: 2026 + 4 / 12,
    kind: "award",
    title: "York Region Sci-Tech Fair",
    detail:
      "Silver Medal, and first place for the Canadian Meteorological and Oceanographic Society (CMOS) Award.",
    href: "https://cora.ethanyanxu.com/",
  },
  {
    year: "2026",
    sortYear: 2026 + 4 / 12,
    kind: "award",
    title: "Columbia Junior Science Journal 2025–2026 volume",
    detail:
      "Published for “A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features.”",
    href: "https://columbiajuniorsciencejournal.org/20252026-cjsj",
  },
  {
    year: "2026",
    sortYear: 2026 + 2 / 12,
    kind: "award",
    title: "USA Computing Olympiad (USACO)",
    detail: "Gold Division competitor.",
  },
  {
    year: "2026",
    sortYear: 2026 + 2 / 12,
    kind: "award",
    title: "Canadian Computing Competition",
    detail: "Senior, Honour Roll.",
  },
  {
    year: "2026",
    sortYear: 2026 + 1 / 12,
    kind: "award",
    title: "Columbia Junior Science Journal",
    detail:
      "Selected as a finalist for the CJSJ 2025–2026 volume application cycle.",
  },
  {
    year: "2025",
    sortYear: 2025 + 9 / 12,
    kind: "award",
    title: "Ignite CS Expo — Senior Division",
    detail:
      "2nd place in Data Science, for CORA, which models environmental impact and community flood risk from real-world geospatial data.",
    href: "https://cora.ethanyanxu.com/",
  },
  {
    year: "2025",
    sortYear: 2025 + 9 / 12,
    kind: "award",
    title: "Hack the North 2025",
    detail:
      "Accepted to attend Hack the North 2025, Canada’s premier hackathon at the University of Waterloo.",
  },
  {
    year: "2025",
    sortYear: 2025 + 5 / 12,
    kind: "award",
    title: "American Computer Science League",
    detail: "Senior Finals, Bronze Medalist.",
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
    year: "2024",
    sortYear: 2024 + 9 / 12,
    kind: "award",
    title: "Hack the North 2024",
    detail:
      "Accepted to attend Hack the North 2024, Canada’s premier hackathon at the University of Waterloo.",
  },
  {
    year: "2024",
    sortYear: 2024 + 2 / 12,
    kind: "award",
    title: "Canadian Computing Competition — Senior",
    detail: "Honour Roll.",
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
