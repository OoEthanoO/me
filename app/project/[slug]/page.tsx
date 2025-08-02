import { notFound } from 'next/navigation';
import { projects } from '../../../data/projects';
import { use } from 'react';

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const { slug } = use(params);

  const project = projects.find(
    (p) => slugify(p.title) === slug
  );

  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824] text-gray-100 px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg p-10 relative">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-lg">
          {project.title}
        </h1>
        <p className="text-lg text-gray-300 mb-6">{project.description}</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-block bg-gradient-to-r from-blue-700 to-fuchsia-700 text-xs font-semibold px-3 py-1 rounded-full text-white shadow"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap gap-2 items-center">
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
        <a
          href={project.github}
          className="inline-block mb-8 text-fuchsia-400 hover:text-fuchsia-200 underline font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub →
        </a>
        {project.images.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {project.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={project.title}
                className="w-40 h-40 object-contain rounded-lg border border-white/10 bg-white/10 shadow"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
