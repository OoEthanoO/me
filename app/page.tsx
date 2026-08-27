import Link from "next/link";
import { projects } from "../data/projects";
import ProjectCard, { slugify } from "../components/ProjectCard";
import Reveal from "../components/Reveal";

export default function Home() {
  const flagship = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== flagship);

  return (
    <div>
      {/* ---- Hero: cream ground, the name set as large as the page allows ---- */}
      <section className="bg-[var(--cream)] px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-32">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow rise text-[var(--tan)]">Portfolio — Toronto</p>
          <h1
            className="font-display rise mt-6 text-[clamp(3.2rem,11vw,8rem)] text-[var(--burgundy)]"
            style={{ animationDelay: "0.1s" }}
          >
            Ethan Yan Xu
          </h1>
          <p
            className="rise mt-8 max-w-3xl text-[clamp(1.4rem,3.2vw,2.4rem)] font-light leading-snug text-[var(--ink)]"
            style={{ animationDelay: "0.22s" }}
          >
            A Toronto 11th grader writing CUDA kernels, shipping products, and
            teaching students for free.
          </p>
          <div
            className="rise mt-12 flex flex-wrap items-center gap-5"
            style={{ animationDelay: "0.34s" }}
          >
            <Link href="#work" className="btn btn-burgundy">
              See the Work
            </Link>
            <Link href="#contact" className="btn btn-outline text-[var(--ink)]">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Flagship: dark strip so the lead project owns its own screen ---- */}
      {flagship && (
        <section className="bg-[var(--navy)] px-6 py-28 text-[var(--cream)] md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-[var(--tan)]">Flagship Project</p>
              <h2 className="font-display mt-6 text-[clamp(2.6rem,6vw,4.4rem)]">
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

      {/* ---- Index of everything else ---- */}
      <section id="work" className="bg-[var(--cream)] px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <p className="eyebrow text-[var(--tan)]">Selected Work</p>
            <h2 className="font-display mt-6 max-w-3xl text-[clamp(2.6rem,6vw,4.4rem)] text-[var(--ink)]">
              Things I have built.
            </h2>
          </Reveal>

          <div className="mt-16 grid border-l border-t border-[var(--tan)]/35 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, idx) => (
              <Reveal key={project.title} delay={(idx % 3) * 0.08} className="h-full">
                <ProjectCard project={project} index={idx} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="eyebrow mt-16 text-[var(--tan)]">More coming soon</p>
          </Reveal>
        </div>
      </section>

      {/* ---- Closing strip ---- */}
      <section
        id="contact"
        className="bg-[var(--burgundy)] px-6 py-28 text-[var(--cream)] md:px-10 md:py-36"
      >
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <h2 className="font-display text-[clamp(3rem,8vw,6rem)]">
              Get in Touch.
            </h2>
            <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-[var(--cream)]/80">
              Always happy to talk about kernels, side projects, or anything
              worth building.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <a
                href="mailto:ethanxucoder@gmail.com"
                className="btn btn-cream"
              >
                Email Me
              </a>
              <a
                href="https://github.com/OoEthanoO"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-[var(--cream)]"
              >
                GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
