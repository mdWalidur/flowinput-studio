import {
  bulletItems,
  extractAssumption,
  findSection,
  numberedItems,
  splitMdSections,
} from "./parse-shared";

export interface SpecItem {
  text: string;
  assumption: boolean;
}

export interface SpecSection {
  number: number;
  title: string;
  /** "raw" (candidate data model) is rendered via MarkdownView to get real table support for free. */
  kind: "bullets" | "numbered" | "raw";
  items: SpecItem[];
  raw: string;
}

const KNOWN_TITLES = [
  /^problem statement$/i,
  /^users and roles$/i,
  /^scope.*mvp requirements$/i,
  /^out of scope for v1$/i,
  /^proposed screens$/i,
  /^candidate data model$/i,
  /^non-functional requirements$/i,
  /^milestones$/i,
  /^open questions$/i,
  /^extra direction$/i,
];

/**
 * Parses spec.ts's fixed, numbered `##` sections. Returns null if fewer than
 * 6 of the known sections are found — callers must fall back to plain
 * markdown rendering.
 */
export function parseSpecOutput(markdown: string): SpecSection[] | null {
  try {
    const sections = splitMdSections(markdown);
    const matched = sections.filter((s) => KNOWN_TITLES.some((re) => re.test(s.title)));
    if (matched.length < 6) return null;

    return matched.map((section, i) => {
      const isDataModel = /^candidate data model$/i.test(section.title);
      const numbered = numberedItems(section);
      const bullets = bulletItems(section);
      const kind: SpecSection["kind"] = isDataModel
        ? "raw"
        : numbered.length
          ? "numbered"
          : "bullets";
      const rawItems = kind === "numbered" ? numbered : kind === "bullets" ? bullets : [];

      return {
        number: i + 1,
        title: section.title,
        kind,
        items: rawItems.map(extractAssumption),
        raw: section.body.join("\n").trim(),
      };
    });
  } catch {
    return null;
  }
}
