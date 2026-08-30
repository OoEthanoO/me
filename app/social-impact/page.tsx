import type { Metadata } from "next";
import { serviceStrands } from "@/data/service";
import { fetchAmountRaised } from "@/lib/fundraiser";
import { fetchSchoolhouseStats } from "@/lib/schoolhouse";
import PageHeader from "@/components/PageHeader";
import StatRow from "@/components/StatRow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Social Impact — Yan Xu",
  description:
    "Free tutoring, fundraising for SickKids, and community volunteering.",
};

export default async function SocialImpactPage() {
  // Both reads happen once for the page, in parallel. Each strand that asks
  // for live figures falls back to the ones recorded in the data when the
  // source cannot be read.
  const [raised, schoolhouse] = await Promise.all([
    fetchAmountRaised(),
    fetchSchoolhouseStats(),
  ]);

  /** Live values by label where they were found, the recorded ones otherwise. */
  const statsFor = (strand: (typeof serviceStrands)[number]) =>
    strand.liveSchoolhouse && schoolhouse
      ? strand.stats.map((stat) => ({
          ...stat,
          value: schoolhouse[stat.label] ?? stat.value,
        }))
      : strand.stats;

  return (
    <div>
      <PageHeader title="Social Impact" />

      <section className="bg-[var(--cream)] px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-[1180px]">
          {serviceStrands.map((strand, idx) => (
            <Reveal key={strand.title} delay={idx * 0.08}>
              <article className="border-t border-[var(--tan)]/35 py-10 md:py-14">
                <h2 className="font-display flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b-2 border-[var(--burgundy)] pb-3 text-[clamp(1.3rem,2.6vw,1.75rem)] text-[var(--burgundy)]">
                      <span>{strand.title}</span>
                      {strand.liveFundraiser && (
                        <span className="text-[0.95rem] font-normal text-[var(--ink)]/70">
                          <span className="font-display text-[1.15rem] text-[var(--burgundy)]">
                            {raised ?? strand.stats[0]?.value}
                          </span>{" "}
                          raised
                        </span>
                      )}
                </h2>

                {strand.heroImages ? (
                  /* Wide layout, matching the category sections on /tech: the
                     write-up runs beside the screenshots, on whichever side
                     the strand asks for. */
                  <div
                    className={`mt-8 grid gap-10 lg:gap-20 ${
                      strand.heroSide === "right"
                        ? "lg:grid-cols-[1.5fr_1fr]"
                        : "lg:grid-cols-[1fr_1.1fr]"
                    }`}
                  >
                    <div
                        className={`space-y-8 ${
                          strand.heroSide === "right"
                            ? "order-2 lg:order-2"
                            : "order-2 lg:order-1"
                        }`}
                      >
                        {strand.heroImages.map((image) => (
                          <figure key={image.src}>
                            <div
                              className={
                                image.kind === "screenshot"
                                  ? "border border-[var(--tan)]/35 bg-white p-2"
                                  : "border border-[var(--tan)]/35"
                              }
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full"
                              />
                            </div>
                            <figcaption className="mt-4 text-[0.92rem] font-light leading-relaxed text-[var(--ink)]/70">
                              {image.caption}
                            </figcaption>
                          </figure>
                        ))}
                      </div>

                      <div
                        className={
                          strand.heroSide === "right"
                            ? "order-1 lg:order-1"
                            : "order-1 lg:order-2"
                        }
                      >
                        <div className="space-y-5">
                          {(strand.overview ?? strand.description)
                            .split("\n\n")
                            .map((para) => (
                              <p
                                key={para.slice(0, 32)}
                                className="text-lg font-light leading-relaxed text-[var(--ink)]/80"
                              >
                                {para}
                              </p>
                            ))}
                        </div>

                        {strand.href && (
                          <a
                            href={strand.href}
                            target={strand.external ? "_blank" : undefined}
                            rel={
                              strand.external ? "noopener noreferrer" : undefined
                            }
                            className="eyebrow mt-9 inline-flex items-center gap-2 text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
                          >
                            {strand.ctaLabel ?? "Visit"}
                            <span aria-hidden="true">&#8594;</span>
                          </a>
                        )}
                      </div>
                  </div>
                ) : (
                  /* Nothing to show beside it, so the write-up runs the full
                     width of the entry. */
                  <>
                    {(strand.overview ?? strand.description).trim() && (
                      <div className="mt-7 space-y-5">
                        {(strand.overview ?? strand.description)
                          .split("\n\n")
                          .map((para) => (
                            <p
                              key={para.slice(0, 32)}
                              className="text-lg font-light leading-relaxed text-[var(--ink)]/80"
                            >
                              {para}
                            </p>
                          ))}
                      </div>
                    )}

                    {strand.stats.length > 0 && (
                      <div className="mt-8">
                        <StatRow stats={statsFor(strand)} />
                      </div>
                    )}

                    {strand.href && (
                      <a
                        href={strand.href}
                        target={strand.external ? "_blank" : undefined}
                        rel={strand.external ? "noopener noreferrer" : undefined}
                        className="eyebrow mt-9 inline-flex items-center gap-2 text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
                      >
                        {strand.ctaLabel ?? "Visit"}
                        <span aria-hidden="true">&#8594;</span>
                      </a>
                    )}
                  </>
                )}

                {strand.code && (
                  <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-8">
                    {/* Each figure is min-w-0 so the code's intrinsic width
                        cannot widen its grid track and push the page sideways. */}
                    {strand.code.map((sample) => (
                      <figure key={sample.path} className="min-w-0">
                        <div className="min-w-0 overflow-hidden border border-[var(--navy)]/25 bg-[var(--navy)]">
                          <p className="border-b border-[var(--cream)]/15 px-5 py-3 font-mono text-[0.72rem] tracking-wide text-[var(--tan)]">
                            {sample.path}
                          </p>
                          {/* Long lines scroll inside the panel, never the page. */}
                          <pre className="overflow-x-auto px-5 py-5">
                            <code className="font-mono text-[0.72rem] leading-relaxed text-[var(--cream)]/85">
                              {sample.code}
                            </code>
                          </pre>
                        </div>
                        <figcaption className="mt-4 text-[0.92rem] font-light leading-relaxed text-[var(--ink)]/70">
                          {sample.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}

                {strand.images && (
                  <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                    {strand.images.map((image) => (
                      <figure key={image.src}>
                        <div
                          className={
                            image.kind === "screenshot"
                              ? "border border-[var(--tan)]/35 bg-white p-2"
                              : "border border-[var(--tan)]/35"
                          }
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full object-cover"
                          />
                        </div>
                        <figcaption className="mt-4 text-[0.92rem] font-light leading-relaxed text-[var(--ink)]/70">
                          {image.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Closing strip ---- */}
      <section className="bg-[var(--burgundy)] px-6 py-14 text-[var(--cream)] md:px-10 md:py-18">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,6vw,3.4rem)]">
              Want to tutor, or be tutored?
            </h2>
            <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-[var(--cream)]/80">
              The platform is open to both. Volunteers get their hours tracked
              automatically; students pay nothing.
            </p>
            <div className="mt-11 flex flex-wrap items-center gap-5">
              <a
                href="https://learn.ethanyanxu.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cream"
              >
                Go to YanLearn
              </a>
              <a
                href="mailto:ethanxucoder@gmail.com"
                className="btn btn-outline text-[var(--cream)]"
              >
                Email Me
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
