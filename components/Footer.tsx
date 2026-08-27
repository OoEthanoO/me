const links = [
  { label: "GitHub", href: "https://github.com/OoEthanoO" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yan-xu-b0143230b/" },
  { label: "Email", href: "mailto:ethanxucoder@gmail.com" },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-[var(--cream)]/15 bg-[var(--ink)] text-[var(--cream)]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:px-10">
        <p className="font-display text-lg">Ethan Yan Xu</p>
        <div className="eyebrow flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-[var(--cream)]/70 transition-colors hover:text-[var(--tan)]"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-xs tracking-widest text-[var(--cream)]/50">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
