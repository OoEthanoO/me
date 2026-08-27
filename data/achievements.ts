export interface Achievement {
  name: string;
  result: string;
  /** Competition and exam results sit on /awards; service figures on /social-impact. */
  category: "award" | "service";
  /** Optional context line printed under the result. */
  note?: string;
}

export const achievements: Achievement[] = [
  { name: "CCC Junior", result: "75/75", category: "award", note: "2023 — perfect score" },
  { name: "CCC Senior", result: "45/75", category: "award", note: "2024" },
  { name: "USACO", result: "Silver", category: "award", note: "Division" },
  { name: "AP Computer Science A", result: "5", category: "award", note: "Top score" },
  { name: "ACSL Senior", result: "Bronze", category: "award", note: "2025" },
  { name: "Submitted Volunteering Hours", result: "331 Hours", category: "service" },
  { name: "SickKids Money Raised", result: "$3480", category: "service" },
];

export const awards = achievements.filter((a) => a.category === "award");
