export interface Achievement {
  /** Calendar year, and the column the entry is filed under. */
  year: string;
  /**
   * 1–12, where the month is on record. Entries without one sort to the bottom
   * of their year and print the year alone.
   */
  month?: number;
  title: string;
  detail?: string;
  kind: "award" | "certificate";
  href?: string;
}

/** Scholastic excellence awards and certificates, newest first. */
export const achievements: Achievement[] = [
  {
    year: "2026",
    month: 6,
    kind: "award",
    title: "The York Catholic District School Board Recognizes",
  },
  {
    year: "2026",
    month: 5,
    kind: "award",
    title: "Avogadro Chemistry Contest",
    detail:
      "29th in Canada, out of 3045 participants. 158th in the world, out of 4252 participants.",
  },
  {
    year: "2026",
    month: 4,
    kind: "award",
    title: "York Region Sci-Tech Fair",
    detail:
      "Silver Medal, and first place for the Canadian Meteorological and Oceanographic Society (CMOS) Award.",
    href: "https://cora.ethanyanxu.com/",
  },
  {
    year: "2026",
    month: 4,
    kind: "award",
    title: "Columbia Junior Science Journal 2025–2026 volume",
    detail:
      "Published for “A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features.”",
    href: "https://columbiajuniorsciencejournal.org/20252026-cjsj",
  },
  {
    year: "2026",
    month: 2,
    kind: "award",
    title: "USA Computing Olympiad (USACO)",
    detail: "Gold Division competitor.",
  },
  {
    year: "2026",
    month: 2,
    kind: "award",
    title: "Canadian Computing Competition",
    detail: "Senior, Honour Roll.",
  },
  {
    year: "2026",
    month: 1,
    kind: "award",
    title: "Columbia Junior Science Journal",
    detail:
      "Selected as a finalist for the CJSJ 2025–2026 volume application cycle.",
  },
  {
    year: "2025",
    month: 9,
    kind: "award",
    title: "Ignite CS Expo — Senior Division",
    detail:
      "2nd place in Data Science, for CORA, which models environmental impact and community flood risk from real-world geospatial data.",
    href: "https://cora.ethanyanxu.com/",
  },
  {
    year: "2025",
    month: 9,
    kind: "award",
    title: "Hack the North 2025",
    detail:
      "Accepted to attend Hack the North 2025, Canada’s premier hackathon at the University of Waterloo.",
  },
  {
    year: "2025",
    month: 5,
    kind: "award",
    title: "American Computer Science League",
    detail: "Senior Finals, Bronze Medalist.",
  },
  {
    year: "2024",
    month: 9,
    kind: "award",
    title: "Hack the North 2024",
    detail:
      "Accepted to attend Hack the North 2024, Canada’s premier hackathon at the University of Waterloo.",
  },
  {
    year: "2024",
    month: 2,
    kind: "award",
    title: "Canadian Computing Competition — Senior",
    detail: "Honour Roll.",
  },
  {
    year: "2023",
    kind: "award",
    title: "Canadian Computing Competition — Junior",
    detail: "Honour Roll.",
  },
  {
    year: "2023",
    kind: "certificate",
    title: "Royal Canadian Air Cadet Band & Drill Competition",
    detail: "1st place in both the Compulsory and Supplementary categories.",
  },
  {
    year: "2023",
    kind: "certificate",
    title: "Royal Conservatory of Music",
    detail:
      "History and Theory Level 10 with Honours, and Level 10 Piano with First Class Honours.",
  },
  {
    year: "2023",
    kind: "certificate",
    title: "Canada Open Mathematics Challenge",
    detail: "Performance with Distinction.",
  },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Newest first: by year, then by month where one is recorded. */
const sortKey = (a: Achievement) => Number(a.year) + (a.month ?? 0) / 12;

export const timeline = [...achievements].sort((a, b) => sortKey(b) - sortKey(a));
