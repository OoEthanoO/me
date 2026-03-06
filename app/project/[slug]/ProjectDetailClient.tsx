"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ProjectDetailClient({ project }: { project: any }) {
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);

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

    return (
        <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <Navbar />
                <div className="project-detail mt-8 rounded-[32px] border border-black/5 bg-white p-10 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
                    <div className="project-detail-content">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#86868b]">Project</p>
                        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
                            {project.title}
                        </h1>
                        <p className="mt-4 text-lg text-[#6e6e73]">{project.description}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {project.technologies.map((tech: string) => (
                                <span
                                    key={tech}
                                    className="tech-tag inline-flex items-center rounded-full border border-black/10 bg-[#f5f5f7] px-3 py-1 text-[11px] font-semibold text-[#1d1d1f]"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2 items-center">
                            <span className="text-[11px] uppercase tracking-[0.2em] text-[#86868b]">Collaborators</span>
                            {project.collaborators.map((collab: any) => (
                                <a
                                    key={collab.name}
                                    href={collab.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="collaborator-tag inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-[#1d1d1f] hover:border-black/20 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {collab.name}
                                </a>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2 items-center">
                            <span className="text-[11px] uppercase tracking-[0.2em] text-[#86868b]">Status</span>
                            {project.status && (
                                <span
                                    className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-[#1d1d1f]"
                                    style={{ animation: 'fadeIn 0.5s ease-out 1.3s', animationFillMode: 'both' }}
                                >
                                    {project.status}
                                </span>
                            )}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                            {project.github ? (
                                <a
                                    href={project.github}
                                    className="github-link inline-flex items-center text-sm font-semibold text-[#1d1d1f] transition-colors hover:text-[#0071e3]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on GitHub
                                </a>
                            ) : (
                                <span className="github-link inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#1d1d1f]">
                                    Closed Source
                                </span>
                            )}
                            {project.website && (
                                <a
                                    href={project.website}
                                    className="github-link inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#1d1d1f] hover:border-black/20 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ animationDelay: "1.65s" }}
                                >
                                    Visit Website
                                </a>
                            )}
                        </div>
                        {project.images.length > 0 && (
                            <div className="project-images mt-10 flex flex-col gap-6">
                                <div className="image-grid grid gap-4 md:gap-6">
                                    {project.images.map((img: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="image-container w-full overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.08)] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                                            onClick={() => handleImageClick(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${project.title} screenshot ${idx + 1}`}
                                                className="w-full h-auto object-cover"
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
                                    className={`expanded-image w-full h-auto max-h-[90vh] object-contain rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/20 ${isClosing ? 'closing' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
