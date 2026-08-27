import type { Metadata } from "next";
import { papers } from "@/data/research";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Research — Yan Xu",
  description:
    "Published research on machine learning for water level residual correction.",
};

export default function ResearchPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Research"
        title="Questions worth measuring."
        lede="Peer-reviewed work, with the numbers that did not go my way reported alongside the ones that did."
      />

      {papers.map((paper, idx) => (
        <div key={paper.title}>
          {/* ---- Paper masthead on a dark strip ---- */}
          <section className="bg-[var(--navy)] px-6 py-24 text-[var(--cream)] md:px-10 md:py-32">
            <div className="mx-auto max-w-[1180px]">
              <Reveal>
                <p className="eyebrow text-[var(--tan)]">
                  {paper.venue} — {paper.year}
                </p>
                <h2 className="font-display mt-7 max-w-4xl text-[clamp(1.9rem,4.4vw,3.4rem)] leading-tight">
                  {paper.title}
                </h2>
                <p className="mt-8 text-sm font-light tracking-wide text-[var(--cream)]/60">
                  {paper.citation}
                </p>
                <p className="mt-9 max-w-2xl text-lg font-light leading-relaxed text-[var(--cream)]/80">
                  {paper.motivation}
                </p>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-cream mt-11"
                >
                  Read the Paper
                </a>
              </Reveal>
            </div>
          </section>

          {/* ---- Headline figures ---- */}
          <section className="bg-[var(--cream-deep)] px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto max-w-[1180px]">
              <Reveal>
                <p className="eyebrow text-[var(--tan)]">Results</p>
              </Reveal>
              <div className="mt-14 grid gap-px border border-[var(--tan)]/35 bg-[var(--tan)]/35 md:grid-cols-3">
                {paper.results.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.08} className="h-full">
                    <div className="flex h-full flex-col bg-[var(--cream-deep)] p-8 md:p-10">
                      <p className="font-display text-[clamp(2.4rem,5vw,3.4rem)] text-[var(--burgundy)]">
                        {stat.value}
                      </p>
                      <p className="eyebrow mt-4 text-[var(--ink)]">
                        {stat.label}
                      </p>
                      <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-[var(--ink)]/75">
                        {stat.detail}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Abstract, method, takeaway ---- */}
          <section className="bg-[var(--cream)] px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto grid max-w-[1180px] gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
              <Reveal>
                <p className="eyebrow text-[var(--tan)]">Abstract</p>
                <p className="mt-7 text-lg font-light leading-relaxed text-[var(--ink)]/85">
                  {paper.abstract}
                </p>

                <p className="eyebrow mt-14 text-[var(--tan)]">What It Found</p>
                <p className="mt-7 text-lg font-light leading-relaxed text-[var(--ink)]/85">
                  {paper.finding}
                </p>

                <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--tan)]/35 pt-8">
                  {paper.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--ink)]/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="eyebrow text-[var(--tan)]">Method</p>
                <dl className="mt-7 border-t border-[var(--tan)]/35">
                  {paper.method.map((step) => (
                    <div
                      key={step.label}
                      className="border-b border-[var(--tan)]/35 py-7"
                    >
                      <dt className="font-display text-xl text-[var(--ink)]">
                        {step.label}
                      </dt>
                      <dd className="mt-3 text-[0.98rem] font-light leading-relaxed text-[var(--ink)]/75">
                        {step.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </section>

          {idx < papers.length - 1 && (
            <div className="h-px bg-[var(--tan)]/35" />
          )}
        </div>
      ))}
    </div>
  );
}
