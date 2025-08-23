import Link from 'next/link';
import { gears } from '@/data/gear';
import { achievements } from '@/data/achievements';

export default function About() {
  return (
    <main className="page-container min-h-screen bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824] text-gray-100 px-4 py-12">
      <header className="header-animation mb-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-500 text-transparent bg-clip-text drop-shadow-lg">
          About Me
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-6">
          A Toronto 11th grader with a passion for software development.
        </p>
      </header>
      <section className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-lg project-detail">
        <div className="project-detail-content">
          <h2 className="text-3xl font-bold mb-4 text-fuchsia-400">Bio</h2>
          <p className="text-gray-300 mb-6">
            Hi, I&apos;m Ethan Yan Xu, a high school student from Toronto passionate about building innovative software solutions. I enjoy working on projects that solve real-world problems and exploring new technologies.
          </p>
          <h2 className="text-3xl font-bold mb-4 text-fuchsia-400">Achievements & Scores</h2>
          <ul className="space-y-2 text-gray-300 mb-6">
            {achievements.map((ach, index) => (
              <li key={index} className="bg-white/5 p-2 rounded-lg border border-white/10">
                {ach.name}: {ach.result}
              </li>
            ))}
          </ul>
          <h2 className="text-3xl font-bold mb-4 text-fuchsia-400">Interests</h2>
          <p className="text-gray-300 mb-6">
            Outside of coding, I enjoy volunteering, learning about AI, contributing to open-source projects, and playing badminton.
          </p>
          <h2 className="text-3xl font-bold mb-4 text-fuchsia-400">Technology Gear and Setup</h2>
          <ul className="space-y-2 text-gray-300 mb-6">
            {gears.map((gear, index) => (
              <li key={index} className="bg-white/5 p-2 rounded-lg border border-white/10">
                {gear.category}: {gear.model}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="mt-12 flex justify-center">
        <Link
          href="/"
          className="back-home-btn inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-semibold shadow hover:scale-105 transition-transform"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}