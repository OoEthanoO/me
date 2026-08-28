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
        lede="Hours taught, money raised, and the platform built to run both."
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
                        {strand.ctaLabel ?? "Visit"}
                        <span aria-hidden="true">&#8594;</span>
                      </a>
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-light leading-relaxed text-[var(--ink)]/80">
                      {strand.description}
                    </p>

                    <div className="mt-10 -ml-4 grid grid-cols-2 gap-px bg-[var(--tan)]/35 sm:grid-cols-4">
                      {strand.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-[var(--cream)] px-4 py-6"
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
      <section className="bg-[var(--burgundy)] px-6 py-24 text-[var(--cream)] md:px-10 md:py-32">
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
