import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--tan)]/30 bg-[var(--cream)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-display text-xl text-[var(--ink)] transition-colors hover:text-[var(--burgundy)]"
        >
          Ethan Yan Xu
        </Link>
        <div className="eyebrow flex items-center gap-7 text-[var(--ink)]/70">
          <Link
            href="/#work"
            className="transition-colors hover:text-[var(--burgundy)]"
          >
            Work
          </Link>
          <Link
            href="/#contact"
            className="transition-colors hover:text-[var(--burgundy)]"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
