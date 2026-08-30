import Link from "next/link";
import Reveal from "@/components/Reveal";

/** Ground colours alternate so the page reads as a sequence of strips. */
const grounds = {
  navy: "bg-[var(--navy)] text-[var(--cream)]",
  cream: "bg-[var(--cream)] text-[var(--ink)]",
  creamDeep: "bg-[var(--cream-deep)] text-[var(--ink)]",
} as const;

interface HomeSection {
  title: string;
  href: string;
  ground: (typeof grounds)[keyof typeof grounds];
  /** Cream grounds take the burgundy button; the navy ones take the cream. */
  button: string;
  /** Screenshots sit on white; photographs and charts fill their frame. */
  images: { src: string; alt: string; kind?: "screenshot" | "photo" }[];
}

/**
 * The home page is an index rather than a summary: each section names a page,
 * shows what the work looks like, and hands off. The writing lives on the
 * pages themselves.
 */
const sections: HomeSection[] = [
  {
    title: "Technology and Projects",
    href: "/tech",
    ground: grounds.navy,
    button: "btn btn-cream",
    images: [
      { src: "/bard1.png", alt: "Bare Metal Bard, the hand-written CUDA SGEMM." },
      {
        src: "/robotics-robot.jpg",
        alt: "The FTC robot, with its vision camera above the control hub.",
        kind: "photo",
      },
      {
        src: "/orgchem-stereoisomers.jpg",
        alt: "orgchem drawing both stereoisomers of a structure in three dimensions.",
      },
    ],
  },
  {
    title: "Social Impact and Community",
    href: "/social-impact",
    ground: grounds.cream,
    button: "btn btn-burgundy",
    images: [
      {
        src: "/yanlearn-analytics.png",
        alt: "YanLearn analytics: weekly signups, enrollments, hours taught, and donations over time.",
      },
      {
        src: "/sickkids-cheque.jpg",
        alt: "Presenting a cheque to the SickKids Foundation outside the Hospital for Sick Children.",
        kind: "photo",
      },
    ],
  },
  {
    title: "Research",
    href: "/research",
    ground: grounds.creamDeep,
    button: "btn btn-burgundy",
    images: [
      {
        src: "/research-at-a-glance.png",
        alt: "At a Glance: 84.38% RMSE improvement, 0.0763 m autoregressive RMSE, 15+1 NOAA stations, four years of verified records, a 30 m DEM, and 22 engineered features.",
        kind: "photo",
      },
      {
        src: "/research-regimes.png",
        alt: "Performance across all three regimes: the temporal-only LightGBM against the geospatial XGBoost on the validation split, at an unseen station one step ahead, and over a two-day autoregressive forecast.",
        kind: "photo",
      },
      {
        src: "/research-paper-page1.png",
        alt: "The first page of the paper as published in the Columbia Junior Science Journal, volume 11.",
        kind: "photo",
      },
    ],
  },
  {
    title: "Awards",
    href: "/awards",
    ground: grounds.navy,
    button: "btn btn-cream",
    images: [
      {
        src: "/robotics-awards.jpg",
        alt: "First place Inspire Award at the FIRST Tech Challenge provincial championship.",
        kind: "photo",
      },
      {
        src: "/robotics-provincials-match.jpg",
        alt: "Rams Robotics competing at the Ontario Provincial Championship.",
        kind: "photo",
      },
      {
        src: "/cora1.png",
        alt: "CORA, second place in Data Science at the Ignite CS Expo.",
      },
    ],
  },
];

export default function Home() {
  return (
    <div>
      {/* ---- Hero: copy left, portrait right ---- */}
      <section className="bg-[var(--cream)] px-6 pb-16 pt-12 md:px-10 md:pb-20 md:pt-16">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[minmax(0,50rem)_auto] lg:justify-start lg:gap-16">
          <div>
            <h1
              className="font-display rise text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.06] text-[var(--burgundy)]"
              style={{ animationDelay: "0.1s" }}
            >
              Ethan Yan Xu
            </h1>
            <p
              className="rise mt-6 max-w-xl text-[clamp(1.05rem,2.1vw,1.5rem)] font-light leading-snug text-[var(--ink)]"
              style={{ animationDelay: "0.22s" }}
            >
              A Toronto 11th grader writing CUDA kernels, shipping products, and
              teaching students for free.
            </p>
          </div>

          <div className="rise" style={{ animationDelay: "0.3s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portrait.jpg"
              alt="Ethan Yan Xu"
              /* The aspect is pinned square alongside the radius so the crop
                 stays a circle if the portrait is ever replaced by one that
                 is not already square. */
              className="aspect-square w-full max-w-[19rem] rounded-full border border-[var(--tan)]/35 object-cover lg:max-w-[21rem]"
            />
          </div>
        </div>
      </section>

      {/* ---- One strip per page: name, what it looks like, and the way in ---- */}
      {sections.map((section) => (
        <section
          key={section.href}
          className={`${section.ground} px-6 py-16 md:px-10 md:py-20`}
        >
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.2rem)]">
                {section.title}
              </h2>
            </Reveal>

            {/* Columns rather than a grid: each image keeps the proportions it
                was captured at, and the rows stagger instead of every picture
                being cropped to one height. */}
            <div
              className={`mt-10 gap-6 [column-fill:_balance] columns-1 sm:columns-2 ${
                section.images.length > 2 ? "lg:columns-3" : ""
              }`}
            >
              {section.images.map((image, i) => (
                <Reveal
                  key={image.src}
                  delay={0.08 + i * 0.08}
                  className="mb-6 block break-inside-avoid"
                >
                  <div
                    className={
                      image.kind === "photo"
                        ? "border border-[var(--tan)]/35"
                        : "border border-[var(--tan)]/35 bg-white p-1.5"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt={image.alt} className="w-full" />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.32}>
              <Link href={section.href} className={`${section.button} mt-11`}>
                Learn More
              </Link>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
