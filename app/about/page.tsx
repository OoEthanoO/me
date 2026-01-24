import Link from 'next/link';
import { gears } from '@/data/gear';
import { achievements } from '@/data/achievements';

export default function About() {
  return (
    <main className="page-container min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-[#0071e3] hover:underline">
          ← Back to home
        </Link>
        <header className="header-animation mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#86868b]">About</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            About
          </h1>
        </header>

        <section className="mt-10 grid gap-8">
          <div className="project-detail rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_18px_35px_rgba(0,0,0,0.08)]">
            <div className="project-detail-content">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Bio</h2>
              <p className="mt-3 text-[#6e6e73]">
                Hi, I&apos;m Ethan Yan Xu, a high school student from Toronto passionate about building
                innovative software solutions. I enjoy working on projects that solve real-world
                problems and exploring new technologies.
              </p>
            </div>
          </div>

          <div className="project-detail rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_18px_35px_rgba(0,0,0,0.08)]">
            <div className="project-detail-content">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Achievements & Scores</h2>
              <ul className="mt-4 space-y-3 text-[#1d1d1f]">
                {achievements.map((ach, index) => (
                  <li key={index} className="rounded-2xl border border-black/5 bg-[#f5f5f7] px-4 py-3 text-sm text-[#1d1d1f]">
                    <span className="font-semibold">{ach.name}</span>
                    <span className="text-[#6e6e73]"> · {ach.result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="project-detail rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_18px_35px_rgba(0,0,0,0.08)]">
            <div className="project-detail-content">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Interests</h2>
              <p className="mt-3 text-[#6e6e73]">
                Outside of coding, I enjoy volunteering, listening to music, learning about AI, and
                playing badminton.
              </p>
            </div>
          </div>

          <div className="project-detail rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_18px_35px_rgba(0,0,0,0.08)]">
            <div className="project-detail-content">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Favorite Music</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-[24px] border border-black/5 bg-[#f5f5f7] p-6">
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">Favorite Song of All Time</h3>
                  <div className="mt-3 space-y-1 text-sm text-[#6e6e73]">
                    <p className="text-[#1d1d1f] font-semibold">This Feels Like the End</p>
                    <p>Nothing But Thieves · Moral Panic</p>
                    <p>Alternative · 2020</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#86868b]">
                      Hard Rock · Indie Rock · Pop Rock
                    </p>
                  </div>
                  <iframe 
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                    frameBorder="0" 
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                    src="https://embed.music.apple.com/ca/song/this-feels-like-the-end/1519414142"
                    className="mt-4 w-full rounded-xl border border-black/5 bg-white"
                  ></iframe>
                </div>

                <div className="rounded-[24px] border border-black/5 bg-[#f5f5f7] p-6">
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">Recently Discovered Favorite</h3>
                  <div className="mt-3 space-y-1 text-sm text-[#6e6e73]">
                    <p className="text-[#1d1d1f] font-semibold">Save Me (I'm Not Crazy)</p>
                    <p>Electric Enemy · Electric Enemy</p>
                    <p>Rock · 2023</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#86868b]">
                      Alternative Rock · Indie Rock · Garage Rock
                    </p>
                  </div>
                  <iframe 
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                    frameBorder="0" 
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                    src="https://embed.music.apple.com/ca/album/save-me-im-not-crazy/1660786624?i=1660787010"
                    className="mt-4 w-full rounded-xl border border-black/5 bg-white"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="project-detail rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_18px_35px_rgba(0,0,0,0.08)]">
            <div className="project-detail-content">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Technology Gear and Setup</h2>
              <ul className="mt-4 space-y-3 text-[#1d1d1f]">
                {gears.map((gear, index) => (
                  <li key={index} className="rounded-2xl border border-black/5 bg-[#f5f5f7] px-4 py-3 text-sm text-[#1d1d1f]">
                    <span className="font-semibold">{gear.category}</span>
                    <span className="text-[#6e6e73]"> · {gear.model}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
