'use client';

/**
 * The text half of a station, set as a plate in a technical manual: a plate
 * number, the subject, the instrument, the measurements, and — because it is
 * the most characteristic thing in Ethan's repositories — the caveat.
 */

import styles from './Plate.module.css';

export interface Row {
  k: string;
  v: string;
  unit?: string;
  emph?: boolean;
}

export interface PlateLink {
  href: string;
  label: string;
}

interface Props {
  index: number;
  scale: string;
  subject: string;
  project: string;
  status?: string;
  children: React.ReactNode;
  rows?: Row[];
  rowsCaption?: string;
  /** The honest limitation. Never omitted when one exists. */
  caveat?: React.ReactNode;
  links?: PlateLink[];
  ruler?: string;
}

export default function Plate({
  index,
  scale,
  subject,
  project,
  status,
  children,
  rows,
  rowsCaption,
  caveat,
  links,
  ruler,
}: Props) {
  return (
    <article className={styles.plate}>
      <header className={styles.head}>
        <span className="label">
          Plate {String(index).padStart(2, '0')}
        </span>
        <span className={`num ${styles.scale}`}>{scale}</span>
      </header>

      <h2 className={styles.subject}>{subject}</h2>

      <div className={styles.attrib}>
        <span className={styles.project}>{project}</span>
        {status ? <span className={styles.status}>{status}</span> : null}
      </div>

      {ruler ? <p className={styles.ruler}>{ruler}</p> : null}

      <div className={`prose ${styles.body}`}>{children}</div>

      {rows?.length ? (
        <div className={styles.sheetWrap}>
          {rowsCaption ? <span className="label">{rowsCaption}</span> : null}
          <table className="sheet">
            <tbody>
              {rows.map(r => (
                <tr key={r.k} data-emph={r.emph ? 'true' : 'false'}>
                  <td>{r.k}</td>
                  <td className="n">
                    {r.v}
                    {r.unit ? <span className="unit"> {r.unit}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {caveat ? (
        <aside className={styles.caveat}>
          <span className="label">Caveat</span>
          <p>{caveat}</p>
        </aside>
      ) : null}

      {links?.length ? (
        <nav className={styles.links}>
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
      ) : null}
    </article>
  );
}
