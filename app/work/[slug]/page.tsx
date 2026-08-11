import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BY_SLUG, PROJECTS, STATUS_LABEL } from '@/lib/data/projects';
import { STATION_BY_ID, decadeLabel } from '@/lib/scale';
import styles from './work.module.css';

export function generateStaticParams() {
  return PROJECTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = BY_SLUG.get(slug);
  if (!p) return { title: 'Not found' };
  return { title: p.name, description: p.tagline };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = BY_SLUG.get(slug);
  if (!p) notFound();

  const station = p.station ? STATION_BY_ID.get(p.station) : undefined;

  return (
    <main className={styles.page}>
      <nav className={styles.crumbs}>
        <Link href="/work">index</Link>
        <span aria-hidden="true">·</span>
        <Link href="/">the atlas</Link>
        {station ? (
          <>
            <span aria-hidden="true">·</span>
            <Link href={`/#${station.id}`}>{station.rule}</Link>
          </>
        ) : null}
      </nav>

      <header className={styles.head}>
        <h1 className={styles.title}>{p.name}</h1>
        <p className={styles.tagline}>{p.tagline}</p>
        <div className={styles.meta}>
          <span className={styles.status} data-status={p.status}>{STATUS_LABEL[p.status]}</span>
          <span>{p.years}</span>
          {p.z !== null ? <span>{decadeLabel(Math.round(p.z))}</span> : null}
          {p.commits ? <span>{p.commits} commits</span> : null}
          {p.isPrivate ? <span>private repo</span> : null}
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.main}>
          <p className={styles.summary}>{p.summary}</p>

          {p.point ? (
            <div className={styles.point}>
              <span className="label">Why it is here</span>
              <p>{p.point}</p>
            </div>
          ) : null}

          {p.caveat ? (
            <div className={styles.caveat}>
              <span className="label">What it does not do</span>
              <p>{p.caveat}</p>
            </div>
          ) : null}
        </div>

        <aside className={styles.side}>
          {p.metrics?.length ? (
            <>
              <span className="label">Measured</span>
              <table className="sheet">
                <tbody>
                  {p.metrics.map(m => (
                    <tr key={m.k} data-emph={m.emph ? 'true' : 'false'}>
                      <td>{m.k}</td>
                      <td className="n">
                        {m.v}
                        {m.unit ? <span className="unit"> {m.unit}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}

          <span className="label">Built with</span>
          <p className={styles.stack}>{p.stack.join(' · ')}</p>

          <div className={styles.links}>
            {p.live ? <a href={p.live} target="_blank" rel="noreferrer">visit it</a> : null}
            {p.repo ? <a href={p.repo} target="_blank" rel="noreferrer">source</a> : null}
          </div>
        </aside>
      </div>

      <nav className={styles.others}>
        <span className="label">Elsewhere on the axis</span>
        <ul>
          {PROJECTS.filter(o => o.slug !== p.slug)
            .slice(0, 8)
            .map(o => (
              <li key={o.slug}>
                <Link href={`/work/${o.slug}`}>{o.name}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </main>
  );
}
