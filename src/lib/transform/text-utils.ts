/** Pure, deterministic text helpers shared by every transformation strategy. */

export const normalizeWhitespace = (text: string): string =>
  text
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const words = (text: string): string[] =>
  text.split(/[^A-Za-z0-9'’-]+/).filter(Boolean);

export const wordCount = (text: string): number => words(text).length;

export const readingMinutes = (text: string): number =>
  Math.max(1, Math.round(wordCount(text) / 220));

export const paragraphs = (text: string): string[] =>
  normalizeWhitespace(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export const lines = (text: string): string[] =>
  normalizeWhitespace(text)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const sentences = (text: string): string[] =>
  normalizeWhitespace(text)
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);

const STOP_WORDS = new Set(
  `a about above after again against all am an and any are as at be because been before being below between both but by cannot could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its just me more most my no nor not of off on once only or other our out over own same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with you your than its it's don't`.split(
    /\s+/,
  ),
);

/** Frequency-ranked keywords, ignoring stop words. Deterministic tie-breaks. */
export function keywords(text: string, limit = 12): string[] {
  const counts = new Map<string, number>();
  for (const raw of words(text)) {
    const w = raw.toLowerCase();
    if (w.length < 4 || STOP_WORDS.has(w) || /^\d+$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([w]) => w);
}

/** Extractive summary: highest keyword-density sentences, in original order. */
export function summarize(text: string, count: number): string[] {
  const all = sentences(text);
  if (all.length <= count) return all;
  const weights = new Map(keywords(text, 20).map((w, i) => [w, 20 - i]));
  const scored = all.map((s, index) => {
    const ws = words(s);
    const score =
      ws.reduce((acc, w) => acc + (weights.get(w.toLowerCase()) ?? 0), 0) /
      Math.max(6, ws.length);
    return { s, index, score };
  });
  return scored
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((x) => x.s);
}

export const titleCase = (text: string): string =>
  text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

/** A short, human-friendly title derived from the content. */
export function deriveTitle(text: string, fallback = "Untitled input"): string {
  const first = lines(text)[0];
  if (!first) return fallback;
  const clean = first.replace(/^#+\s*/, "").replace(/[*_`>]/g, "").trim();
  if (!clean) return fallback;
  const short = clean.length > 68 ? `${clean.slice(0, 65).trimEnd()}…` : clean;
  return /[a-z]/.test(short) ? short : titleCase(short);
}

const BULLET = /^([-*•·–]|\d+[.)])\s+/;

export const isBullet = (line: string): boolean => BULLET.test(line);
export const stripBullet = (line: string): string => line.replace(BULLET, "");

/** Heuristic: shortish, no terminal period, mostly uppercase or ends with ":". */
export function looksLikeHeading(line: string): boolean {
  if (line.length > 80) return false;
  if (isBullet(line)) return false;
  if (/^#{1,6}\s/.test(line)) return true;
  if (line.endsWith(":")) return true;
  const letters = line.replace(/[^A-Za-z]/g, "");
  if (letters.length > 2 && letters === letters.toUpperCase()) return true;
  return false;
}

export const metadataBlock = (fields: Record<string, string | number>): string =>
  [
    "---",
    ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`),
    "---",
    "",
  ].join("\n");
