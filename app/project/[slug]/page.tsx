"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../../data/projects";
import { use, useEffect, useState } from "react";

function markOrientation(img: HTMLImageElement) {
  if (!img.naturalWidth || !img.naturalHeight) return;
  if (img.naturalWidth / img.naturalHeight >= 1.2) return;

  img.closest(".image-container")?.classList.add("portrait-image");
  img.closest(".image-grid")?.classList.add("has-portrait-images");
}

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setExpandedImage(null);
      setIsClosing(false);
    }, 300);
  };

  // Escape closes the lightbox, matching the click-outside affordance.
  useEffect(() => {
    if (!expandedImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedImage]);

  const project = projects.find((p) => slugify(p.title) === slug);

  if (!project) return notFound();

  return (
    <div>
      {/* ---- Title band, coloured by whether the project is the flagship ---- */}
      <section
        className={`px-6 py-14 text-[var(--cream)] md:px-10 md:py-18 ${
          project.featured ? "bg-[var(--navy)]" : "bg-[var(--ink)]"
        }`}
      >
        <div className="mx-auto max-w-[1180px]">
          <Link
            href="/tech"
            className="eyebrow text-[var(--tan)] transition-colors hover:text-[var(--cream)]"
          >
            &#8592; All Work
          </Link>
          <p className="eyebrow mt-10 text-[var(--tan)]">
            {project.featured ? "Flagship Project" : "Project"}
          </p>
          <h1 className="font-display mt-5 text-[clamp(2.8rem,8vw,3.4rem)]">
            {project.title}
          </h1>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cream"
              >
                Visit Site
              </a>
            )}
            {/* Work split across repositories lists each; a single repo keeps
                the original button. Only genuinely unpublished work is marked
                closed source. */}
            {(() => {
              const repos =
                project.repositories ??
                (project.github
                  ? [{ label: "View on GitHub", url: project.github }]
                  : []);

              if (repos.length === 0) {
                return (
                  <span className="eyebrow text-[var(--cream)]/50">
                    Closed Source
                  </span>
                );
              }

              return repos.map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-[var(--cream)]"
                >
                  {repo.label}
                </a>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* ---- Write-up beside a sidebar of stack and collaborators ---- */}
      <section className="bg-[var(--cream)] px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto grid max-w-[1180px] gap-16 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-24">
          <div className="flex flex-col gap-6">
            {(project.longDescription ?? project.description)
              .split("\n\n")
              .map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-[1.05rem] font-light leading-[1.85] text-[var(--ink)]/85"
                >
                  {paragraph}
                </p>
              ))}
          </div>

          <aside className="flex flex-col gap-10 lg:border-l lg:border-[var(--tan)]/40 lg:pl-12">
            <div>
              <p className="eyebrow text-[var(--tan)]">Stack</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="text-sm font-medium text-[var(--ink)]/80"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            {project.collaborators.length > 0 && (
              <div>
                <p className="eyebrow text-[var(--tan)]">Collaborators</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {project.collaborators.map((collab) => (
                    <li key={collab.name}>
                      {collab.github ? (
                        <a
                          href={collab.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[var(--ink)]/80 underline decoration-[var(--tan)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
                        >
                          {collab.name}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-[var(--ink)]/80">
                          {collab.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* ---- Screenshots ---- */}
      {project.images.length > 0 && (
        <section className="bg-[var(--cream-deep)] px-6 py-14 md:px-10 md:py-18">
          <div className="mx-auto max-w-[1180px]">
            <p className="eyebrow text-[var(--tan)]">Screens</p>
            <div className="image-grid mt-10">
              {project.images.map((img, idx) => (
                <div
                  key={idx}
                  className="image-container w-full cursor-pointer overflow-hidden border border-[var(--tan)]/40 bg-[var(--cream)]"
                  data-lightbox-skip=""
                  onClick={() => {
                    setExpandedImage(img);
                    setIsClosing(false);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="h-auto w-full object-cover"
                    ref={(el) => {
                      // Cached images can finish loading before React attaches
                      // onLoad, so classify those here instead.
                      if (el?.complete) markOrientation(el);
                    }}
                    onLoad={(e) => markOrientation(e.currentTarget)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--burgundy)] px-6 py-20 text-[var(--cream)] md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <Link href="/tech" className="btn btn-cream">
            &#8592; Back to All Work
          </Link>
        </div>
      </section>

      {expandedImage && (
        <div
          className={`image-modal fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/90 p-4 ${
            isClosing ? "closing" : ""
          }`}
          onClick={handleCloseModal}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={expandedImage}
            alt={`${project.title} expanded`}
            onClick={(e) => e.stopPropagation()}
            className={`expanded-image h-auto max-h-[90vh] w-auto max-w-5xl border border-[var(--cream)]/25 object-contain ${
              isClosing ? "closing" : ""
            }`}
          />
        </div>
      )}
    </div>
  );
}
