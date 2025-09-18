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
  status?: string;
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
    images: ["/me.png"],
    status: "Perpetually Updated"
  },
  {
    title: "CORA",
    description: "A Python application for visualizing and assessing coastal flood risks using geospatial and infrastructure data.",
    technologies: ["Python", "PyQt6", "Matplotlib", "OSMnx","GeoPandas"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    github: "https://github.com/OoEthanoO/cora_project",
    images: ["/cora1.png", "/cora2.png", "/cora3.png", "/cora4.png", "/cora5.png"],
    status: "In Progress"
  },
  {
    title: "Dotfiles",
    description: "My personal Arch Linux dotfiles repository, showcasing my customized setup and configurations.",
    technologies: ["Hypr*", "Nvim", "Waybar"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    github: "https://github.com/OoEthanoO/dotfiles",
    images: ["/dotfiles1.png"],
    status: "Completed & Not Actively Maintained"
  },
  {
    title: "Ethan's Coding Class",
    description: "A web application for showcasing my volunteering work, managing my students, and allowing them to have a platform to learn coding and fundraise for SickKids.",
    technologies: ["React", "Firebase", "Express.js", "Node.js", "Nodemailer"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    images: ["/codingclass1.png", "/codingclass2.png", "/codingclass3.png"],
    website: "https://class.ethanyanxu.com/",
    status: "Completed & Actively Maintained",
  },
  {
    title: "Macam",
    description: "A macOS camera application that allow users to quickly snap pictures with a simple design.",
    technologies: ["Swift", "SwiftUI", "AppKit", "AVFoundation"],
    collaborators: [
      { name: "Dean", github: "https://github.com/Penguin60" }
    ],
    github: "https://github.com/STRNerds/Macam",
    images: ["/macam1.png"],
    status: "Stable & Actively Maintained",
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
    website: "https://dashboard.ethanyanxu.com",
    status: "Completed but Not Actively Maintained",
  },
  {
    title: "EthanToDoList",
    description: "An iOS todo list application that allows users to manage their tasks with smart and automatic time allocation and scheduling with handy features like Pomodoro streak tracking and daily progress tracking",
    technologies: ["Swift", "SwiftUI", "SwiftData", "UserNotifications", "AppStorage"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    images: ["/ethantodolist1.jpeg", "/ethantodolist2.jpeg", "/ethantodolist3.jpeg", "/ethantodolist4.jpeg", "/ethantodolist5.jpeg"],
    status: "Stable & Actively Maintained"
  },
  {
    title: "YanToDoList",
    description: "A web todo list application that allows users to manage their tasks with a smart task recommendation system",
    technologies: ["Next.js", "Tailwind CSS"],
    collaborators: [
      { name: "Solo", github: "https://github.com/OoEthanoO" }
    ],
    images: [],
    status: "Stable & Actively Maintained",
    website: "https://todo.ethanyanxu.com/"
  }
];
