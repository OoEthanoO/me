import { notFound } from 'next/navigation';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Navbar from '@/components/Navbar';
import { DocumentRenderer } from '@keystatic/core/renderer';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await reader.collections.posts.read(slug);

    if (!post) return notFound();

    return (
        <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
            <div className="mx-auto max-w-4xl px-6 py-12">
                <Navbar />
                <div className="mt-14 rounded-[32px] border border-black/5 bg-white p-10 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
                    <article className="prose prose-lg max-w-none">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
                            {post.title}
                        </h1>
                        <p className="text-[#86868b] mb-10">{post.date}</p>
                        <div className="mt-8">
                            <DocumentRenderer document={await post.content()} />
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}

export async function generateStaticParams() {
    const posts = await reader.collections.posts.list();
    return posts.map((slug) => ({ slug }));
}
