// Shared Overpass client.
//
// Two things this exists to encode: Overpass answers 406 Not Acceptable to
// Node's default user-agent, so a real one is mandatory; and the public
// mirrors reject heavy queries under load often enough that a single attempt
// against a single host is not a fetch strategy.
const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const UA = 'ethanyanxu.com-build/1.0 (portfolio data bake; contact ethanxucoder@gmail.com)';

export async function overpass(query, { attempts = 9 } = {}) {
  let last;
  for (let a = 0; a < attempts; a++) {
    const url = MIRRORS[a % MIRRORS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': UA,
          Accept: 'application/json',
        },
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (text.trimStart().startsWith('<')) throw new Error('server returned an error page');
      return JSON.parse(text);
    } catch (e) {
      last = e;
      process.stderr.write(`  retry ${a + 1}/${attempts} (${new URL(url).host}): ${String(e.message).slice(0, 80)}\n`);
      await new Promise(r => setTimeout(r, 3000 + a * 2000));
    }
  }
  throw new Error(`all overpass mirrors failed: ${last?.message}`);
}
