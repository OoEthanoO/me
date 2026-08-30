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
  /** Omitted by sections that are the whole story, with no page behind them. */
  href?: string;
  ground: (typeof grounds)[keyof typeof grounds];
  /** Cream grounds take the burgundy button; the navy ones take the cream. */
  button?: string;
  /**
   * Screenshots sit on white; photographs and charts fill their frame.
   * `width` and `drop` place the picture in the scatter: a share of the row,
   * and how far down the row it starts. Both apply from lg up — below that
   * every picture runs full width and the offsets collapse.
   */
  images: {
    src: string;
    alt: string;
    kind?: "screenshot" | "photo";
    width?: string;
    drop?: string;
    /** Set for a clip: `src` is then the poster the frame shows first. */
    video?: string;
  }[];
  /**
   * A document embedded in full, scrollable in place. The browser's own PDF
   * viewer does the scrolling, so the link beneath it is not decoration: iOS
   * Safari renders only the first page inside a frame and will not scroll it.
   */
  document?: { src: string; title: string; label: string };
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
      {
        src: "/bard1.png",
        alt: "Bare Metal Bard, the hand-written CUDA SGEMM.",
        width: "38%",
        drop: "0rem",
      },
      {
        src: "/orgchem-stereoisomers.jpg",
        alt: "orgchem drawing both stereoisomers of a structure in three dimensions.",
        width: "31%",
        drop: "3.5rem",
      },
      {
        src: "/robotics-robot.jpg",
        alt: "The FTC robot, with its vision camera above the control hub.",
        kind: "photo",
        width: "25%",
        drop: "1.25rem",
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
    document: {
      src: "/schoolhouse-portfolio.pdf",
      title: "Schoolhouse certification portfolio for Yan Xu",
      label: "Open the portfolio as a PDF",
    },
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
        width: "38%",
        drop: "2rem",
      },
      {
        src: "/research-regimes.png",
        alt: "Performance across all three regimes: the temporal-only LightGBM against the geospatial XGBoost on the validation split, at an unseen station one step ahead, and over a two-day autoregressive forecast.",
        kind: "photo",
        width: "34%",
        drop: "0rem",
      },
      {
        src: "/research-paper-page1.png",
        alt: "The first page of the paper as published in the Columbia Junior Science Journal, volume 11.",
        kind: "photo",
        width: "22%",
        drop: "4.5rem",
      },
    ],
  },
  {
    // No page behind this one, so it carries the whole subject itself: the
    // stills and the clips together, and no button out.
    title: "Hobbies",
    ground: grounds.navy,
    images: [
      {
        src: "/hobby-conducting.jpg",
        alt: "Conducting the Junior Concert Band at the Christmas concert.",
        kind: "photo",
        width: "38%",
        drop: "0rem",
      },
      {
        src: "/hobby-golf-swing-poster.jpg",
        video: "/hobby-golf-swing.mp4",
        alt: "Teeing off over water on a summer afternoon.",
        kind: "photo",
        width: "36%",
        drop: "3rem",
      },
      {
        src: "/hobby-badminton-poster.jpg",
        video: "/hobby-badminton.mp4",
        alt: "A badminton drill, the court scattered with shuttles.",
        kind: "photo",
        width: "20%",
        drop: "1rem",
      },
      {
        src: "/hobby-cadet-band.jpg",
        alt: "The Royal Canadian Air Cadet band in uniform, playing in formation.",
        kind: "photo",
        width: "27%",
        drop: "0rem",
      },
      {
        src: "/hobby-cadet-band-poster.jpg",
        video: "/hobby-cadet-band.mp4",
        alt: "The cadet band performing, with the drum major out front.",
        kind: "photo",
        width: "30%",
        drop: "2.5rem",
      },
      {
        src: "/hobby-badminton.jpg",
        alt: "Playing badminton at the club, mid-stroke.",
        kind: "photo",
        width: "18%",
        drop: "0.5rem",
      },
      {
        src: "/hobby-golf.jpg",
        alt: "Carrying a bag out to the range.",
        kind: "photo",
        width: "18%",
        drop: "3.5rem",
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
              className="font-display rise text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.06] text-[var(--accent)]"
              style={{ animationDelay: "0.1s" }}
            >
              Ethan Yan Xu
            </h1>
            <p
              className="rise mt-6 max-w-xl text-[clamp(1.05rem,2.1vw,1.5rem)] font-light leading-snug text-[var(--ink)]"
              style={{ animationDelay: "0.22s" }}
            >
              A technologist who is obsessed with programming, focuses on the
              development of environment-based software tools, and is
              passionate about spreading programming education.
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
              className="aspect-square w-full max-w-[13rem] rounded-full border border-[var(--tan)]/35 object-cover lg:max-w-[14.5rem]"
            />
          </div>
        </div>
      </section>

      {/* ---- One strip per page: name, what it looks like, and the way in ---- */}
      {sections.map((section) => (
        <section
          key={section.title}
          className={`${section.ground} px-6 py-16 md:px-10 md:py-20`}
        >
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.2rem)]">
                {section.title}
              </h2>
            </Reveal>

            {(() => {
              const pictures = section.images.map((image, i) => (
                <div
                  key={image.src}
                  // The share of the row and the drop down it are per picture,
                  // and only bind from lg; below that each runs full width.
                  style={
                    {
                      "--pic-w": image.width ?? "100%",
                      "--pic-drop": image.drop ?? "0rem",
                    } as React.CSSProperties
                  }
                  className="w-full lg:mt-[var(--pic-drop)] lg:w-[var(--pic-w)]"
                >
                  <Reveal delay={0.08 + i * 0.08}>
                    <div
                      className={
                        image.kind === "photo"
                          ? "border border-[var(--tan)]/35"
                          : "border border-[var(--tan)]/35 bg-white p-1.5"
                      }
                    >
                      {image.video ? (
                        /* eslint-disable-next-line jsx-a11y/media-has-caption */
                        <video
                          src={image.video}
                          poster={image.src}
                          controls
                          playsInline
                          preload="none"
                          aria-label={image.alt}
                          className="block w-full"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="block w-full"
                        />
                      )}
                    </div>
                  </Reveal>
                </div>
              ));

              if (!section.document) {
                // Scattered rather than gridded: the pictures keep the
                // proportions they were captured at, take different shares of
                // the row, and start at different heights down it, so the band
                // fills without every picture lining up.
                return (
                  <div className="mt-10 flex flex-wrap items-start justify-between gap-x-6 gap-y-8">
                    {pictures}
                  </div>
                );
              }

              // With a document to show, the pictures stack down a narrower
              // column and the document takes the width that frees up.
              return (
                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-8">
                  <div className="space-y-6 [&>div]:!w-full [&>div]:!mt-0">
                    {pictures}
                  </div>

                  <Reveal delay={0.3}>
                    <figure>
                      <div className="border border-[var(--tan)]/35 bg-white">
                        <iframe
                          src={`${section.document.src}#view=FitH`}
                          title={section.document.title}
                          className="block h-[min(85vh,900px)] min-h-[32rem] w-full"
                        />
                      </div>
                      <figcaption className="mt-3">
                        <a
                          href={section.document.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--accent)] transition-colors hover:text-[var(--ink)]"
                        >
                          {section.document.label} &#8594;
                        </a>
                      </figcaption>
                    </figure>
                  </Reveal>
                </div>
              );
            })()}

            {section.href && (
              <Reveal delay={0.32}>
                <Link href={section.href} className={`${section.button} mt-11`}>
                  Learn More
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
