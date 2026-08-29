import type { Metadata } from "next";
import { serviceStrands } from "@/data/service";
import PageHeader from "@/components/PageHeader";
import StatRow from "@/components/StatRow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Social Impact — Yan Xu",
  description:
    "Free tutoring, fundraising for SickKids, and community volunteering.",
};

export default function SocialImpactPage() {
  return (
    <div>
      <PageHeader title="Social Impact" />

      <section className="bg-[var(--cream)] px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-[1180px]">
          {serviceStrands.map((strand, idx) => (
            <Reveal key={strand.title} delay={idx * 0.08}>
              <article className="border-t border-[var(--tan)]/35 py-10 md:py-14">
                {strand.heroImages ? (
                  /* Wide layout, matching the category sections on /tech: the
                     title runs across the entry, screenshots stack to the left
                     of the write-up, and the link closes the right column. */
                  <>
                    <h2 className="font-display border-b-2 border-[var(--burgundy)] pb-3 text-[clamp(1.3rem,2.6vw,1.75rem)] text-[var(--burgundy)]">
                      {strand.title}
                    </h2>

                    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                      <div className="space-y-8">
                        {strand.heroImages.map((image) => (
                          <figure key={image.src}>
                            <div className="border border-[var(--tan)]/35 bg-white p-2">
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

                      <div>
                        <p className="text-lg font-light leading-relaxed text-[var(--ink)]/80">
                          {strand.description}
                        </p>

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
                  </>
                ) : (
                  <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                    <div>
                      {strand.eyebrow && (
                        <p className="eyebrow text-[var(--tan)]">
                          {strand.eyebrow}
                        </p>
                      )}
                      <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.2rem)] text-[var(--ink)]">
                        {strand.title}
                      </h2>
                      {strand.href && (
                        <a
                          href={strand.href}
                          target={strand.external ? "_blank" : undefined}
                          rel={
                            strand.external ? "noopener noreferrer" : undefined
                          }
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

                      <div className="mt-10">
                        <StatRow stats={strand.stats} />
                      </div>
                    </div>
                  </div>
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
