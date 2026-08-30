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
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column, columnIdx) => (
              <li key={column.year}>
                <Reveal delay={columnIdx * 0.05}>
                  {/* Horizontal spine; the column's entries hang below it. */}
                  <div className="relative border-t border-[var(--tan)]/45 pt-5">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--burgundy)]"
                    />

                    <p className="font-display text-[clamp(1.3rem,2.4vw,1.7rem)] text-[var(--tan)]">
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
                            <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--tan)]">
                              {MONTH_NAMES[item.month - 1]}
                            </p>
                          )}

                          <h2 className="font-display font-book mt-1.5 text-[clamp(1.05rem,1.6vw,1.25rem)] leading-tight text-[var(--ink)]">
                            {item.title}
                          </h2>

                          {item.detail && (
                            <p className="mt-1.5 text-[0.88rem] font-light leading-relaxed text-[var(--ink-deep)]">
                              {item.detail}
                            </p>
                          )}

                          {item.href && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2.5 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
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
