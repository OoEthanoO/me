/** Shared masthead for the category pages, so they all open on the same beat. */
interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lede?: string;
}

export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <section className="bg-[var(--cream)] px-6 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow rise text-[var(--tan)]">{eyebrow}</p>
        <h1
          className="font-display rise mt-6 max-w-4xl text-[clamp(2.8rem,8vw,6rem)] text-[var(--burgundy)]"
          style={{ animationDelay: "0.1s" }}
        >
          {title}
        </h1>
        {lede && (
          <p
            className="rise mt-8 max-w-3xl text-[clamp(1.1rem,2.2vw,1.5rem)] font-light leading-relaxed text-[var(--ink)]/80"
            style={{ animationDelay: "0.2s" }}
          >
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
