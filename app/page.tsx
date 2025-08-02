import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  return (
    <main className="page-container min-h-screen bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824] text-gray-100 px-4 py-12">
      <header className="header-animation mb-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-lg">
          Ethan Xu
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          A Toronto 10th grader with a passion for software
        </p>
      </header>
      <div className="projects-grid grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </main>
  );
}