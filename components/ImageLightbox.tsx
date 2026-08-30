"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Site-wide image enlargement. Mounted once in the layout and driven by a
 * single delegated click listener, so every image on the site opens without
 * each component having to wire up a handler of its own.
 *
 * Two escapes exist. Images inside a link are left alone — the link is what
 * the click was for — and anything under `[data-lightbox-skip]` is ignored, so
 * a page that already brings its own viewer keeps it.
 */
export default function ImageLightbox() {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const close = useCallback(() => {
    setIsClosing(true);
    // Matches the fade in globals.css, so the node leaves once it is invisible.
    window.setTimeout(() => {
      setSrc(null);
      setIsClosing(false);
    }, 300);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Modified clicks are the browser's to handle, not ours.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const image = target?.closest("img");
      if (!image) return;
      if (image.closest("a") || image.closest("[data-lightbox-skip]")) return;

      setSrc(image.currentSrc || image.src);
      setAlt(image.alt || "");
      setIsClosing(false);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!src) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    // Hold the page still behind the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [src, close]);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Enlarged image"}
      onClick={close}
      className={`image-modal fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/90 p-4 ${
        isClosing ? "closing" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        data-lightbox-skip=""
        onClick={(event) => event.stopPropagation()}
        className={`expanded-image h-auto max-h-[90vh] w-auto max-w-5xl border border-[var(--cream)]/25 object-contain ${
          isClosing ? "closing" : ""
        }`}
      />
    </div>
  );
}
