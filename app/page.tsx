import ProjectCard from '../components/ProjectCard';
import Navbar from '@/components/Navbar';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function Home() {
  const projectsData = await reader.collections.projects.all();
  // Map Keystatic format to match the old Project interface used by ProjectCard
  const projects = projectsData.map(p => ({
    title: p.entry.title,
    description: p.entry.description,
    technologies: [...p.entry.technologies],
    collaborators: p.entry.collaborators.map(c => ({
      name: c.name,
      github: c.github || ''
    })),
    github: p.entry.github || undefined,
    website: p.entry.website || undefined,
    images: (p.entry.images || []).map(img => `/images/projects/${img}`),
    status: p.entry.status || undefined,
    slug: p.slug
  }));

  return (
    <main className="page-container min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Navbar />

        <header className="header-animation mt-14">
          <h1 className="mt-4 text-5xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f]">
            Ethan Yan Xu
          </h1>
          <p className="mt-6 text-xl text-[#6e6e73] max-w-2xl">
            A Toronto 11th grader with a passion for software.
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
