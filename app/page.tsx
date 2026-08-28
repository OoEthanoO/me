import Link from "next/link";
import { projects } from "@/data/projects";
import { papers } from "@/data/research";
import { serviceStrands } from "@/data/service";
import { timeline } from "@/data/achievements";
import StatRow from "@/components/StatRow";
import Reveal from "@/components/Reveal";

/** Ground colours alternate so the page reads as a sequence of strips. */
const grounds = {
  navy: "bg-[var(--navy)] text-[var(--cream)]",
  cream: "bg-[var(--cream)] text-[var(--ink)]",
  creamDeep: "bg-[var(--cream-deep)] text-[var(--ink)]",
} as const;

export default function Home() {
  const flagship = projects.find((p) => p.featured);
  const paper = papers[0];
  const tutoring = serviceStrands[0];

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
              className="w-full max-w-[160px] rounded-full border border-[var(--tan)]/35 object-cover lg:max-w-[200px]"
              style={{ aspectRatio: "1 / 1" }}
            />
          </div>
        </div>
      </section>

      {/* ---- Tech / Project ---- */}
      <section className={`${grounds.navy} px-6 py-16 md:px-10 md:py-20`}>
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,3.4rem)]">
              Tech &amp; Projects
            </h2>
            {flagship && (
              <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-[var(--cream)]/80">
                {flagship.description}
              </p>
            )}
            <p className="eyebrow mt-9 text-[var(--cream)]/55">
              {projects.length} projects — CUDA, Next.js, Swift
            </p>
            <Link href="/tech" className="btn btn-cream mt-11">
              Learn More
            </Link>
          </Reveal>

          {flagship?.images[0] && (
            <Reveal delay={0.15}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flagship.images[0]}
                alt={`${flagship.title} screenshot`}
                className="w-full border border-[var(--cream)]/20 object-cover shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* ---- Social Impact ---- */}
      <section className={`${grounds.cream} px-6 py-16 md:px-10 md:py-20`}>
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,3.4rem)] text-[var(--ink)]">
              Social Impact
            </h2>
            <Link href="/social-impact" className="btn btn-burgundy mt-11">
              Learn More
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lg font-light leading-relaxed text-[var(--ink)]/80">
              {tutoring.description}
            </p>
            <div className="mt-10">
              <StatRow stats={tutoring.stats} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Research ---- */}
      <section className={`${grounds.creamDeep} px-6 py-16 md:px-10 md:py-20`}>
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-[var(--tan)]">Research</p>
            <h2 className="font-display mt-6 max-w-2xl text-[clamp(1.8rem,3.8vw,2.9rem)] leading-tight text-[var(--ink)]">
              {paper.title}
            </h2>
            <p className="mt-7 text-sm font-light tracking-wide text-[var(--ink)]/60">
              {paper.citation}
            </p>
            <Link href="/research" className="btn btn-burgundy mt-11">
              Learn More
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="border-t border-[var(--tan)]/40">
              {paper.results.slice(0, 2).map((stat) => (
                <div
                  key={stat.label}
                  className="border-b border-[var(--tan)]/40 py-7"
                >
                  <p className="font-display text-[clamp(2rem,4.4vw,3rem)] text-[var(--burgundy)]">
                    {stat.value}
                  </p>
                  <p className="eyebrow mt-3 text-[var(--ink)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Awards ---- */}
      <section className={`${grounds.navy} px-6 py-16 md:px-10 md:py-20`}>
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,3.4rem)]">
              Awards &amp; Certificates
            </h2>
            <Link href="/awards" className="btn btn-cream mt-11">
              Learn More
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="border-t border-[var(--cream)]/25">
              {timeline.slice(0, 4).map((item) => (
                <div
                  key={`${item.title}-${item.year}`}
                  className="flex items-baseline justify-between gap-6 border-b border-[var(--cream)]/25 py-6"
                >
                  <dt className="text-lg font-light text-[var(--cream)]/85">
                    {item.title}
                  </dt>
                  <dd className="font-display shrink-0 text-2xl text-[var(--tan)]">
                    {item.year}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---- Closing strip ---- */}
      <section
        id="contact"
        className="bg-[var(--burgundy)] px-6 py-16 text-[var(--cream)] md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <h2 className="font-display text-[clamp(3rem,8vw,3.4rem)]">
              Get in Touch.
            </h2>
            <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-[var(--cream)]/80">
              Always happy to talk about kernels, side projects, or anything
              worth building.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <a href="mailto:ethanxucoder@gmail.com" className="btn btn-cream">
                Email Me
              </a>
              <a
                href="https://github.com/OoEthanoO"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-[var(--cream)]"
              >
                GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
