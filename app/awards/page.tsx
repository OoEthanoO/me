import type { Metadata } from "next";
import { MONTH_NAMES, timeline } from "@/data/achievements";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Awards — Yan Xu",
  description: "Scholastic excellence awards and certificates.",
};

/**
 * One column per calendar year, newest first. Entries carry the month where it
 * is on record; the rest print under the year alone.
 */
const columns = timeline.reduce<
  { year: string; items: typeof timeline }[]
>((acc, item) => {
  const last = acc[acc.length - 1];

  if (last && last.year === item.year) last.items.push(item);
  else acc.push({ year: item.year, items: [item] });

  return acc;
}, []);

export default function AwardsPage() {
  return (
    <div>
      <PageHeader title="Awards & Certificates" />

      <section className="bg-[var(--cream)] px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-[1180px]">
          <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column, columnIdx) => (
              <li
                key={column.year}
                /* Alternating columns take the navy. Every column is padded
                   the same, so the ones without it still line up. The top
                   padding clears the marker, which is pulled half its height
                   above the spine and would otherwise be cut in half by the
                   panel's edge. */
                className={`px-5 pb-6 pt-3 ${
                  columnIdx % 2 === 1
                    ? "on-dark bg-[var(--navy)] text-[var(--cream)]"
                    : ""
                }`}
              >
                <Reveal delay={columnIdx * 0.05}>
                  {/* Horizontal spine; the column's entries hang below it. */}
                  <div className="relative border-t border-[var(--entry-rule)] pt-6">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--entry-accent)]"
                    />

                    <p className="font-display text-[clamp(1.3rem,2.4vw,1.7rem)] text-[var(--entry-muted)]">
                      {column.year}
                    </p>
                  </div>
                </Reveal>

                <ol className="mt-1">
                  {column.items.map((item) => (
                    <li key={`${item.title}-${item.year}`}>
                      <Reveal delay={columnIdx * 0.05 + 0.05}>
                        <div className="py-4">
                          {item.month && (
                            <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--entry-muted)]">
                              {MONTH_NAMES[item.month - 1]}
                            </p>
                          )}

                          <h2 className="font-display font-book mt-1.5 text-[clamp(1.05rem,1.6vw,1.25rem)] leading-tight text-[var(--entry-ink)]">
                            {item.title}
                          </h2>

                          {item.detail && (
                            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-[var(--entry-ink)]">
                              {item.detail}
                            </p>
                          )}

                          {item.href && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2.5 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--entry-accent)] transition-colors hover:text-[var(--entry-accent-hover)]"
                            >
                              View
                              <span aria-hidden="true">&#8594;</span>
                            </a>
                          )}
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
