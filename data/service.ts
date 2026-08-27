export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceImage {
  src: string;
  alt: string;
  caption: string;
  /** Screenshots sit on white; photographs fill their frame. */
  kind: "screenshot" | "photo";
}

export interface CodeSample {
  /** Path within the YanLearn repo, printed as the panel header. */
  path: string;
  caption: string;
  code: string;
}

export interface ServiceStrand {
  title: string;
  /** Small label printed above the title. */
  eyebrow: string;
  description: string;
  stats: ServiceStat[];
  images?: ServiceImage[];
  code?: CodeSample[];
  href?: string;
  ctaLabel?: string;
  /** External links open in a new tab; internal project links do not. */
  external?: boolean;
}

export const serviceStrands: ServiceStrand[] = [
  {
    eyebrow: "Free Tutoring",
    title: "YanLearn",
    description:
      "A free online tutoring platform for students in grades 6–12, taught by a team of high school volunteers. It handles accounts and roles, course catalogues, enrollment, scheduling, volunteer hour tracking, and the admin tooling the team runs day to day — so the volunteers can spend their time teaching rather than coordinating. The figures below come from the platform's own impact page, which recomputes them hourly.",
    stats: [
      { value: "514", label: "Hours of free tutoring" },
      { value: "508", label: "Classes taught" },
      { value: "26", label: "Volunteer tutors" },
      { value: "126", label: "Students on the platform" },
    ],
    images: [
      {
        src: "/yanlearn4.png",
        alt: "YanLearn analytics dashboard headed Organization health, showing 152 verified users, 18 active courses, 519.7 hours taught, 418 total enrollments and $15,858 raised, above weekly signup and enrollment charts.",
        caption:
          "The analytics dashboard — org-health metrics for operations and grant reporting, with signups, enrollments, hours taught and donations tracked weekly.",
        kind: "screenshot",
      },
      {
        src: "/yanlearn5.png",
        alt: "YanLearn impact page showing 514 hours of free tutoring across 508 classes, 418 student enrollments, 59 courses run, 126 students on the platform, 26 volunteer tutors and $15,858 raised for charity.",
        caption:
          "The public impact page. Every figure is computed from platform data rather than maintained by hand.",
        kind: "screenshot",
      },
      {
        src: "/yanlearn3.png",
        alt: "YanLearn course catalogue listing courses including Python Advanced, Grade 11 IB Biology, Java Intermediate and Grade 11 Chemistry, each with a tutor name and current enrollment count.",
        caption:
          "The course catalogue, with live seat counts per class across subjects from robotics to IB Biology.",
        kind: "screenshot",
      },
      {
        src: "/yanlearn1.png",
        alt: "YanLearn home page describing the program, the team, and the Coding for SickKids campaign total.",
        caption:
          "The home page, as a signed-out visitor sees it.",
        kind: "screenshot",
      },
    ],
    code: [
      {
        path: "src/lib/impactStats.ts",
        caption:
          "The figures above are paginated out of Supabase, which silently caps every response at 1,000 rows no matter what limit you ask for.",
        code: `const PAGE_SIZE = 1000;

// Supabase caps responses at max_rows (default 1000) regardless of .limit().
// buildQuery must construct a FRESH query each call and include a stable
// .order() so pages don't shuffle between requests.
export async function fetchAllRows<T>(
  buildQuery: (
    from: number,
    to: number
  ) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await buildQuery(from, from + PAGE_SIZE - 1);
    if (error) {
      throw new Error(error.message);
    }
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) {
      return rows;
    }
  }
}`,
      },
      {
        path: "src/lib/discordLiveChannels.ts",
        caption:
          "A cron job opens a temporary voice channel for each live class and tears it down afterwards. Every rule here is biased towards never interrupting a lesson in progress.",
        code: `// A live class voice channel is only ever deleted once it is past its scheduled
// end AND has been provably empty — absolutely nobody in the call — for more
// than this long. Tearing one down mid-lesson interrupts real teaching, while
// leaving an empty one up costs nothing, so every check is biased towards
// keeping the channel.
export const liveChannelEmptyConfirmMs = 5 * 60 * 1000;

/**
 * The one exception to "nobody in the call": a channel whose tutor has been out
 * of it for longer than this is torn down even with students still sitting in
 * it. Past the scheduled end, a room the tutor left this long ago is not a
 * lesson any more — it is a hangout keeping a temporary channel alive
 * indefinitely, because students who never leave mean the emptiness clock above
 * never starts.
 */
export const liveChannelTutorAbsenceMs = 30 * 60 * 1000;`,
      },
    ],
    href: "https://learn.ethanyanxu.com/",
    ctaLabel: "Visit the Platform",
    external: true,
  },
  {
    eyebrow: "Fundraising",
    title: "Coding for SickKids",
    description:
      "A campaign run through the tutoring platform, turning lessons into donations. Every dollar goes directly to hospitals through the SickKids Foundation platform rather than passing through the project.",
    stats: [{ value: "$15,858", label: "Raised for SickKids" }],
    images: [
      {
        src: "/sickkids-cheque.jpg",
        alt: "Ethan Yan Xu holding an oversized SickKids VS cheque made out to the SickKids Foundation for $8,821, in front of the Hospital for Sick Children sign.",
        caption:
          "Presenting an $8,821 cheque to the SickKids Foundation outside the Hospital for Sick Children, May 2026.",
        kind: "photo",
      },
      {
        src: "/sickkids-team.jpg",
        alt: "Five members of the YanLearn team in branded black shirts standing in front of the Hospital for Sick Children.",
        caption: "The YanLearn team at the hospital on presentation day.",
        kind: "photo",
      },
      {
        src: "/sickkids-fundraiser.png",
        alt: "The Coding For SickKids fundraiser page on the SickKids Foundation site, showing $15,958 raised against a $20,000 goal.",
        caption:
          "The campaign page on the SickKids Foundation platform, where donations are taken directly.",
        kind: "screenshot",
      },
    ],
    href: "https://give.sickkidsfoundation.com/fundraisers/codingforsickkids/ethan--s-coding-class",
    ctaLabel: "Open the Fundraiser",
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
