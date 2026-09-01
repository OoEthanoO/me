export const YANLEARN_URL = "https://learn.ethanyanxu.com/";
const IMPACT_API = "https://learn.ethanyanxu.com/api/impact";

/** One read, hourly, that answers null rather than throwing. */
async function read(url: string) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "user-agent": "ethanyanxu.com (+https://www.ethanyanxu.com)",
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Figures from the YanLearn impact page, the one at
 * learn.ethanyanxu.com/?menu=impact.
 *
 * That page is rendered in the browser, so there is nothing to read out of
 * the page HTML; the numbers come from the JSON the page itself fetches,
 * which is public and shaped like:
 *
 *     { classesTaught, courses: { completed, total }, enrollments,
 *       hoursTaught, raised, students, tutors }
 *
 * The impact page is the platform's own public accounting — it folds in the
 * programs run before the platform launched — so reading it keeps this site's
 * figures saying exactly what the platform says, rather than reconstructing
 * them from the analytics board and drifting when its definitions do.
 *
 * Returned keyed by label, matching how the Schoolhouse reader works: the
 * caller asks for the labels it wants, and any it does not find keep the
 * fallback recorded in the data. A network error, a non-200 or a response
 * that no longer holds these keys returns null rather than throwing.
 *
 * Revalidated hourly, like the other two live reads.
 */
export async function fetchYanLearnStats(): Promise<Record<
  string,
  string
> | null> {
  try {
    const impact = await read(IMPACT_API);

    const figures: Record<string, string> = {};
    const put = (label: string, value: unknown) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        figures[label] = String(value);
      }
    };

    put("Volunteer Tutors", impact?.tutors);
    put("Courses", impact?.courses?.total);
    // The endpoint reports hours to one decimal place; the impact page prints
    // the whole number, and so does this site.
    put("Hours Taught", Math.round(impact?.hoursTaught));
    put("Total Enrollments", impact?.enrollments);

    return Object.keys(figures).length > 0 ? figures : null;
  } catch {
    return null;
  }
}
