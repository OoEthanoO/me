export const SCHOOLHOUSE_URL =
  "https://schoolhouse.world/portfolio/419d56dd-a211-4ca0-98e8-429f51fc4c76";

/**
 * Figures from the Schoolhouse portfolio page.
 *
 * Schoolhouse renders the page server-side with Chakra, so each figure sits in
 * markup shaped like:
 *
 *     <h1 class="chakra-heading css-…">214</h1> … <p class="chakra-text css-…">Tutoring Hours</p>
 *
 * The headline counts use `h1`; the ratings breakdown lower down uses `p` for
 * the number instead, so both are matched. The emotion class hashes change on
 * every deploy of theirs, which is why nothing here keys off them.
 *
 * Pairs are read generically and returned keyed by label, so the caller asks
 * for the labels it wants and any it does not find simply keep the fallback
 * recorded in the data. A network error or a redesign returns null rather than
 * throwing.
 *
 * Revalidated hourly, like the fundraiser total.
 */
export async function fetchSchoolhouseStats(): Promise<Record<
  string,
  string
> | null> {
  try {
    const res = await fetch(SCHOOLHOUSE_URL, {
      next: { revalidate: 3600 },
      headers: {
        "user-agent": "ethanyanxu.com (+https://www.ethanyanxu.com)",
      },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const pattern =
      /<(h1|p) class="chakra-(?:heading|text)[^"]*">\s*([\d,.]{1,12})\s*<\/\1>[\s\S]{0,600}?<p class="chakra-text[^"]*">\s*([^<]{1,40}?)\s*<\/p>/g;

    const found: Record<string, string> = {};
    for (const match of html.matchAll(pattern)) {
      const [, , value, label] = match;
      // First win: the headline figures appear before the breakdown repeats
      // any label further down the page.
      if (!(label in found)) found[label] = value;
    }

    return Object.keys(found).length > 0 ? found : null;
  } catch {
    return null;
  }
}
