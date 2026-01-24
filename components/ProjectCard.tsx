"use client";

import Link from 'next/link';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const slug = encodeURIComponent(project.title.toLowerCase().replace(/\s+/g, '-'));

  return (
    <Link
      href={`/project/${slug}`}
      className="project-card group relative flex flex-col rounded-[28px] border border-black/5 bg-white p-7 shadow-[0_18px_35px_rgba(0,0,0,0.08)]"
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#86868b]">
          <span>Project</span>
          <span className="text-[11px] font-semibold text-[#0071e3]">View →</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-[#1d1d1f]">{project.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6e6e73]">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full border border-black/10 bg-[#f5f5f7] px-3 py-1 text-[11px] font-semibold text-[#1d1d1f]"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#86868b]">Collaborators</span>
          {project.collaborators.map((collab) => (
            <span
              key={collab.name}
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1d1d1f] hover:border-black/20 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(collab.github, '_blank');
              }}
            >
              {collab.name}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#86868b]">Status</span>
          {project.status && (
            <span
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1d1d1f]"
            >
              {project.status}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
