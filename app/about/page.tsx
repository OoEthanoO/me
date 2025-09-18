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
            Outside of coding, I enjoy volunteering, listening to music, learning about AI, and playing badminton.
          </p>
          
          <h2 className="text-3xl font-bold mb-6 text-fuchsia-400">Favorite Music</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-fuchsia-400/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Favorite Song of All Time</h3>
              <div className="mb-4 space-y-1">
                <p className="text-gray-200 font-medium">This Feels Like the End</p>
                <p className="text-gray-400 text-sm">Nothing But Thieves • Moral Panic</p>
                <p className="text-gray-500 text-xs">Alternative • 2020</p>
                <p className="text-gray-600 text-xs font-light italic">Hard Rock • Indie Rock • Pop Rock</p>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe 
                  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                  frameBorder="0" 
                  height="175" 
                  width="100%"
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                  src="https://embed.music.apple.com/ca/song/this-feels-like-the-end/1519414142"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-fuchsia-400/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Recently Discovered Favorite</h3>
              <div className="mb-4 space-y-1">
                <p className="text-gray-200 font-medium">Stop Beating on My Heart (Like a Bass Drum)</p>
                <p className="text-gray-400 text-sm">Tigercub • As Blue as Indigo</p>
                <p className="text-gray-500 text-xs">Rock • 2021</p>
                <p className="text-gray-600 text-xs font-light italic">Grunge • Stoner Rock • Psychedelic Rock</p>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe 
                  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                  frameBorder="0" 
                  height="175" 
                  width="100%"
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                  src="https://embed.music.apple.com/ca/album/stop-beating-on-my-heart-like-a-bass-drum/1547326193?i=1547326449"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-fuchsia-400">Favorite Music Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            <div className="group bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-4 hover:border-blue-400/60 hover:bg-blue-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">Alternative Rock</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/60 hover:bg-purple-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">Indie Rock</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/10 border border-fuchsia-500/30 rounded-lg p-4 hover:border-fuchsia-400/60 hover:bg-fuchsia-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-fuchsia-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">Pop</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-400/60 hover:bg-cyan-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">Psychedelic Rock</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-4 hover:border-emerald-400/60 hover:bg-emerald-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">Hip-hop</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-4 hover:border-orange-400/60 hover:bg-orange-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">R&B</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-lg p-4 hover:border-pink-400/60 hover:bg-pink-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">Soul</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30 rounded-lg p-4 hover:border-violet-400/60 hover:bg-violet-500/25 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-400 rounded-full group-hover:scale-110 transition-transform"></div>
                <span className="text-gray-200 font-medium text-sm">Progressive Rock</span>
              </div>
            </div>
          </div>
          
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