export const FUNDRAISER_URL =
  "https://give.sickkidsfoundation.com/fundraisers/codingforsickkids/ethan--s-coding-class";

/**
 * The running total on the Coding for SickKids page.
 *
 * The SickKids Foundation renders the figure server-side, inside the block it
 * marks `iveRaised`:
 *
 *     <div class="iveRaised …"><h4>Raised</h4>
 *       <h3 class="money mt0"><strong>$16,008</strong></h3>
 *
 * so it can be read straight out of the HTML. That also means it breaks the
 * day they redesign the page, which is why every failure — a network error, a
 * non-200, markup that no longer matches — returns null rather than throwing,
 * and the caller falls back to the last figure recorded in the data.
 *
 * Revalidated hourly: donations arrive far slower than that, and it keeps the
 * page off their server on every request.
 */
export async function fetchAmountRaised(): Promise<string | null> {
  try {
    const res = await fetch(FUNDRAISER_URL, {
      next: { revalidate: 3600 },
      headers: {
        // Sent so the request is attributable rather than anonymous.
        "user-agent": "ethanyanxu.com (+https://www.ethanyanxu.com)",
      },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const match = html.match(
      /iveRaised[\s\S]{0,400}?<strong>\s*(\$[\d,]+(?:\.\d{2})?)\s*<\/strong>/,
    );
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
