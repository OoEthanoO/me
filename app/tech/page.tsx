import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";
import ProjectCard, { slugify } from "@/components/ProjectCard";
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

  return (
    <div>
      <PageHeader
        eyebrow="Tech / Project"
        title="Things I have built."
        lede="Kernels written down to the metal, products shipped end to end, and the tooling that holds them together."
      />

      {/* ---- Flagship keeps its own dark screen, as on the home page ---- */}
      {flagship && (
        <section className="bg-[var(--navy)] px-6 py-28 text-[var(--cream)] md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-[var(--tan)]">Flagship Project</p>
              <h2 className="font-display mt-6 text-[clamp(2.6rem,6vw,4.4rem)]">
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

      {/* ---- Everything else ---- */}
      <section className="bg-[var(--cream)] px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <p className="eyebrow text-[var(--tan)]">Selected Work</p>
            <h2 className="font-display mt-6 max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] text-[var(--ink)]">
              The rest of the shelf.
            </h2>
          </Reveal>

          <div className="mt-16 grid border-l border-t border-[var(--tan)]/35 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, idx) => (
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
