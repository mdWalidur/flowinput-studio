/**
 * Shared helpers for parsing the `##`-heading markdown conventions that
 * study.ts / ai-context.ts / spec.ts bake into their `output` string.
 *
 * These are presentation-layer, best-effort parsers — every consumer must
 * treat a `null`/empty result as "fall back to plain markdown rendering",
 * never as an error.
 */

export interface MdSection {
  title: string;
  body: string[];
}

/** Splits markdown into level-2 (`##`) sections, stripping "N. " numbering from titles. */
export function splitMdSections(markdown: string): MdSection[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const sections: MdSection[] = [];
  let current: MdSection | null = null;

  for (const line of lines) {
    const heading = /^##\s+(.*)$/.exec(line);
    if (heading) {
      if (current) sections.push(current);
      current = { title: (heading[1] ?? "").replace(/^\d+\.\s*/, "").trim(), body: [] };
      continue;
    }
    current?.body.push(line);
  }
  if (current) sections.push(current);
  return sections;
}

export function findSection(sections: MdSection[], pattern: RegExp): MdSection | null {
  return sections.find((s) => pattern.test(s.title)) ?? null;
}

/** `- item` bullet lines, text only. */
export function bulletItems(section: MdSection): string[] {
  return section.body
    .filter((l) => /^\s*-\s+(?!\[[ xX]\])/.test(l))
    .map((l) => l.replace(/^\s*-\s+/, "").trim());
}

/** `1. item` / `1) item` numbered lines, text only. */
export function numberedItems(section: MdSection): string[] {
  return section.body
    .filter((l) => /^\s*\d+[.)]\s+/.test(l))
    .map((l) => l.replace(/^\s*\d+[.)]\s+/, "").trim());
}

export interface ChecklistItem {
  label: string;
  checked: boolean;
}

/** `- [ ] label` / `- [x] label` checklist lines. */
export function checklistItems(section: MdSection): ChecklistItem[] {
  return section.body
    .map((l) => /^\s*-\s+\[([ xX])\]\s+(.*)$/.exec(l))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ label: (m[2] ?? "").trim(), checked: (m[1] ?? "").toLowerCase() === "x" }));
}

/** Value of a `**Label:** value` line anywhere in the source text. */
export function extractBoldField(markdown: string, label: string): string | null {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, "i");
  return (
    re
      .exec(markdown)?.[1]
      ?.trim()
      .replace(/\s{2,}$/, "") ?? null
  );
}

/** Strips a leading `` `ASSUMPTION` `` marker, reporting whether it was present. */
export function extractAssumption(text: string): { text: string; assumption: boolean } {
  const match = /^`ASSUMPTION`\s*/.exec(text);
  if (!match) return { text, assumption: false };
  return { text: text.slice(match[0].length), assumption: true };
}
