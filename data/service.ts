export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceStrand {
  title: string;
  /** Small label printed above the title. */
  eyebrow: string;
  description: string;
  stats: ServiceStat[];
  href?: string;
  /** External links open in a new tab; internal project links do not. */
  external?: boolean;
}

export const serviceStrands: ServiceStrand[] = [
  {
    eyebrow: "Free Tutoring",
    title: "YanLearn",
    description:
      "A free online tutoring platform for students in grades 6–12, taught by a team of high school volunteers. It handles accounts and roles, course catalogues, enrollment, scheduling, volunteer hour tracking, and the admin tooling the team runs day to day — so the volunteers can spend their time teaching rather than coordinating.",
    stats: [
      { value: "500+", label: "Hours taught, free" },
      { value: "500+", label: "Classes delivered" },
      { value: "26", label: "Volunteer tutors" },
      { value: "120+", label: "Students reached" },
    ],
    href: "https://learn.ethanyanxu.com/",
    external: true,
  },
  {
    eyebrow: "Fundraising",
    title: "Coding for SickKids",
    description:
      "A campaign run through the tutoring platform, turning lessons into donations. Every dollar goes directly to hospitals through the SickKids Foundation platform rather than passing through the project.",
    stats: [{ value: "$15,000+", label: "Raised for SickKids" }],
    href: "https://learn.ethanyanxu.com/",
    external: true,
  },
  {
    eyebrow: "Community Service",
    title: "Volunteering",
    description:
      "Hours logged and submitted outside the platform, across school and community programs.",
    stats: [{ value: "331", label: "Submitted volunteering hours" }],
  },
];
