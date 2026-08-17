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
      "YanPlanner takes the things students actually get handed — an assignment, an exam date, a long-term project — and turns them into a plan they can follow day by day. You add a task with a due date and any relevant materials, and the AI splits it into smaller subtasks that inherit context from the title, description, and attachments. Subtasks can be split again, nesting beneath their parent so the whole plan stays visible at a glance, and a work-days picker keeps the schedule on the days you actually intend to study.\n\nAlongside the tree is a context-aware chat. You can talk to the planner to reshape scope, move due dates, or ask for pacing advice, and that conversation feeds back in as context the next time it splits a task, so the plan and the reasoning behind it stay in sync. Attachments are parsed from PDF and Word documents and passed to a multimodal model, with the files themselves kept in Cloudflare R2 to sidestep serverless payload limits.\n\nThe frontend is React and Vite on Vercel; the API is an Express server backed by Prisma and Postgres. It carries the full account layer too — registration with email verification, a credit-based billing system with Stripe checkout and webhooks, and an admin panel for usage summaries.",
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
    images: [],
  },
];
