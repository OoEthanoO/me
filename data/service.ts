export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceImage {
  src: string;
  alt: string;
  /** Omitted where the picture speaks for itself. */
  caption?: string;
  /** Screenshots sit on white; photographs fill their frame. */
  kind: "screenshot" | "photo";
}

export interface ServiceStrand {
  title: string;
  /** Small label printed above the title. Omitted by strands that lead with a
   *  wide section heading instead. */
  eyebrow?: string;
  description: string;
  /**
   * Printed in full on the Social Impact page, one paragraph per blank line.
   * Falls back to `description`, which the home page still uses.
   */
  overview?: string;
  stats: ServiceStat[];
  /**
   * Presence of this switches the strand to the wide layout: the title runs
   * across the entry as a section heading, these sit stacked to the left of
   * the write-up, and the call to action closes the right-hand column.
   */
  heroImages?: ServiceImage[];
  /** Which side those images sit on. Defaults to the left. */
  heroSide?: "left" | "right";
  /**
   * Shows the live fundraiser total beside the heading. The figure in `stats`
   * is the fallback for when the page cannot be read.
   */
  liveFundraiser?: boolean;
  /**
   * Splits the strand into named halves, each with its own figures. A group
   * marked `live` is refreshed from the Schoolhouse portfolio page, matched on
   * label, so those labels have to stay spelled as Schoolhouse spells them;
   * the values recorded here are the fallback.
   */
  groups?: {
    title: string;
    stats: ServiceStat[];
    live?: boolean;
    href?: string;
    ctaLabel?: string;
  }[];
  /**
   * Headline figures printed under the first group. One with `from` adds that
   * label across every group — so it has to match the label the groups use,
   * and where a group is live the live value is what gets added. One with
   * `value` prints it as given.
   */
  totals?: { label: string; from?: string; value?: string }[];
  /**
   * Figures printed between the write-up and the call to action, refreshed
   * from the YanLearn impact page and matched on label — so these labels
   * have to stay spelled the way the reader spells them. The values recorded
   * here are the fallback for when the page cannot be read.
   */
  liveFigures?: ServiceStat[];
  href?: string;
  ctaLabel?: string;
  /** External links open in a new tab; internal project links do not. */
  external?: boolean;
}

export const serviceStrands: ServiceStrand[] = [
  {
    title: "YanLearn",
    // Printed on the Social Impact page as supplied for the site.
    overview:
      "From Grade 9 (July 2023), I volunteered to teach beginner coding courses (I taught over 230 students). However, I quickly realized that with my ambitious goals, I simply could not do this alone. Thus, I founded a free tutoring organization, YanLearn, to serve this vision. I relentlessly reached out to and shared my idea with qualified tutors, many of whom were motivated to join. These figures may be impressive, but ultimately they are not the reasons why I am proud of YanLearn. I am proud because my goal evolved into our goal.",
    description:
      "A free online tutoring platform for students in grades 6–12, taught by a team of high school volunteers. It handles accounts and roles, course catalogues, enrollment, scheduling, volunteer hour tracking, and the admin tooling the team runs day to day — so the volunteers can spend their time teaching rather than coordinating.",
    // Still rendered on the home page; the Social Impact entry leads with the
    // screenshots instead.
    stats: [
      { value: "514", label: "Hours of free tutoring" },
      { value: "508", label: "Classes taught" },
      { value: "26", label: "Volunteer tutors" },
      { value: "126", label: "Students on the platform" },
    ],
    heroImages: [
      {
        src: "/yanlearn-courses.png",
        alt: "The YanLearn course catalogue: a grid of available courses from Python and Java to IB Biology, French and Grade 7 Math, each showing its tutor and current enrollment.",
        kind: "screenshot",
      },
    ],
    liveFigures: [
      { value: "27", label: "Volunteer Tutors" },
      { value: "61", label: "Courses" },
      { value: "579", label: "Hours Taught" },
      { value: "449", label: "Total Enrollments" },
    ],
    href: "https://learn.ethanyanxu.com/",
    ctaLabel: "Visit the Platform",
    external: true,
  },
  {
    eyebrow: "Fundraising",
    title: "Coding for SickKids",
    // Printed on the Social Impact page as supplied for the site.
    overview:
      "I created “Coding for SickKids” from February 2024, a fundraising campaign that runs alongside YanLearn, where student donations go directly to the SickKids Foundation.\n\nIn grade seven, I felt a sharp pain in my right abdomen on what was supposed to be an ordinary Monday night. Two hours later, I was wheeled down the long corridor to the operating room for acute appendicitis. The nurses helped wheel me out of the surgery room, comforted me afterwards, and even gave me ice cream and other treats. When I started teaching voluntarily in grade 8, I told my mom that I wanted to do something for the hospitals. This is how the Coding for SickKids fundraiser was born. Through this experience, I was helped by strangers even when my mom and I had nothing to offer them, and I have been trying to do the same ever since, just from the other side.",
    heroSide: "right",
    liveFundraiser: true,
    description:
      "A campaign run through the tutoring platform, turning lessons into donations. Every dollar goes directly to hospitals through the SickKids Foundation platform rather than passing through the project.",
    // Fallback for the live figure read off the fundraiser page, and the last
    // value seen there. Donations land on the SickKids Foundation platform;
    // YanLearn's own impact page mirrors it and can lag slightly.
    stats: [{ value: "$16,008", label: "Raised for SickKids" }],
    heroImages: [
      {
        src: "/sickkids-cheque.jpg",
        alt: "Ethan Yan Xu holding an oversized SickKids VS cheque made out to the SickKids Foundation for $8,821, in front of the Hospital for Sick Children sign.",
        caption:
          "Presenting an $8,821 cheque to the SickKids Foundation outside the Hospital for Sick Children, May 2026.",
        kind: "photo",
      },
      {
        src: "/sickkids-team.jpg",
        alt: "Five members of the YanLearn team in branded shirts, seen from behind, in front of the Hospital for Sick Children.",
        caption:
          "Part of the YanLearn team at the hospital on presentation day.",
        kind: "photo",
      },
    ],
    href: "https://give.sickkidsfoundation.com/fundraisers/codingforsickkids/ethan--s-coding-class",
    ctaLabel: "Open the Fundraiser",
    external: true,
  },
  {
    title: "St. Robert Coding Club",
    // As supplied for the site. No images yet, so the write-up runs full width.
    description:
      "Curriculum Coordinator in G9, created AI courses in G10, Co-President in G11. Throughout these years, I had always noticed members leaving the club each school year, and usually it was because the content became difficult too quickly. By May, we would only have roughly half of the members we had in September. Thus, I separated the club into the junior and senior streams to ensure every member could learn at their level. I also created stroj so that we could have our own online judging platform that allowed us to upload our problems for our members to do. I even introduced a rating system and biweekly rated contests so that members could compete against other members and executives could have an objective way of weighing members’ performance for executive applications.",
    stats: [],
  },
  {
    title: "Community Service",
    // Figures only, in two halves, with their hours added underneath.
    description: "",
    stats: [],
    external: true,
    totals: [{ value: "552", label: "Total volunteering hours" }],
    groups: [
      {
        title: "Waterloo Youth Accompanying Learning Community Group",
        stats: [
          { value: "197", label: "Tutoring Hours" },
          { value: "131", label: "Sessions Hosted" },
        ],
      },
      {
        title: "Schoolhouse",
        // Read live from the portfolio page; the values here are the last seen.
        live: true,
        stats: [
          { value: "214", label: "Tutoring Hours" },
          { value: "186", label: "Sessions Hosted" },
          { value: "150", label: "Learners Impacted" },
          { value: "14", label: "Countries Reached" },
          { value: "1021", label: "Positive Ratings" },
          { value: "561", label: "Super Helpful" },
        ],
        href: "https://schoolhouse.world/portfolio/419d56dd-a211-4ca0-98e8-429f51fc4c76",
        ctaLabel: "Open the Portfolio",
      },
    ],
  },
];
