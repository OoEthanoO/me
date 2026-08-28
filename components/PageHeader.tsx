/** Shared masthead for the category pages. */
interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  lede?: string;
}

export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <section className="bg-[var(--cream)] px-6 pb-8 pt-12 md:px-10 md:pb-10 md:pt-14">
      <div className="mx-auto max-w-[1180px]">
        {eyebrow && <p className="eyebrow rise text-[var(--tan)]">{eyebrow}</p>}
        {/* Sized to match the nav wordmark exactly, at both breakpoints. */}
        <h1
          className={`font-display rise max-w-4xl text-xl text-[var(--burgundy)] md:text-[1.6rem] ${
            eyebrow ? "mt-6" : ""
          }`}
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
