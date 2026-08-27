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
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10 md:py-5">
        <Link
          href="/"
          className="font-display shrink-0 text-2xl text-[var(--ink)] transition-colors hover:text-[var(--burgundy)] md:text-[2rem]"
        >
          Yan Xu
        </Link>

        {/* Five items crowd a phone, so the row scrolls sideways instead of wrapping.
            Sized explicitly rather than with .eyebrow, which is a step smaller. */}
        <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
          <div className="flex items-center gap-5 whitespace-nowrap text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]/70 lg:gap-7">
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
