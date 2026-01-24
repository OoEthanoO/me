import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between text-sm text-[#6e6e73]">
      <Link
        href="/"
        className="uppercase tracking-[0.2em] transition-colors hover:text-[#1d1d1f]"
      >
        Portfolio
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/about" className="transition-colors hover:text-[#1d1d1f]">
          About
        </Link>
        <a
          href="mailto:ethanxucoder@gmail.com"
          className="transition-colors hover:text-[#1d1d1f]"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
