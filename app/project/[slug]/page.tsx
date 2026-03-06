import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import ProjectDetailClient from './ProjectDetailClient';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const projectEntry = await reader.collections.projects.read(slug);
  if (!projectEntry) return notFound();

  // Map to the expected client component interface
  const project = {
    title: projectEntry.title,
    description: projectEntry.description,
    technologies: [...projectEntry.technologies],
    collaborators: [...projectEntry.collaborators],
    github: projectEntry.github,
    website: projectEntry.website,
    images: (projectEntry.images || []).map(img => `/images/projects/${img}`),
    status: projectEntry.status,
  };

  return <ProjectDetailClient project={project} />;
}

export async function generateStaticParams() {
  const projects = await reader.collections.projects.list();
  return projects.map((slug) => ({ slug }));
}
