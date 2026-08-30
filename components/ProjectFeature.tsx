import Link from "next/link";
import type { Project } from "@/data/projects";
import { slugify } from "@/components/ProjectCard";
import StatRow from "@/components/StatRow";

/**
 * Wide entry for projects that sit inside a named category: the write-up is
 * printed in full rather than trimmed to a card blurb. Screenshots sit beneath
 * it by default, or stacked beside it where the project names `featureImages`.
 * The compact ProjectCard still handles the ungrouped grid.
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

const frame = "border border-[var(--tan)]/35 bg-white p-1.5";

export default function ProjectFeature({ project }: { project: Project }) {
  const paragraphs = (project.overview ?? project.description).split("\n\n");
  // Projects naming featureImages put those beside the write-up; the rest show
  // at most three underneath it. Either way the full set is on the project page.
  const MAX_IMAGES = 3;
  const beside = project.featureImages;
  const below = beside ? [] : project.images.slice(0, MAX_IMAGES);
  const remaining =
    project.images.length - (beside ? beside.length : below.length);

  const prose = (
    <>
      <div className="space-y-4">
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
        <div className="mt-6">
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
    </>
  );

  return (
    <article className="border-t border-[var(--tan)]/35 py-10 md:py-14">
      <h3 className="font-display text-[clamp(1.15rem,2.2vw,1.5rem)] leading-tight text-[var(--ink)]">
        {project.title}
      </h3>

      {beside ? (
        /* The write-up keeps the larger share; the screenshots stack down the
           right-hand column, and both fall into one column below lg. */
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>{prose}</div>
          <div className="space-y-5">
            {beside.map((src, i) => (
              <div key={src} className={frame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 max-w-3xl">{prose}</div>

          {below.length > 0 && (
            <div className={`mt-6 grid gap-5 ${imageColumns(below.length)}`}>
              {below.map((src, i) => (
                <div key={src} className={frame}>
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
        </>
      )}

      {/* Links close the entry, under the screenshots. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link
          href={`/project/${encodeURIComponent(slugify(project.title))}`}
          className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
        >
          Full Write-up
          {remaining > 0 && ` (+${remaining} more image${remaining > 1 ? "s" : ""})`}
          {" "}&#8594;
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
        {/* Work split across repositories lists each; otherwise one Source link. */}
        {(project.repositories ??
          (project.github
            ? [{ label: "Source", url: project.github }]
            : [])
        ).map((repo) => (
          <a
            key={repo.url}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--burgundy)] transition-colors hover:text-[var(--ink)]"
          >
            {repo.label} &#8594;
          </a>
        ))}
      </div>
    </article>
  );
}
