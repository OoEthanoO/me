export interface Collaborator {
  name: string;
  github: string;
}

export interface Project {
  title: string;
  /** Short blurb shown on the project card. Keep it to a sentence or two. */
  description: string;
  /** Full write-up shown on the project's own page. Falls back to `description`. */
  longDescription?: string;
  technologies: string[];
  collaborators: Collaborator[];
  github?: string;
  website?: string;
  images: string[];
}

export const projects: Project[] = [
  {
    title: "YanLearn",
    description:
      "A free online tutoring platform for students in grades 6-12, taught by a team of high school volunteers.",
    longDescription:
      "A free online tutoring platform for students in grades 6-12, taught by a team of high school volunteers. The site handles everything around the teaching itself: accounts and roles, course catalogues, enrollment, class scheduling, volunteer hour tracking, and the admin tooling the team runs day to day.\n\nThe automation is the interesting half. A sync service treats the Discord server as derived state, continuously reconciling membership, roles, channels, and nicknames against the site's data, so a student who enrolls simply finds the right channels waiting for them. A scheduled job handles the rest: it sends email and Discord reminders, opens a temporary voice channel for each live class (tutors let in fifteen minutes early, students five), records attendance from voice state, and flags tutors or students who never show. An analytics dashboard tracks signups, enrollments, hours taught, and donations over time.\n\nIt runs on Next.js and Supabase, with every table locked behind row-level security and reached only through server-side routes. To date the platform has delivered more than 500 hours of free tutoring across 500+ classes, with 26 volunteer tutors teaching over 120 students, and the \"Coding for SickKids\" campaign has raised over $15,000 — donated directly to hospitals through the SickKids Foundation platform.",
    technologies: [
      "Next.js 16",
      "React 19",
      "Supabase",
      "Tailwind CSS 4",
      "TypeScript",
      "Discord API",
      "Zoom API",
      "Recharts",
    ],
    collaborators: [{ name: "Solo", github: "https://github.com/OoEthanoO" }],
    github: "https://github.com/OoEthanoO/tutoring",
    website: "https://learn.ethanyanxu.com/",
    images: [
      "/yanlearn1.png",
      "/yanlearn2.png",
      "/yanlearn3.png",
      "/yanlearn4.png",
      "/yanlearn5.png",
    ],
  },
  {
    title: "YanPlanner",
    description:
      "An AI study planner that turns assignments, exams, and projects into day-by-day plans with automatically generated subtasks.",
    longDescription:
      "YanPlanner takes the things students actually get handed — an assignment, an exam date, a long-term project — and turns them into a plan they can follow day by day. You add a task with a due date and any relevant materials, and the AI splits it into smaller subtasks that inherit context from the title, description, and attachments. Subtasks can be split again, nesting beneath their parent so the whole plan stays visible at a glance, and a work-days picker keeps the schedule on the days you actually intend to study.\n\nAttachments are parsed from PDFs and images and passed to a multimodal model, with the files themselves kept in Cloudflare R2 to sidestep serverless payload limits. The frontend is React and Vite on Vercel; the API is an Express server backed by Prisma and Postgres. It carries the full account layer too — registration with email verification, a credit-based billing system with Stripe checkout and webhooks, and an admin panel for usage summaries.",
    technologies: [
      "React 18",
      "TypeScript",
      "Vite",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Stripe",
      "Cloudflare R2",
      "OpenRouter",
    ],
    collaborators: [{ name: "Solo", github: "https://github.com/OoEthanoO" }],
    github: "https://github.com/OoEthanoO/project",
    website: "https://planner.ethanyanxu.com/",
    images: [
      "/yanplanner1.png",
      "/yanplanner2.png",
      "/yanplanner3.png",
      "/yanplanner4.png",
    ],
  },
  {
    title: "Stroj",
    description:
      "A self-hosted online judge. Users submit code against a problem's test data; it compiles, runs it under time and memory limits, and returns a verdict.",
    longDescription:
      "Stroj is a competitive programming judge, the kind of site a class or a team practises on. A submission arrives against a problem's test data, and the judge compiles it, runs it test by test under time, memory and output limits, compares what came out against the answer, and returns one of the usual verdicts. Problems can be all-or-nothing or partially scored, and tests can be grouped into weighted subtasks so a beginner who only solves the small cases still earns something rather than nothing. Contests sit on top: a timed window, a problem set sealed until the clock starts, and either an ICPC or an IOI scoreboard.\n\nThe sandbox is the half worth reading. Each submission runs in a throwaway directory as its own process group under CPU, address-space and file-size rlimits, with a wall-clock watchdog that kills the whole group so a submission cannot outlive its timeout by forking, and an active RSS sampler that enforces the memory ceiling — necessary because macOS accepts RLIMIT_AS and then quietly ignores it. Network and filesystem writes are denied through sandbox-exec on macOS and a network namespace on Linux, where privilege separation and a read-only container rootfs carry the rest. It is deliberately honest about the gap: doctor and the site footer both report the isolation actually in force rather than the one you asked for.\n\nThe stack is small on purpose — Python and FastAPI over SQLite in WAL mode, with judge workers as plain threads that atomically claim one pending submission at a time, and a dependency-free vanilla JS frontend with no build step. Because judging needs fork, real compilers, a persistent volume and minutes of wall time, none of which serverless offers, the deployment splits: the static frontend on Vercel proxying /api back to a container host running the judge. Problem authoring is a zip and a JSON manifest, and an express mode creates the problem hidden, runs the intended solutions, and reports what they actually measured so limits get set from real numbers. 138 tests spawn real compilers and assert on real TLE, MLE and CE outcomes.",
    technologies: [
      "Python 3",
      "FastAPI",
      "SQLite",
      "Vanilla JS",
      "Docker",
      "Vercel",
      "pytest",
    ],
    collaborators: [
      { name: "Penguin60", github: "https://github.com/Penguin60" },
    ],
    github: "https://github.com/OoEthanoO/stroj-v2",
    website: "https://stroj.ethanyanxu.com/",
    images: [
      "/stroj1.png",
      "/stroj2.png",
      "/stroj3.png",
      "/stroj4.png",
      "/stroj5.png",
    ],
  },
  {
    title: "Farkle",
    description:
      "A two-player Farkle dice game that runs in a terminal window, with local hot-seat play and LAN multiplayer.",
    longDescription:
      "Farkle is a push-your-luck dice game: you throw six dice, set aside the ones that score, and choose between banking what you have or throwing the rest again. Roll nothing that scores and the whole turn is wiped. This is a two-player version that runs in a terminal window. The scoring engine handles single ones and fives, three or more of a kind with the score doubling for each extra die, and the 1-5, 2-6 and full 1-6 straights — and it refuses a selection outright unless every die in it belongs to a scoring pattern, so you cannot smuggle a dead die into a good throw.\n\nThere is no game framework underneath it. The interface is a small component and layout system written for the project and drawn through Lanterna: positions and sizes are fractions of the parent rather than fixed cells, so the board reflows when the window is resized, and screens are pushed and popped as a stack. Multiplayer runs over plain TCP sockets with JSON packets, and the host is authoritative — the client sends actions like move cursor, toggle a die, roll again, or end turn, and the host applies the rules and broadcasts the entire game state back, so the two boards cannot drift apart. Native macOS full screen is wired up and remembered between launches.",
    technologies: [
      "Kotlin",
      "Lanterna",
      "Ktor",
      "kotlinx.serialization",
      "Coroutines",
      "Gradle",
    ],
    collaborators: [
      { name: "aqariio", github: "https://github.com/aqariio" },
    ],
    github: "https://github.com/aqariio/farkle",
    images: [
      "/farkle1.png",
      "/farkle2.png",
      "/farkle3.png",
      "/farkle4.png",
    ],
  },
];
