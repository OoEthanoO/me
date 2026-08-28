import Link from "next/link";
import type { Project } from "@/data/projects";
import { slugify } from "@/components/ProjectCard";
import StatRow from "@/components/StatRow";

/**
 * Wide entry for projects that sit inside a named category: the write-up is
 * printed in full rather than trimmed to a card blurb, with the screenshots
 * underneath it. The compact ProjectCard still handles the ungrouped grid.
 */
/**
 * Columns follow the number of screenshots. A lone wide screenshot dropped into
 * a three-column grid renders about 366px across, which is far too small to
 * read the interface inside it — so a single image takes the full width.
 * Written out in full so Tailwind sees each class literally.
 */
const imageColumns = (count: number) => {
  if (count <= 2) return "grid-cols-1";
  return "sm:grid-cols-2 lg:grid-cols-3";
};

export default function ProjectFeature({ project }: { project: Project }) {
  const paragraphs = (project.overview ?? project.description).split("\n\n");

  return (
    <article className="border-t border-[var(--tan)]/35 py-10 md:py-14">
      <h3 className="font-display text-[clamp(1.15rem,2.2vw,1.5rem)] leading-tight text-[var(--ink)]">
        {project.title}
      </h3>

      <div className="mt-5 max-w-3xl space-y-4">
        {paragraphs.map((para) => (
          <p
            key={para.slice(0, 32)}
            className="text-[1.05rem] leading-relaxed text-[var(--ink)] md:text-[1.15rem]"
          >
            {para}
          </p>
        ))}
      </div>

      {project.stats && project.stats.length > 0 && (
        <div className="mt-6 max-w-3xl">
          <StatRow stats={project.stats} compact />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--ink)]/50"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.images.length > 0 && (
        <div className={`mt-6 grid gap-5 ${imageColumns(project.images.length)}`}>
          {project.images.map((src, i) => (
            <div
              key={src}
              className="border border-[var(--tan)]/35 bg-white p-1.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* Links close the entry, under the screenshots. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link
          href={`/project/${encodeURIComponent(slugify(project.title))}`}
          className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
        >
          Full Write-up &#8594;
        </Link>
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
          >
            Visit Site &#8594;
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
          >
            Source &#8594;
          </a>
        )}
      </div>
    </article>
  );
}
