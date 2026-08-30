/**
 * The pages in the header, in the order the sketch puts them. Kept out of the
 * Navbar so that anything pointing back at a page — the back links on a
 * project write-up, for instance — can name it exactly as the nav does rather
 * than inventing a second name for the same place.
 */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tech/Project", href: "/tech" },
  { label: "Social Impact", href: "/social-impact" },
  { label: "Research", href: "/research" },
  { label: "Awards", href: "/awards" },
];

/** What the nav calls the page at `href`. */
export const pageName = (href: string) =>
  navLinks.find((link) => link.href === href)?.label ?? "Back";
