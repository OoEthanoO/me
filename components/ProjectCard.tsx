"use client";

import Link from 'next/link';
import { useRef, MouseEvent } from 'react';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const slug = encodeURIComponent(project.title.toLowerCase().replace(/\s+/g, '-'));

  return (
    <Link
      ref={cardRef}
      href={`/project/${slug}`}
      className="project-card relative group bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-lg transition-transform hover:-translate-y-2 cursor-pointer"
      onMouseMove={handleMouseMove}
    >
        <div className="flex-1 p-8 flex flex-col z-10 relative">
            <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">{project.title}</h2>
            <p className="mb-4 text-gray-300">{project.description}</p>
            <div className="mb-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
                <span
                key={tech}
                className="inline-block bg-gradient-to-r from-blue-700 to-fuchsia-700 text-xs font-semibold px-3 py-1 rounded-full text-white shadow hover:scale-105 transition-transform"
                >
                {tech}
                </span>
            ))}
            </div>
            <div className="mb-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400">Collaborators:</span>
            {project.collaborators.map((collab) => (
                <span
                key={collab}
                className="inline-block bg-white/10 text-gray-200 text-xs px-2 py-1 rounded-full border border-white/10"
                >
                {collab}
                </span>
            ))}
            </div>
            <span className="inline-block mt-2 text-fuchsia-400 underline font-medium transition-colors">
            View Details →
            </span>
        </div>
    </Link>
  );
}
