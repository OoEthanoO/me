export interface Collaborator {
  name: string;
  github: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  collaborators: Collaborator[];
  github?: string;
  website?: string;
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
    website: "https://www.ethanyanxu.com",
    images: ["/me.png"]
  },
  {
    title: "CORA",
    description: "A Python application for visualizing and assessing coastal flood risks using geospatial and infrastructure data.",
    technologies: ["Python", "PyQt6", "Matplotlib", "OSMnx","GeoPandas"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    images: ["/cora1.png", "/cora2.png", "/cora3.png"]
  },
  {
    title: "Dotfiles",
    description: "My personal Arch Linux dotfiles repository, showcasing my customized setup and configurations.",
    technologies: ["Hypr*", "Nvim", "Waybar"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    github: "https://github.com/OoEthanoO/dotfiles",
    images: ["/dotfiles1.png"]
  },
  {
    title: "Ethan's Coding Class",
    description: "A web application for showcasing my volunteering work, managing my students, and allowing them to have a platform to learn coding and fundraise for SickKids.",
    technologies: ["React", "Firebase", "Express.js", "Node.js", "Nodemailer"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    images: ["/codingclass1.png", "/codingclass2.png", "/codingclass3.png"],
    website: "https://class.ethanyanxu.com/"
  },
  {
    title: "Macam",
    description: "A macOS camera application that allow users to quickly snap pictures with a simple design.",
    technologies: ["Swift", "SwiftUI", "AppKit", "AVFoundation"],
    collaborators: [
      { name: "Dean", github: "https://github.com/Penguin60" }
    ],
    github: "https://github.com/STRNerds/Macam",
    images: ["/macam1.png"]
  },
  {
    title: "YanDashboard",
    description: "An web application and academic productivity helper that allows students to track assignments, manage courses, and log study sessions in an environment that ensures privacy with E2E encryption.",
    technologies: ["React Native", "Expo", "MongoDB", "Node.js", "TypeScript"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    github: "https://github.com/OoEthanoO/yan-dashboard",
    images: ["/yandashboard1.png", "/yandashboard2.png", "/yandashboard3.png"],
    website: "https://www.yandashboard.com/"
  },
];
