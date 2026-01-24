import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="page-container min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Navbar />

        <header className="header-animation mt-14">
          <h1 className="mt-4 text-5xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f]">
            Ethan Yan Xu
          </h1>
          <p className="mt-6 text-xl text-[#6e6e73] max-w-2xl">
            A Toront 11th grader with a passion for software.
          </p>
          <div className="mt-10"></div>
        </header>

        <section className="projects-grid mt-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f]">Selected Projects</h2>
            </div>
            <a href="/about" className="text-sm font-semibold text-[#0071e3] hover:underline">
              More about me →
            </a>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <div className="mt-16 text-center text-sm text-[#6e6e73]">
          More coming soon.
        </div>
      </div>
    </main>
  );
}
