"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Order follows the sketch: wordmark left, these right. */
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tech/Project", href: "/tech" },
  { label: "Social Impact", href: "/social-impact" },
  { label: "Research", href: "/research" },
  { label: "Awards", href: "/awards" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--tan)]/30 bg-[var(--cream)]/90 backdrop-blur-md">
      {/* Full width rather than the 1180px content measure, so the wordmark
          sits near the page edge instead of indented with the copy. */}
      <div className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:gap-8 md:px-16 md:py-5">
        {/* Lulo Clean, the reference face, is caps-only and licensed; Poppins
            stands in, set in caps to read the same way. */}
        <Link
          href="/"
          className="shrink-0 font-[family-name:var(--font-poppins)] text-xl font-bold uppercase leading-[1.29] tracking-[0.02em] [word-spacing:0.35em] text-[var(--ink)] transition-colors hover:text-[var(--burgundy)] md:text-[1.6rem]"
        >
          Yan Xu
        </Link>

        {/* Five items crowd a phone, so the row scrolls sideways instead of wrapping.
            Set in the display face to match the wordmark; the rest of the
            site's small labels are Inter. Tracking is tightened as the size
            goes up. */}
        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
          <div className="flex items-center gap-5 whitespace-nowrap font-[family-name:var(--font-source-serif)] text-[1rem] font-semibold tracking-[0.04em] text-[var(--ink)]/85 lg:gap-7">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`border-b-2 pb-1 transition-colors ${
                    isActive
                      ? "border-[var(--burgundy)] text-[var(--burgundy)]"
                      : "border-transparent hover:text-[var(--burgundy)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
