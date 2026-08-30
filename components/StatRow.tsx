import type { ServiceStat } from "@/data/service";

/** Written out in full so Tailwind can see each class name literally. */
const columnsFor = (count: number) => {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-2 sm:grid-cols-3";
  // Six in a four-column grid leaves two empty tracks in the second row, which
  // the tint renders as bare tan blocks; three columns divide it evenly.
  if (count === 6) return "grid-cols-2 sm:grid-cols-3";
  return "grid-cols-2 sm:grid-cols-4";
};

/**
 * The hairline dividers are the parent tint showing through a 1px gap, not
 * borders. That means every track has to be covered by a cell — a fixed
 * four-column grid holding one stat renders its three empty tracks as a bare
 * tan block. Columns therefore follow the data, and the tint is only applied
 * when there is more than one cell to divide.
 */
export default function StatRow({
  stats,
  compact = false,
}: {
  stats: ServiceStat[];
  /** Smaller figures, for rows that sit inside a project entry rather than
   *  carrying a section on their own. */
  compact?: boolean;
}) {
  return (
    <div
      className={`-ml-4 grid gap-px ${columnsFor(stats.length)} ${
        stats.length > 1 ? "bg-[var(--tan)]/35" : ""
      }`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[var(--cream)] px-4 py-6">
          <p
            className={`font-display text-[var(--burgundy)] ${
              compact
                ? "text-[clamp(1.2rem,2.2vw,1.55rem)]"
                : "text-[clamp(1.8rem,3.6vw,2.6rem)]"
            }`}
          >
            {stat.value}
          </p>
          <p className="mt-2 text-[0.72rem] font-medium uppercase leading-snug tracking-[0.14em] text-[var(--ink)]/55">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
