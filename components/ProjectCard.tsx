import Link from "next/link";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  /** Two-digit index printed as an editorial folio in the card corner. */
  index: number;
}

export function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${encodeURIComponent(slugify(project.title))}`}
      className="project-card group flex h-full flex-col border-b border-r border-[var(--tan)]/35 bg-[var(--cream)] p-8 md:p-10"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-3xl text-[var(--tan)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow text-[var(--tan)]">
          {project.technologies[0]}
        </span>
      </div>

      <h3 className="card-title font-display mt-7 text-[1.9rem] leading-tight text-[var(--ink)]">
        {project.title}
      </h3>

      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[var(--ink)]/75">
        {project.description}
      </p>

      <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2 border-t border-[var(--tan)]/30 pt-6">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--ink)]/50"
          >
            {tech}
          </span>
        ))}
      </div>

      <span className="eyebrow mt-6 inline-flex items-center gap-2 text-[var(--accent)]">
        View Project
        <span className="card-arrow inline-block">&#8594;</span>
      </span>
    </Link>
  );
}
