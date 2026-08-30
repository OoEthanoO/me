"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Order follows the sketch: wordmark left, these right. */
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tech/Project", href: "/tech" },
  { label: "Social Impact", href: "/social-impact" },
  { label: "Research", href: "/research" },
  { label: "Awards", href: "/awards" },
];

/**
 * The sections of /tech, in the order they appear on the page. The first entry
 * is the page itself, so opening the menu never costs you the plain link.
 */
const techSections = [
  { label: "All Projects", href: "/tech" },
  { label: "Environment", href: "/tech#environment" },
  { label: "Robotics", href: "/tech#robotics" },
  { label: "Used by Peers", href: "/tech#used-by-peers" },
  { label: "Other", href: "/tech#other" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Escape puts the menu away; hovering out is handled on the wrapper itself.
  useEffect(() => {
    if (!openMenu) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu]);

  // Jumping to a section does not change the path, so close on any navigation.
  useEffect(() => setOpenMenu(false), [pathname]);

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

              const underline = `border-b-2 pb-1 transition-colors ${
                isActive
                  ? "border-[var(--burgundy)] text-[var(--burgundy)]"
                  : "border-transparent hover:text-[var(--burgundy)]"
              }`;

              // Tech/Project still navigates on click; hovering it reveals
              // the sections of that page underneath.
              if (link.href === "/tech") {
                return (
                  <div
                    key={link.href}
                    ref={menuRef}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(true)}
                    onMouseLeave={() => setOpenMenu(false)}
                    // Keyboard users get the same menu on focus; blur only
                    // closes it once focus has left the group entirely.
                    onFocus={() => setOpenMenu(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setOpenMenu(false);
                      }
                    }}
                  >
                    <Link
                      href={link.href}
                      aria-haspopup="menu"
                      aria-expanded={openMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={`${underline} inline-flex items-center gap-1.5`}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={`text-[0.7em] transition-transform ${
                          openMenu ? "rotate-180" : ""
                        }`}
                      >
                        &#9662;
                      </span>
                    </Link>

                    {openMenu && (
                      /* The gap between the trigger and the panel is padding
                         on this wrapper rather than a margin, so the pointer
                         never crosses dead space on its way down. */
                      <div className="absolute left-0 top-full z-50 pt-3">
                        <div
                          role="menu"
                          className="min-w-[13rem] border border-[var(--tan)]/45 bg-[var(--cream)] py-1.5 shadow-[0_18px_40px_rgba(40,41,54,0.14)]"
                        >
                          {techSections.map((section) => (
                            <Link
                              key={section.href}
                              role="menuitem"
                              href={section.href}
                              onClick={() => setOpenMenu(false)}
                              className="block px-5 py-2.5 text-[0.9rem] font-normal text-[var(--ink)]/80 transition-colors hover:bg-[var(--cream-deep)] hover:text-[var(--burgundy)]"
                            >
                              {section.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={underline}
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
