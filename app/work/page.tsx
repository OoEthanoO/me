import Link from 'next/link';
import type { Metadata } from 'next';
import { PROJECTS, SCRAPPED, STATUS_LABEL, type Project } from '@/lib/data/projects';
import { PROFILE, PAPER, RECORD, RETRACTIONS } from '@/lib/data/profile';
import { decadeLabel } from '@/lib/scale';
import styles from './work-index.module.css';

export const metadata: Metadata = {
  title: 'Index',
  description:
    'Every project, in one dense list: what it is, what it measured, and what it does not do.',
};

/**
 * The counterweight to the traverse.
 *
 * The scale atlas is the argument; this is the reference. Someone with thirty
 * seconds and a hiring decision should be able to read this page top to bottom
 * and miss nothing, with no scrolling mechanic, no canvas and no JavaScript.
 */
export default function IndexPage() {
  const live = PROJECTS.filter(p => p.status === 'live' || p.status === 'research');
  const rest = PROJECTS.filter(p => p.status !== 'live' && p.status !== 'research');

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Ethan Yan Xu</h1>
          <p className={styles.sub}>
            High school, Toronto. Builds things, then measures whether they work.
          </p>
        </div>
        <nav className={styles.nav}>
          <Link href="/">the atlas</Link>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">github</a>
          <a href={`mailto:${PROFILE.email}`}>email</a>
        </nav>
      </header>

      <section className={styles.section}>
        <h2 className="label">Published</h2>
        <div className={styles.paper}>
          <p className={styles.paperTitle}>{PAPER.title}</p>
          <p className={styles.paperCite}>
            {PAPER.author} · <em>{PAPER.journal}</em>, {PAPER.volume}, {PAPER.pages}
          </p>
          <p className={styles.paperLinks}>
            <a href={PAPER.pdf}>pdf</a>
            <a href={PAPER.issue} target="_blank" rel="noreferrer">the issue</a>
            <Link href="/work/water-level">notes</Link>
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="label">Running now</h2>
        <ol className={styles.list}>
          {live.map(p => <Row key={p.slug} p={p} />)}
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className="label">Everything else</h2>
        <ol className={styles.list}>
          {rest.map(p => <Row key={p.slug} p={p} />)}
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className="label">The record</h2>
        <table className="sheet">
          <tbody>
            {RECORD.map(r => (
              <tr key={r.name}>
                <td>{r.name}{r.year ? <span className={styles.dim}> {r.year}</span> : null}</td>
                <td className="n">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className="label">Scrapped</h2>
        <p className={styles.blurb}>
          A portfolio that hides what was abandoned is a brochure. Every one of these ran, every one
          got measured, and every one was set down. What it reached is on the left, why it stopped
          is underneath.
        </p>
        <ol className={styles.list}>
          {SCRAPPED.map(s => (
            <li key={s.name} className={styles.dead}>
              <span className={styles.deadName}>{s.name}</span>
              <span className={styles.deadWhat}>{s.what}</span>
              <span className={styles.deadWhy}>{s.why}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className="label">Corrections, in his own words</h2>
        <p className={styles.blurb}>
          These are quoted from the repositories, not written for this page.
        </p>
        <ul className={styles.quotes}>
          {RETRACTIONS.map(r => (
            <li key={r.quote}>
              <blockquote>{r.quote}</blockquote>
              <cite>{r.repo}</cite>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.foot}>
        <span>{PROFILE.email}</span>
        <span>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">github/{PROFILE.handle}</a>
        </span>
      </footer>
    </main>
  );
}

function Row({ p }: { p: Project }) {
  return (
    <li className={styles.row}>
      <div className={styles.rowHead}>
        <Link href={`/work/${p.slug}`} className={styles.name}>{p.name}</Link>
        <span className={styles.status} data-status={p.status}>{STATUS_LABEL[p.status]}</span>
        {p.z !== null ? (
          <span className={styles.scale}>{decadeLabel(Math.round(p.z))}</span>
        ) : null}
        <span className={styles.years}>{p.years}</span>
      </div>
      <p className={styles.tagline}>{p.tagline}</p>
      <p className={styles.stack}>{p.stack.join(' · ')}</p>
      {p.metrics?.length ? (
        <p className={styles.metrics}>
          {p.metrics.slice(0, 4).map(m => (
            <span key={m.k}>
              {m.k} <strong className="num">{m.v}{m.unit ? ` ${m.unit}` : ''}</strong>
            </span>
          ))}
        </p>
      ) : null}
      <p className={styles.links}>
        {p.live ? <a href={p.live} target="_blank" rel="noreferrer">live</a> : null}
        {p.repo ? <a href={p.repo} target="_blank" rel="noreferrer">repo</a> : null}
        {p.isPrivate ? <span className={styles.dim}>private repo</span> : null}
        <Link href={`/work/${p.slug}`}>notes</Link>
      </p>
    </li>
  );
}
