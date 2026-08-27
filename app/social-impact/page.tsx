import type { Metadata } from "next";
import { serviceStrands } from "@/data/service";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Social Impact — Yan Xu",
  description:
    "Free tutoring, fundraising for SickKids, and community volunteering.",
};

export default function SocialImpactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Social Impact"
        title="Teaching, for free."
        lede="The work that does not ship as a product: hours taught, money raised, and the platform built to make both easier to run."
      />

      <section className="bg-[var(--cream)] px-6 pb-28 md:px-10 md:pb-36">
        <div className="mx-auto max-w-[1180px]">
          {serviceStrands.map((strand, idx) => (
            <Reveal key={strand.title} delay={idx * 0.08}>
              <article className="border-t border-[var(--tan)]/35 py-14 md:py-20">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                  <div>
                    <p className="eyebrow text-[var(--tan)]">
                      {strand.eyebrow}
                    </p>
                    <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.2rem)] text-[var(--ink)]">
                      {strand.title}
                    </h2>
                    {strand.href && (
                      <a
                        href={strand.href}
                        target={strand.external ? "_blank" : undefined}
                        rel={strand.external ? "noopener noreferrer" : undefined}
                        className="eyebrow mt-7 inline-flex items-center gap-2 text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
                      >
                        Visit the Platform
                        <span aria-hidden="true">&#8594;</span>
                      </a>
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-light leading-relaxed text-[var(--ink)]/80">
                      {strand.description}
                    </p>

                    <div className="mt-10 grid grid-cols-2 gap-px bg-[var(--tan)]/35 sm:grid-cols-4">
                      {strand.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-[var(--cream)] py-6 pr-4"
                        >
                          <p className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] text-[var(--burgundy)]">
                            {stat.value}
                          </p>
                          <p className="mt-2 text-[0.72rem] font-medium uppercase leading-snug tracking-[0.14em] text-[var(--ink)]/55">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Closing strip ---- */}
      <section className="bg-[var(--burgundy)] px-6 py-24 text-[var(--cream)] md:px-10 md:py-32">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)]">
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
