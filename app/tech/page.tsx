import type { Metadata } from "next";
import Link from "next/link";
import { projects, categoryOrder, ROBOTICS_SECTION } from "@/data/projects";

/** Categories painted on the navy ground rather than the cream one. */
const DARK_SECTIONS = new Set(["Other"]);
import { slugify } from "@/components/ProjectCard";
import ProjectFeature from "@/components/ProjectFeature";
import RoboticsSection from "@/components/RoboticsSection";
import { sectionId } from "@/data/projects";
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

  // Named categories render as their own sections, in the declared order, with
  // the Robotics section taking its place among them. A project without a
  // category no longer appears on this page; its own page still exists.
  const sections = categoryOrder
    .map((category) =>
      category === ROBOTICS_SECTION
        ? { category, items: [] }
        : { category, items: rest.filter((p) => p.category === category) },
    )
    .filter(
      ({ category, items }) =>
        category === ROBOTICS_SECTION || items.length > 0,
    );

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

      {/* ---- The grouped categories, each on its own ground ---- */}
      {sections.map(({ category, items }) => {
        // Robotics and Other take the navy the flagship strip uses; `.on-dark`
        // repaints the entries inside them without changing their markup.
        const dark = category === ROBOTICS_SECTION || DARK_SECTIONS.has(category);

        return (
          <section
            key={category}
            id={category === ROBOTICS_SECTION ? "robotics" : sectionId(category)}
            className={`scroll-mt-28 px-6 py-16 md:px-10 md:py-20 ${
              dark
                ? "on-dark bg-[var(--navy)] text-[var(--cream)]"
                : "bg-[var(--cream)] text-[var(--ink)]"
            }`}
          >
            <div className="mx-auto max-w-[1180px]">
              {category === ROBOTICS_SECTION ? (
                <Reveal>
                  <RoboticsSection />
                </Reveal>
              ) : (
                <>
                  {/* A real heading: it sits above the h3 of each entry, and
                      the eyebrow treatment was too faint to read as a
                      divider. */}
                  <Reveal>
                    <h2 className="font-display border-b-2 border-[var(--entry-accent)] pb-3 text-[clamp(1.3rem,2.6vw,1.75rem)] text-[var(--entry-accent)]">
                      {category}
                    </h2>
                  </Reveal>

                  {/* The heading already draws a rule, so the first entry
                      drops its own border and the top padding that spaces
                      stacked entries. */}
                  <div className="mt-2 [&>*:first-child_article]:border-t-0 [&>*:first-child_article]:pt-4 md:[&>*:first-child_article]:pt-5">
                    {items.map((project) => (
                      <Reveal key={project.title}>
                        <ProjectFeature project={project} />
                      </Reveal>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        );
      })}

      <section className="bg-[var(--cream)] px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <p className="eyebrow text-[var(--tan)]">More coming soon</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
