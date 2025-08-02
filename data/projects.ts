export interface Collaborator {
  name: string;
  github: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  collaborators: Collaborator[];
  github: string;
  images: string[];
}

export const projects: Project[] = [
  {
    title: "Me",
    description: "A portfolio website for showcasing my projects and skills.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    github: "https://github.com/OoEthanoO/me",
    images: ["/me.png"]
  },
  {
    title: "CORA",
    description: "A Python application for visualizing and assessing coastal flood risks using geospatial and infrastructure data.",
    technologies: ["Python", "PyQt6", "Matplotlib", "OSMnx","GeoPandas"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    github: "https://github.com/OoEthanoO/cora_project",
    images: ["/cora1.png", "/cora2.png", "/cora3.png"]
  }
];