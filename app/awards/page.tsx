import type { Metadata } from "next";
import { awards } from "@/data/achievements";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Awards — Yan Xu",
  description: "Competition results and exam scores.",
};

export default function AwardsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Awards"
        title="Results, in order."
        lede="Competitive programming and coursework, listed with the scores as they came — including the ones I would rather have been higher."
      />

      <section className="bg-[var(--cream)] px-6 pb-28 md:px-10 md:pb-36">
        <div className="mx-auto max-w-[1180px]">
          <dl className="border-t border-[var(--tan)]/35">
            {awards.map((award, idx) => (
              <Reveal key={award.name} delay={(idx % 4) * 0.06}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-[var(--tan)]/35 py-8 md:py-10">
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-2xl text-[var(--tan)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <dt className="font-display text-[clamp(1.4rem,3vw,2.1rem)] text-[var(--ink)]">
                        {award.name}
                      </dt>
                      {award.note && (
                        <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--ink)]/50">
                          {award.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <dd className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] text-[var(--burgundy)]">
                    {award.result}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal>
            <p className="eyebrow mt-14 text-[var(--tan)]">
              Service figures live on the Social Impact page
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
