"use client";

import { notFound } from 'next/navigation';
import { projects } from '../../../data/projects';
import { use, useRef, useState, MouseEvent } from 'react';

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const detailRef = useRef<HTMLDivElement>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (detailRef.current) {
      const rect = detailRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      detailRef.current.style.setProperty('--mouse-x', `${x}px`);
      detailRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const handleImageClick = (imageSrc: string) => {
    setExpandedImage(imageSrc);
    setIsClosing(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setExpandedImage(null);
      setIsClosing(false);
    }, 300);
  };

  const project = projects.find(
    (p) => slugify(p.title) === slug
  );

  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824] text-gray-100 px-4 py-12 flex flex-col items-center">
      <div 
        ref={detailRef}
        className="project-detail w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg p-10 relative"
        onMouseMove={handleMouseMove}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-lg">
            {project.title}
          </h1>
          <p className="text-lg text-gray-300 mb-6">{project.description}</p>
          <div className="mb-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="tech-tag inline-block bg-gradient-to-r from-blue-700 to-fuchsia-700 text-xs font-semibold px-3 py-1 rounded-full text-white shadow"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400">Collaborators:</span>
            {project.collaborators.map((collab) => (
              <a
                key={collab.name}
                href={collab.github}
                target="_blank"
                rel="noopener noreferrer"
                className="collaborator-tag inline-block bg-white/10 text-gray-200 text-xs px-2 py-1 rounded-full border border-white/10 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {collab.name}
              </a>
            ))}
          </div>
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400">Status:</span>
            {project.status && (
              <span
                className="inline-block bg-white/10 text-gray-200 text-xs px-2 py-1 rounded-full border border-white/10 hover:bg-white/20 hover:text-white transition-colors"
                style={{ animation: 'fadeIn 0.5s ease-out 1.3s', animationFillMode: 'both' }}
              >
                {project.status}
              </span>
            )}
          </div>
          {project.github ? (
            <a
              href={project.github}
              className="github-link inline-block mb-8 text-fuchsia-400 hover:text-fuchsia-200 underline font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          ) : (
            <div className="mb-2">
              <span
                className="github-link inline-block text-white font-medium text-base"
                style={{ opacity: 0.9 }}
                title="Closed Source"
              >
                Closed Source
              </span>
            </div>
          )}
          {project.website && (
            <div>
              <a
                href={project.website}
                className="github-link inline-block mb-8 text-fuchsia-400 hover:text-fuchsia-200 underline font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                style={{ animationDelay: "1.65s" }}
              >
                Visit Website →
              </a>
            </div>
          )}
          {project.images.length > 0 && (
            <div className="project-images flex flex-col gap-6">
              <div className="image-grid grid gap-4 md:gap-6">
                {project.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="image-container w-full rounded-2xl overflow-hidden border border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => handleImageClick(img)}
                  >
                    <img
                      src={img}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className="w-full h-auto object-cover rounded-2xl"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        const container = img.closest('.image-container') as HTMLElement;
                        const grid = img.closest('.image-grid') as HTMLElement;
                        
                        if (aspectRatio < 1.2) {
                          container.classList.add('portrait-image');
                          grid.classList.add('has-portrait-images');
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div 
          className={`image-modal fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ${isClosing ? 'closing' : ''}`}
          onClick={handleCloseModal}
        >
          <div 
            className="modal-content relative max-w-5xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-full ${isClosing ? 'closing' : ''}`}>
              <img
                src={expandedImage}
                alt={`${project.title} expanded`}
                className={`expanded-image w-full h-auto max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/20 ${isClosing ? 'closing' : ''}`}
              />
            </div>
          </div>
        </div>
      )}
      <div className="mt-12 flex justify-center">
        <a
          href="/"
          className="back-home-btn inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-semibold shadow hover:scale-105 transition-transform"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          Back to Home
        </a>
      </div>
    </main>
  );
}