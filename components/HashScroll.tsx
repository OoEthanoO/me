"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Keeps `#anchor` aligned while the content above it finishes laying out.
 *
 * None of the site's images declare their dimensions, so when a link lands on
 * a page at a hash the browser scrolls while every picture above the target is
 * still zero-height. On a page carrying enough of them that target is past the
 * bottom of the short layout, the scroll clamps to the end of the document,
 * and nothing re-runs it once the images arrive and the page grows — so
 * /tech#stroj finished at the foot of the page rather than on the entry.
 *
 * `window.load` is not enough here: a Next.js client-side navigation happens
 * after that one-time event. A ResizeObserver catches the later image-driven
 * layout changes instead, and disconnects as soon as the page has held still.
 */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let stopCorrection: (() => void) | undefined;

    const correctHash = () => {
      stopCorrection?.();

      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;

      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }

      // The id can be missing: a stale link, or a hash meant for another page.
      const target = document.getElementById(id);
      if (!target) return;

      let frame = 0;
      let settleTimer = 0;
      let limitTimer = 0;
      let targetTop = target.getBoundingClientRect().top + window.scrollY;

      const pendingImages = new Set(
        [...document.images].filter(
          (image) =>
            !image.complete &&
            Boolean(
              image.compareDocumentPosition(target) &
                Node.DOCUMENT_POSITION_FOLLOWING,
            ),
        ),
      );

      const jump = () => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => target.scrollIntoView());
      };

      const settle = (event: Event) => {
        pendingImages.delete(event.currentTarget as HTMLImageElement);
        if (pendingImages.size === 0) {
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(stop, 250);
        }
      };

      // Follow only changes that actually move the target. A resize below it,
      // or the visitor scrolling by hand, must not pull the page back.
      const observer = new ResizeObserver(() => {
        const nextTop = target.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(nextTop - targetTop) > 1) {
          targetTop = nextTop;
          jump();
        }

        if (pendingImages.size === 0) {
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(stop, 250);
        }
      });

      const stop = () => {
        observer.disconnect();
        pendingImages.forEach((image) => {
          image.removeEventListener("load", settle);
          image.removeEventListener("error", settle);
        });
        window.cancelAnimationFrame(frame);
        window.clearTimeout(settleTimer);
        window.clearTimeout(limitTimer);
      };

      stopCorrection = stop;
      observer.observe(document.body);
      pendingImages.forEach((image) => {
        image.addEventListener("load", settle, { once: true });
        image.addEventListener("error", settle, { once: true });
      });
      jump();

      if (pendingImages.size === 0) {
        settleTimer = window.setTimeout(stop, 250);
      }

      // Do not retain an observer indefinitely if a page keeps changing for a
      // reason unrelated to loading its initial content.
      limitTimer = window.setTimeout(stop, 15000);
    };

    correctHash();
    window.addEventListener("hashchange", correctHash);

    return () => {
      window.removeEventListener("hashchange", correctHash);
      stopCorrection?.();
    };
  }, [pathname]);

  return null;
}
