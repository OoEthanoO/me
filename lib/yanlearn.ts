export const YANLEARN_URL = "https://learn.ethanyanxu.com/";
const ANALYTICS_API = "https://learn.ethanyanxu.com/api/analytics";
const TEAM_COUNT_API = "https://learn.ethanyanxu.com/api/team/count";

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
 * The size of the team is not on that board: the board counts every
 * executive-tier account, while the roster the platform publishes leaves out
 * juniors who have not taken a course yet and includes the non-teaching
 * roles. That roster count is its own endpoint, shaped like `{ count }`, and
 * is the number the platform itself prints on its home page.
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
    const [totals, team] = await Promise.all([
      read(ANALYTICS_API).then((data) => data?.totals),
      read(TEAM_COUNT_API),
    ]);

    const figures: Record<string, string> = {};
    const put = (label: string, value: unknown) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        figures[label] = String(value);
      }
    };

    put("Team Members", team?.count);
    put("Courses", totals?.courses?.total);
    // The board reports hours to one decimal place; beside three whole-number
    // figures the fraction reads as noise, so it is rounded here.
    put("Hours Taught", Math.round(totals?.hours?.taught));
    put("Total Enrollments", totals?.enrollments?.total);

    return Object.keys(figures).length > 0 ? figures : null;
  } catch {
    return null;
  }
}
