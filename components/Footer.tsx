import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 text-center text-gray-400 text-sm bg-[#181824]">
      <div className="flex justify-center gap-6 mb-4">
        <a href="https://github.com/OoEthanoO" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition-colors">GitHub</a>
        <a href="https://www.linkedin.com/in/ethan-yan-xu-b0143230b/" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition-colors">LinkedIn</a>
      </div>
      <p>&copy; {new Date().getFullYear()} Ethan Yan Xu. All Rights Reserved.</p>
      <p className="mt-2 text-xs text-gray-500">
        Inspired by the Hyprland website.
      </p>
    </footer>
  );
};

export default Footer;