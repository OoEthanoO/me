export const YANLEARN_URL = "https://learn.ethanyanxu.com/";
const ANALYTICS_API = "https://learn.ethanyanxu.com/api/analytics";

/**
 * Figures from the YanLearn analytics board, the one at
 * learn.ethanyanxu.com/?menu=analytics.
 *
 * That board is rendered in the browser, so there is nothing to read out of
 * the page HTML; the numbers come from the JSON the board itself fetches,
 * which is public and shaped like:
 *
 *     { totals: { courses: { active, completed, total },
 *                 hours:   { taught, withdrawn, classesTaught },
 *                 enrollments: { total, platform, legacy } } }
 *
 * Courses reports the cumulative total rather than the count currently
 * active, so all three figures are lifetime numbers and read consistently
 * beside each other.
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
    const res = await fetch(ANALYTICS_API, {
      next: { revalidate: 3600 },
      headers: {
        "user-agent": "ethanyanxu.com (+https://www.ethanyanxu.com)",
      },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const totals = data?.totals;

    const figures: Record<string, string> = {};
    const put = (label: string, value: unknown) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        figures[label] = String(value);
      }
    };

    put("Courses", totals?.courses?.total);
    put("Hours Taught", totals?.hours?.taught);
    put("Total Enrollments", totals?.enrollments?.total);

    return Object.keys(figures).length > 0 ? figures : null;
  } catch {
    return null;
  }
}
