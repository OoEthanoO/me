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
  /** Flagship work. Renders as a full-width, accented card at the top of the grid. */
  featured?: boolean;
  /** Groups the project under a named section on /tech. Ungrouped work falls
   *  through to the Selected Work list. */
  category?: string;
  /** Prose printed in full on the wide category entry. Falls back to
   *  `description`. Blank lines separate paragraphs. */
  overview?: string;
}

/** Order the grouped sections appear in on /tech. */
export const categoryOrder = ["Environment"];

export const projects: Project[] = [
  {
    title: "CORA",
    category: "Environment",
    description:
      "A tool that uses datasets and graph-based algorithms to simulate sea level rise floods, predict economic damage, and test adaptation strategies.",
    // Printed in full on /tech, as supplied for the site.
    overview:
      "With my experience accumulated, I was working on a more ambitious project, Coastal Risk Analyzer (CORA). My hometown in China is very close to the coast. After learning more about global warming and its impact on coastal communities, I wanted to create something that allowed us to see the destructive consequences of sea level rise. My most notable data science project, CORA, is a tool that uses datasets and graph-based algorithms to simulate sea level rise floods, predict economic damage, and test adaptation strategies.",
    longDescription:
      "With my experience accumulated, I was working on a more ambitious project, Coastal Risk Analyzer (CORA). My hometown in China is very close to the coast. After learning more about global warming and its impact on coastal communities, I wanted to create something that allowed us to see the destructive consequences of sea level rise. My most notable data science project, CORA is a tool that uses datasets and graph-based algorithms to simulate sea level rise floods, predict economic damage, and test adaptation strategies.\n\nThe application loads Copernicus elevation data for any stretch of coastline, pulls the buildings and roads underneath it from OpenStreetMap, and anchors the model to the nearest NOAA tidal gauge so the baseline reflects measured local sea level rather than a generic elevation. Inundation is propagated from the sea as connected flood rather than filling every low-lying pixel independently, which is the difference between a map of what is low and a map of what actually floods.\n\nWhat comes out is not just an outline. Each run reports flooded buildings, kilometres of road lost, critical infrastructure hit — hospitals, schools, fire stations, tagged automatically from OpenStreetMap — economic damage from depth-damage functions, and population exposure drawn from WorldPop demographic rasters.\n\nAdaptation is the part that makes it a planning tool rather than a picture. Sea walls can be drawn straight onto the coast at a configurable height, and wetland restoration areas outlined to model the flood reduction they buy, so the same scenario can be re-run to see what a given intervention is actually worth. Any run exports to a PDF report carrying the parameters, the impact summary, the methodology and the inundation map.",
    technologies: [
      "Python",
      "PyQt6",
      "rasterio",
      "GeoPandas",
      "OSMnx",
      "Shapely",
      "NumPy",
      "Matplotlib",
      "ReportLab",
    ],
    collaborators: [{ name: "Solo", github: "https://github.com/OoEthanoO" }],
    github: "https://github.com/OoEthanoO/cora_project",
    website: "https://cora.ethanyanxu.com/",
    images: ["/cora5.png", "/cora3.png", "/cora1.png"],
  },
  {
    title: "Bare Metal Bard",
    description:
      "A CUDA SGEMM written from scratch, taken from 1.2% of cuBLAS to 117% with tensor cores, then used to train a GPT — no PyTorch, cuBLAS or cuDNN anywhere in the training path.",
    longDescription:
      "Nine matmul kernels, each one the same idea applied a level further down the memory hierarchy: load a value once, then spend it on as much arithmetic as possible before letting it go. The first is the textbook one thread per output element, at 82.8 GFLOP/s — 1.2% of cuBLAS. The last reaches 8298.9, a hundredfold gain, on an RTX 4070 Laptop with 36 SMs and a 55 W budget. Along the way the fp32 kernel closes to 95% of cuBLAS through coalescing, shared-memory tiling, register tiling, float4 loads, warp-level blocking and double buffering, and the tensor-core kernel passes it at 117%. That last number is quoted with its caveat rather than on its own: cuBLAS has its own TF32 path, it is 21% faster still, and TF32 buys the speed with 4000x more numerical error.\n\nThose kernels then train a 10.8M-parameter GPT on TinyShakespeare, character level, with every matmul, layernorm, softmax, attention, GELU, cross-entropy and AdamW kernel written from scratch. The backward pass is gradient-checked against finite differences along the gradient direction, which puts the signal three orders of magnitude above fp32 noise — sensitive enough that deliberately dropping one term from layernorm's backward fails 14 of the 16 parameter tensors instead of quietly training slightly worse.\n\nThe attention is a fused FlashAttention-style kernel that never materializes the score matrix at all, keeping each score tile in registers and carrying a running max and sum forward instead. It is 3.4x faster on the forward pass and cuts activation memory by 30%, but the memory is the part that changes what the card can do: the unfused footprint grows quadratically with context length and the fused one grows linearly, so an 8 GB card that topped out at 1024 tokens now trains at 2048.\n\nThe work that took longest to find is in the measurements. A compiler upgrade cost the tensor-core kernel 19% of its throughput by spending 14 extra registers to remove a 12-byte spill, crossing an occupancy cliff — a regression that passed every correctness test, every gradient check and every loss curve without a murmur, and that only surfaced because a version number in a document looked wrong. A from-scratch ring all-reduce on two A40s found peer-to-peer copies that returned success and silently delivered nothing, and then found that communication was 6% of a step while the single host loop driving both devices was the actual bottleneck — the opposite of the lesson everyone quotes.",
    technologies: [
      "CUDA",
      "C++",
      "Tensor Cores (WMMA)",
      "Nsight Compute",
      "Next.js",
    ],
    collaborators: [{ name: "Solo", github: "https://github.com/OoEthanoO" }],
    github: "https://github.com/OoEthanoO/bare-metal-bard",
    website: "https://sgemm.ethanyanxu.com/",
    images: [
      "/bard1.png",
      "/bard2.png",
      "/bard3.png",
      "/bard4.png",
    ],
    featured: true,
  },
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
  {
    title: "YanFarkle",
    description:
      "A Farkle dice game for iPhone, iPad, and Mac, on the App Store — with a bot, pass-and-play, LAN matches, and Game Center multiplayer.",
    longDescription:
      "YanFarkle is a native version of the push-your-luck dice game: throw six dice, set aside the ones that score, then choose between banking the turn or throwing the rest again and risking everything you have built up. It ships on the App Store as a universal app for iPhone, iPad and Mac, and plays four ways — against a bot, pass-and-play on a single device, across two devices on the same network, or online through Game Center matchmaking and invites.\n\nThe two online paths sit behind one game. Local matches run over Network.framework: the host opens a TCP listener and the other device joins either by typing the address or by scanning a QR code that encodes a yanfarkle:// link, which saves anyone from reading an IP out loud. Online matches run over GameKit. Either way the host is authoritative — the client sends actions and the host applies the rules and broadcasts the resulting state — and in-game chat with quick emotes rides the same channel.\n\nThe bot plays a real strategy rather than a random one: it banks immediately when the turn would win, always re-rolls on hot dice, and otherwise stops once the turn clears 300 points or only two dice are left. The dice are vector art with spring animations, WASD and single-key shortcuts drive the board on Mac and iPad, and nothing leaves the device — no accounts, no analytics, no third-party services.",
    technologies: [
      "Swift",
      "SwiftUI",
      "Combine",
      "Network.framework",
      "GameKit",
      "AVFoundation",
    ],
    collaborators: [{ name: "Solo", github: "https://github.com/OoEthanoO" }],
    github: "https://github.com/OoEthanoO/YanFarkle",
    website: "https://apps.apple.com/ca/app/yanfarkle/id6761668136",
    images: [
      "/yanfarkle1.png",
      "/yanfarkle2.png",
      "/yanfarkle3.png",
      "/yanfarkle4.png",
    ],
  },
  {
    title: "Portfolio",
    description:
      "This site — a Next.js portfolio where every project, achievement and piece of gear is a typed object rather than a CMS entry.",
    longDescription:
      "The site you are reading. It is a Next.js App Router project on React 19 and Tailwind, deployed on Vercel, and it has no CMS and no database behind it — every project, achievement and piece of gear is an object in a typed data module, so adding a project means adding an object literal and the pages that map over it pick it up. Each project gets its own page from a single dynamic route, with the write-up split into paragraphs, technologies and collaborators rendered as tags, and links out to the source and the live thing.\n\nThe screenshot gallery does the one piece of real work. Screenshots arrive in whatever shape their platform produces — browser windows, a terminal window, phone screens — so each image is measured as it loads and classified by aspect ratio: landscape shots take the full width one per row, and portrait shots fall into a multi-column grid instead, with any of them opening full-size in a modal. Because a cached image can finish loading before React attaches its handler, that measurement also runs from a ref callback, which is the difference between the layout working on a first visit and working on every visit.\n\nEverything moves through CSS keyframes rather than an animation library. Cards scale in on the home grid, the detail panel slides in and its content follows, and the tag rows stagger by index through a custom property, so a project with nine technologies staggers as cleanly as one with three. A project can also be marked as flagship, which gives it a full-width accented card at the top of the grid rather than a slot in the same three-column rhythm as everything else.",
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Vercel",
    ],
    collaborators: [{ name: "Solo", github: "https://github.com/OoEthanoO" }],
    github: "https://github.com/OoEthanoO/me",
    website: "https://www.ethanyanxu.com/",
    images: [
      "/portfolio1.png",
      "/portfolio2.png",
      "/portfolio3.png",
      "/portfolio4.png",
    ],
  },
];
