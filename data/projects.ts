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
    title: "My Awesome Project",
    description: "A brief description of what this project does.",
    technologies: ["React", "TypeScript", "Next.js"],
    collaborators: ["Alice", "Bob"],
    github: "https://github.com/yourusername/awesome-project",
    images: ["/file.svg", "/globe.svg"]
  },
];
