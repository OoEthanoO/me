import fs from 'fs';
import path from 'path';

const projectsUrl = new URL('./data/projects.ts', import.meta.url);
// Read the projects string
const raw = fs.readFileSync(projectsUrl, 'utf-8');

// I will just parse the JS object using a basic regex or naive eval
// Actually, since it's TypeScript, a naive eval is tricky because of the types.
// I will strip typescript and eval
let tsStripped = raw.replace(/export interface [^{]+\{[^}]+\}/g, '');
tsStripped = tsStripped.replace(/export const projects: Project\[\] = /g, 'const projects = ');
tsStripped = tsStripped.replace(/;/g, '');

const code = tsStripped + '\nreturn projects;';

const getProjects = new Function(code);
const projects = getProjects();

const outDir = path.join(process.cwd(), 'content/projects');
fs.mkdirSync(outDir, { recursive: true });

function slugify(title) {
    return title.toLowerCase().replace(/\s+/g, '-');
}

for (const p of projects) {
    const slug = slugify(p.title);
    // Re-map images to match keystatic config (just strings were in projects, we need to strip /)
    // Our Keystatic config for images: `publicPath: '/images/projects/'`, `directory: 'public/images/projects'`
    // Wait, existing images are like `/me.png`. Keystatic expects something else maybe.
    // Actually, I can just keep them as `/me.png` if it's text, but Keystatic image fields save just the filename and expect it in the directory.
    // We'll just leave string in JSON if possible. Keystatic just saves relative path `me.png` because publicPath is `/images/projects/`. 
    // Let's copy existing images to `public/images/projects` to match.

    const newImages = p.images.map(img => {
        const filename = path.basename(img);
        const oldPath = path.join(process.cwd(), 'public', img.replace(/^\//, ''));
        const newPath = path.join(process.cwd(), 'public/images/projects', filename);

        fs.mkdirSync(path.dirname(newPath), { recursive: true });
        if (fs.existsSync(oldPath)) {
            fs.copyFileSync(oldPath, newPath);
        }
        return filename;
    });

    const entry = {
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        collaborators: p.collaborators,
        github: p.github || null,
        website: p.website || null,
        images: newImages,
        status: p.status || null,
    };

    fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(entry, null, 2));
    console.log('Migrated', slug);
}
