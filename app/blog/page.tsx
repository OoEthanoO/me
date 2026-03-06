import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function Blog() {
    const posts = await reader.collections.posts.all();

    return (
        <main className="page-container min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <Navbar />

                <header className="header-animation mt-14">
                    <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
                        Blog
                    </h1>
                    <p className="mt-4 text-lg text-[#6e6e73]">
                        Writing on software, design, and other thoughts.
                    </p>
                </header>

                <section className="mt-16">
                    <div className="grid gap-8">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`}>
                                <div className="group rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
                                    <h2 className="text-2xl font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                                        {post.entry.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-[#86868b]">
                                        {post.entry.date}
                                    </p>
                                </div>
                            </Link>
                        ))}
                        {posts.length === 0 && (
                            <p className="text-[#86868b]">No posts yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
