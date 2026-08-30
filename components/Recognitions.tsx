"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";

type Recognition = NonNullable<Project["recognitions"]>[number];

/**
 * The competitions an entry has been judged at, as a row of medals. Each one
 * opens its own note; pressing the open one again closes it, so the row costs
 * a line of height until someone asks for more.
 */
export default function Recognitions({ items }: { items: Recognition[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex === null ? null : items[openIndex];

  return (
    <div className="mt-8">
      <ul className="flex flex-wrap items-center gap-2.5">
        {items.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <li key={item.event}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                title={item.event}
                className={`inline-flex cursor-pointer items-center gap-2 border px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                  isOpen
                    ? "border-[var(--entry-accent)] bg-[var(--entry-accent)] text-[var(--entry-on-accent)]"
                    : "border-[var(--entry-rule)] text-[var(--entry-accent)] hover:border-[var(--entry-accent)]"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M8 2.5 L10.5 8" strokeLinecap="round" />
                  <path d="M16 2.5 L13.5 8" strokeLinecap="round" />
                  <circle cx="12" cy="15" r="6.2" />
                  <circle cx="12" cy="15" r="2.6" />
                </svg>
                {item.award}
              </button>
            </li>
          );
        })}
      </ul>

      {open && (
        <div className="mt-4 border-l-2 border-[var(--entry-accent)] pl-4">
          <p className="text-[0.95rem] leading-snug text-[var(--entry-ink)]">
            {open.event}
          </p>
          {open.detail && (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--entry-muted)]">
              {open.detail}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
