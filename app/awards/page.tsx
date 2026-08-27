import type { Metadata } from "next";
import { timeline } from "@/data/achievements";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Awards — Yan Xu",
  description: "Scholastic excellence awards and certificates.",
};

export default function AwardsPage() {
  return (
    <div>
      <PageHeader eyebrow="Awards" title="Awards & Certificates" />

      <section className="bg-[var(--cream)] px-6 pb-28 md:px-10 md:pb-36">
        <div className="mx-auto max-w-[1180px]">
          {/* Vertical spine; each entry hangs off a marker on it. */}
          <ol className="relative ml-3 border-l border-[var(--tan)]/45 md:ml-6">
            {timeline.map((item, idx) => {
              const isNewYear =
                idx === 0 || timeline[idx - 1].year !== item.year;

              return (
                <li key={`${item.title}-${item.year}`} className="relative">
                  {isNewYear && (
                    <Reveal>
                      <p className="font-display -ml-3 pt-12 text-[clamp(1.6rem,3.2vw,2.4rem)] text-[var(--tan)] md:-ml-6 md:pt-16">
                        <span className="bg-[var(--cream)] pr-4">
                          {item.year}
                        </span>
                      </p>
                    </Reveal>
                  )}

                  <Reveal delay={0.05}>
                    <div className="relative py-7 pl-8 md:pl-12">
                      {/* Marker sitting on the spine */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[2.35rem] h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--burgundy)]"
                      />

                      <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--tan)]">
                        {item.kind === "award" ? "Award" : "Certificate"}
                      </p>

                      <h2 className="font-display mt-3 text-[clamp(1.25rem,2.6vw,1.75rem)] leading-tight text-[var(--ink)]">
                        {item.title}
                      </h2>

                      {item.detail && (
                        <p className="mt-3 max-w-2xl text-[0.98rem] font-light leading-relaxed text-[var(--ink)]/75">
                          {item.detail}
                        </p>
                      )}

                      {item.href && (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
                        >
                          View
                          <span aria-hidden="true">&#8594;</span>
                        </a>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}
