export interface Project {
  title: string;
  description: string;
  technologies: string[];
  collaborators: string[];
  github: string;
  images: string[];
}

export const projects: Project[] = [
  {
    title: "Me",
    description: "A portfolio website showcasing my projects and skills.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    collaborators: ["Solo"],
    github: "https://github.com/yourusername/awesome-project",
    images: ["/test.png"]
  },
];
