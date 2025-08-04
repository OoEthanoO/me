import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  return (
    <main className="page-container min-h-screen bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824] text-gray-100 px-4 py-12">
      <header className="header-animation mb-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-lg">
          Ethan Yan Xu
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-6">
          A Toronto 11th grader with a passion for software
        </p>
        <a
          href="https://github.com/OoEthanoO"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20 hover:text-white hover:border-fuchsia-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        >
          <svg
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="transition-transform duration-300 group-hover:rotate-12"
          >
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </header>
      <div className="projects-grid grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <div className="mt-16 text-center text-lg text-fuchsia-400 font-medium animate-pulse">
        More coming soon!
      </div>
    </main>
  );
}