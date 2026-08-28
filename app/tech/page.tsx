import type { Metadata } from "next";
import Link from "next/link";
import { projects, categoryOrder } from "@/data/projects";
import ProjectCard, { slugify } from "@/components/ProjectCard";
import ProjectFeature from "@/components/ProjectFeature";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Tech & Projects — Yan Xu",
  description:
    "CUDA kernels, full-stack products, and the tooling around them.",
};

export default function TechPage() {
  const flagship = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== flagship);

  // Named categories render as their own sections, in the declared order;
  // anything without one stays in the Selected Work list below them.
  const grouped = categoryOrder
    .map((category) => ({
      category,
      items: rest.filter((p) => p.category === category),
    }))
    .filter(({ items }) => items.length > 0);
  const ungrouped = rest.filter((p) => !p.category);

  return (
    <div>
      <PageHeader title="Tech & Projects" />

      {/* ---- Flagship keeps its own dark screen, as on the home page ---- */}
      {flagship && (
        <section className="bg-[var(--navy)] px-6 py-16 text-[var(--cream)] md:px-10 md:py-20">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-[var(--tan)]">Flagship Project</p>
              <h2 className="font-display mt-6 text-[clamp(2.6rem,6vw,3.4rem)]">
                {flagship.title}
              </h2>
              <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-[var(--cream)]/80">
                {flagship.description}
              </p>
              <div className="mt-9 flex flex-wrap gap-x-4 gap-y-2">
                {flagship.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--cream)]/55"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Link
                href={`/project/${encodeURIComponent(slugify(flagship.title))}`}
                className="btn btn-cream mt-11"
              >
                Learn More
              </Link>
            </Reveal>

            {flagship.images[0] && (
              <Reveal delay={0.15}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={flagship.images[0]}
                  alt={`${flagship.title} screenshot`}
                  className="w-full border border-[var(--cream)]/20 object-cover shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
                />
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ---- Grouped categories, then everything not yet grouped ---- */}
      <section className="bg-[var(--cream)] px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1180px]">
          {grouped.map(({ category, items }) => (
            <div key={category} className="mb-16 md:mb-20">
              <Reveal>
                <p className="eyebrow text-[var(--tan)]">{category}</p>
              </Reveal>

              <div className="mt-6">
                {items.map((project) => (
                  <Reveal key={project.title}>
                    <ProjectFeature project={project} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          <Reveal>
            <p className="eyebrow text-[var(--tan)]">Selected Work</p>
          </Reveal>

          <div className="mt-10 grid border-l border-t border-[var(--tan)]/35 md:grid-cols-2 lg:grid-cols-3">
            {ungrouped.map((project, idx) => (
              <Reveal key={project.title} delay={(idx % 3) * 0.08} className="h-full">
                <ProjectCard project={project} index={idx} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="eyebrow mt-16 text-[var(--tan)]">More coming soon</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
