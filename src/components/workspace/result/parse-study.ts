import {
  bulletItems,
  checklistItems,
  extractBoldField,
  findSection,
  numberedItems,
  splitMdSections,
  type ChecklistItem,
} from "./parse-shared";

/** Mirrors src/lib/transform/strategies/study.ts's fixed section headings. */
export interface ParsedStudy {
  reviewTime: string | null;
  depth: string | null;
  summary: string[];
  outline: string[];
  keyPoints: string[];
  terms: string[];
  questions: string[];
  reviewPlan: ChecklistItem[];
  focusRequested: string | null;
}

/**
 * Parses study.ts's output. Returns null if the required sections
 * (Summary / Key terms / Active recall questions / Spaced review plan)
 * aren't found — callers must fall back to plain markdown rendering.
 */
export function parseStudyOutput(markdown: string): ParsedStudy | null {
  try {
    const sections = splitMdSections(markdown);

    const summarySection = findSection(sections, /^summary$/i);
    const termsSection = findSection(sections, /^key terms$/i);
    const questionsSection = findSection(sections, /^active recall questions$/i);
    const reviewSection = findSection(sections, /^spaced review plan$/i);
    if (!summarySection || !termsSection || !questionsSection || !reviewSection) return null;

    const terms = bulletItems(termsSection).map((item) => {
      const match = /^\*\*(.+?)\*\*/.exec(item);
      return match?.[1] ?? item;
    });
    if (!terms.length) return null;

    const outlineSection = findSection(sections, /^outline$/i);
    const keyPointsSection = findSection(sections, /^key points to memorize$/i);
    const focusSection = findSection(sections, /^focus requested$/i);

    return {
      reviewTime: extractBoldField(markdown, "Estimated review time"),
      depth: extractBoldField(markdown, "Depth"),
      summary: bulletItems(summarySection),
      outline: outlineSection ? numberedItems(outlineSection) : [],
      keyPoints: keyPointsSection ? bulletItems(keyPointsSection) : [],
      terms,
      questions: numberedItems(questionsSection),
      reviewPlan: checklistItems(reviewSection),
      focusRequested: focusSection ? focusSection.body.join(" ").trim() || null : null,
    };
  } catch {
    return null;
  }
}
