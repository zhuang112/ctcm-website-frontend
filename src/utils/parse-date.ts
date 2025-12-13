/**
 * Utilities for parsing dates with ROC (Taiwan) year and simple ranges.
 * - Supports YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD
 * - Supports ROC year with or without "民國" prefix (e.g., 民國114年10月11日, 114/10/11)
 * - Range parsing allows end date without year (inherits start year).
 */

const RANGE_SEPARATORS = /[~～至–—]/;

export interface ParsedDateRange {
  start: string | null;
  end: string | null;
  raw: string | null;
}

/** Convert a single date token to ISO yyyy-mm-dd. */
export function parseDateToken(raw: string, fallbackYear?: number): string | null {
  const text = raw.trim();

  const fullMatch = text.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
  if (fullMatch) {
    const [, y, m, d] = fullMatch;
    return toIso(Number(y), m, d);
  }

  const rocMatch = text.match(/(?:民國)?\s*(\d{2,3})[年./-](\d{1,2})[月./-](\d{1,2})/);
  if (rocMatch) {
    const [, ry, m, d] = rocMatch;
    const year = 1911 + Number(ry);
    return toIso(year, m, d);
  }

  // Allow MM-DD when year can be inherited
  if (fallbackYear) {
    const shortMatch = text.match(/(\d{1,2})[./-](\d{1,2})/);
    if (shortMatch) {
      const [, m, d] = shortMatch;
      return toIso(fallbackYear, m, d);
    }
  }

  return null;
}

export function parseDateRange(rawInput: string | null): ParsedDateRange {
  if (!rawInput) return { start: null, end: null, raw: null };
  const raw = rawInput.trim();
  if (!raw) return { start: null, end: null, raw: null };

  const parts = raw.split(RANGE_SEPARATORS).map((p) => p.trim()).filter(Boolean);
  const startToken = parts[0] ?? "";
  const endToken = parts[1] ?? "";

  const startIso = parseDateToken(startToken);
  const endIso = endToken ? parseDateToken(endToken, startIso ? Number(startIso.slice(0, 4)) : undefined) : null;

  return { start: startIso, end: endIso, raw };
}

function toIso(year: number, month: string | number, day: string | number): string | null {
  if (!year || !month || !day) return null;
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  if (Number(m) < 1 || Number(m) > 12) return null;
  if (Number(d) < 1 || Number(d) > 31) return null;
  return `${year}-${m}-${d}`;
}
