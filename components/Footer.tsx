import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t border-black/5 bg-[#f5f5f7]">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-[#6e6e73]">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs uppercase tracking-[0.2em] text-[#86868b]">
            Ethan Yan Xu
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/OoEthanoO"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/yan-xu-b0143230b/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:ethanxucoder@gmail.com"
              className="font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
            >
              Email
            </a>
          </div>
          <p className="text-xs text-[#86868b]">
            © {new Date().getFullYear()} Ethan Yan Xu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
