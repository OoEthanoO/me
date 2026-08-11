/**
 * Solar position, computed rather than tabulated.
 *
 * The shade model needs the sun's altitude and azimuth for a given place and
 * moment, and that is astronomy, not a lookup: it is what decides whether a
 * building's shadow falls across the street or along it. Low-precision
 * algorithm from the Astronomical Almanac — good to about 0.01°, which is
 * several orders of magnitude better than the canopy priors it feeds.
 */

const RAD = Math.PI / 180;

export interface SunPosition {
  /** Degrees above the horizon; negative is below. */
  altitude: number;
  /** Degrees clockwise from north. */
  azimuth: number;
}

/** Days since J2000.0 for a given UTC instant. */
function julianDays(date: Date): number {
  return date.getTime() / 86400000 - 10957.5;
}

export function sunPosition(date: Date, latDeg: number, lonDeg: number): SunPosition {
  const n = julianDays(date);

  // Ecliptic coordinates.
  const L = (280.46 + 0.9856474 * n) % 360;          // mean longitude
  const g = ((357.528 + 0.9856003 * n) % 360) * RAD; // mean anomaly
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const epsilon = (23.439 - 0.0000004 * n) * RAD;

  // Equatorial coordinates.
  const ra = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  const dec = Math.asin(Math.sin(epsilon) * Math.sin(lambda));

  // Hour angle.
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const lst = ((gmst * 15 + lonDeg) % 360) * RAD;
  const h = lst - ra;

  const lat = latDeg * RAD;
  const sinAlt = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(h);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

  const azimuth = Math.atan2(
    -Math.sin(h),
    Math.tan(dec) * Math.cos(lat) - Math.sin(lat) * Math.cos(h),
  );

  return {
    altitude: altitude / RAD,
    azimuth: (azimuth / RAD + 360) % 360,
  };
}

/**
 * How long a shadow a given height throws. Undefined once the sun is down, and
 * clamped near the horizon where the true answer runs to infinity and the
 * model stops meaning anything.
 */
export function shadowLength(height: number, altitudeDeg: number): number {
  if (altitudeDeg <= 1) return height * 57.3; // the 1° clamp, stated rather than hidden
  return height / Math.tan(altitudeDeg * RAD);
}

/** A local wall-clock hour on a fixed date, as UTC, for a given longitude. */
export function localHourToDate(hour: number, utcOffsetHours: number, dayOfYear = 196): Date {
  const year = 2026;
  const d = new Date(Date.UTC(year, 0, 1));
  d.setUTCDate(dayOfYear);
  d.setUTCHours(Math.floor(hour) - utcOffsetHours, Math.round((hour % 1) * 60), 0, 0);
  return d;
}
