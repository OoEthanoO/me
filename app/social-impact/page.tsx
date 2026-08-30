import type { Metadata } from "next";
import { serviceStrands } from "@/data/service";
import type { ServiceStat } from "@/data/service";

/** Strands painted on the navy ground rather than the cream one. */
const DARK_STRANDS = new Set(["YanLearn", "St. Robert Coding Club"]);
import { fetchAmountRaised } from "@/lib/fundraiser";
import { fetchSchoolhouseStats } from "@/lib/schoolhouse";
import { fetchYanLearnStats } from "@/lib/yanlearn";
import PageHeader from "@/components/PageHeader";
import StatRow from "@/components/StatRow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Social Impact — Yan Xu",
  description:
    "Free tutoring, fundraising for SickKids, and community volunteering.",
};

export default async function SocialImpactPage() {
  // Every read happens once for the page, in parallel. Each strand that asks
  // for live figures falls back to the ones recorded in the data when the
  // source cannot be read.
  const [raised, schoolhouse, yanlearn] = await Promise.all([
    fetchAmountRaised(),
    fetchSchoolhouseStats(),
    fetchYanLearnStats(),
  ]);

  /**
   * The figure a total prints: either one label added across the strand's
   * groups, reading their live values where they have them, or a value given
   * outright. A sum with no matching label returns null, so a mis-typed label
   * prints nothing rather than a zero.
   */
  const totalValue = (
    strand: (typeof serviceStrands)[number],
    total: NonNullable<(typeof serviceStrands)[number]["totals"]>[number],
  ) => {
    if (!total.from) return total.value ?? null;
    if (!strand.groups) return null;

    let found = false;
    const sum = strand.groups.reduce((running, group) => {
      const stat = liveStats(group.stats, group.live).find(
        (s) => s.label === total.from,
      );
      if (!stat) return running;
      const value = Number(stat.value.replace(/,/g, ""));
      if (Number.isNaN(value)) return running;
      found = true;
      return running + value;
    }, 0);

    // Trailing zeros read as false precision on a number that is a sum.
    return found ? String(Number(sum.toFixed(1))) : null;
  };

  /** The same, for the figures read off the YanLearn analytics board. */
  const liveFigures = (stats: ServiceStat[]) =>
    yanlearn
      ? stats.map((stat) => ({
          ...stat,
          value: yanlearn[stat.label] ?? stat.value,
        }))
      : stats;

  /** Live values by label where they were found, the recorded ones otherwise. */
  const liveStats = (stats: ServiceStat[], live?: boolean) =>
    live && schoolhouse
      ? stats.map((stat) => ({
          ...stat,
          value: schoolhouse[stat.label] ?? stat.value,
        }))
      : stats;

  return (
    <div>
      <PageHeader title="Social Impact" />

      {serviceStrands.map((strand, idx) => (
        <section
          key={strand.title}
          className={`px-6 py-12 md:px-10 md:py-16 ${
            DARK_STRANDS.has(strand.title)
              ? "on-dark bg-[var(--navy)] text-[var(--cream)]"
              : "bg-[var(--cream)] text-[var(--ink)]"
          }`}
        >
          <div className="mx-auto max-w-[1180px]">
            <Reveal delay={idx * 0.08}>
              <article>
                <h2 className="font-display border-b-2 border-[var(--entry-accent)] pb-3 text-[clamp(1.3rem,2.6vw,1.75rem)] text-[var(--entry-accent)]">
                  {strand.title}
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
                                  ? "border border-[var(--entry-rule)] bg-white p-2"
                                  : "border border-[var(--entry-rule)]"
                              }
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full"
                              />
                            </div>
                            <figcaption className="mt-4 text-[0.92rem] leading-relaxed text-[var(--entry-muted)]">
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
                                className="text-lg leading-relaxed text-[var(--entry-ink)]"
                              >
                                {para}
                              </p>
                            ))}
                        </div>

                        {/* The running total closes the write-up rather than
                            riding on the heading, where it read as a caption
                            to the title instead of the result of the story. */}
                        {strand.liveFundraiser && (
                          <p className="mt-8 flex items-baseline gap-2.5">
                            <span className="font-display text-[1.6rem] text-[var(--entry-accent)]">
                              {raised ?? strand.stats[0]?.value}
                            </span>
                            <span className="text-[1.05rem] font-semibold text-[var(--entry-gold)]">
                              raised
                            </span>
                          </p>
                        )}

                        {/* Figures off the platform's own analytics board,
                            between the write-up and the link to it. */}
                        {strand.liveFigures && (
                          <div className="mt-8">
                            <StatRow stats={liveFigures(strand.liveFigures)} />
                          </div>
                        )}

                        {strand.href && (
                          <a
                            href={strand.href}
                            target={strand.external ? "_blank" : undefined}
                            rel={
                              strand.external ? "noopener noreferrer" : undefined
                            }
                            className="btn-entry mt-9"
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
                              className="text-lg leading-relaxed text-[var(--entry-ink)]"
                            >
                              {para}
                            </p>
                          ))}
                      </div>
                    )}

                    {strand.stats.length > 0 && (
                      <div className="mt-8">
                        <StatRow stats={liveStats(strand.stats)} />
                      </div>
                    )}

                    {/* Two halves, each with its own name and figures. */}
                    {strand.groups && (
                      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
                        {strand.groups.map((group, index) => (
                          <div key={group.title}>
                            <h3 className="font-display text-[clamp(1.05rem,1.9vw,1.35rem)] leading-tight text-[var(--entry-ink)]">
                              {group.title}
                            </h3>

                            <div className="mt-6">
                              <StatRow
                                stats={liveStats(group.stats, group.live)}
                              />
                            </div>

                            {/* The totals sit under the first group, in the
                                room its shorter list leaves. */}
                            {index === 0 && strand.totals && (
                              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                                {strand.totals.map((total) => {
                                  const value = totalValue(strand, total);
                                  if (!value) return null;

                                  return (
                                    <div key={total.label}>
                                      <p className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none text-[var(--entry-accent)]">
                                        {value}
                                      </p>
                                      <p className="mt-3 text-[0.72rem] font-medium uppercase leading-snug tracking-[0.14em] text-[var(--entry-muted)]">
                                        {total.label}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {group.href && (
                              <a
                                href={group.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-entry mt-7"
                              >
                                {group.ctaLabel ?? "Visit"}
                                <span aria-hidden="true">&#8594;</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {strand.href && (
                      <a
                        href={strand.href}
                        target={strand.external ? "_blank" : undefined}
                        rel={strand.external ? "noopener noreferrer" : undefined}
                        className="btn-entry mt-9"
                      >
                        {strand.ctaLabel ?? "Visit"}
                        <span aria-hidden="true">&#8594;</span>
                      </a>
                    )}
                  </>
                )}

              </article>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
