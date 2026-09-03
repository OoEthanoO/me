"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Re-runs the jump to `#anchor` once the pictures above it have loaded.
 *
 * None of the site's images declare their dimensions, so when a link lands on
 * a page at a hash the browser scrolls while every picture above the target is
 * still zero-height. On a page carrying enough of them that target is past the
 * bottom of the short layout, the scroll clamps to the end of the document,
 * and nothing re-runs it once the images arrive and the page grows — so
 * /tech#stroj finished at the foot of the page rather than on the entry.
 *
 * Scrolling again on load fixes every anchor on the site at once. It is left
 * to the browser on the first paint — that is right whenever the layout is
 * already settled, and this only corrects it afterwards.
 */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const jump = () => {
      // The id can be missing: a stale link, or a hash meant for another page.
      const target = document.getElementById(
        decodeURIComponent(hash.slice(1)),
      );
      target?.scrollIntoView();
    };

    // A page whose images are already cached never fires `load` again, so the
    // first pass runs now and the listener only covers the uncached visit.
    jump();
    if (document.readyState === "complete") return;

    window.addEventListener("load", jump);
    return () => window.removeEventListener("load", jump);
  }, [pathname]);

  return null;
}
