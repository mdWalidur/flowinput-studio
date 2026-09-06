import {
  bulletItems,
  extractBoldField,
  findSection,
  numberedItems,
  splitMdSections,
} from "./parse-shared";

export interface ContextChunk {
  id: string;
  text: string;
}

/** Mirrors src/lib/transform/strategies/ai-context.ts's fixed section headings. */
export interface ParsedAiContext {
  subject: string | null;
  origin: string | null;
  topics: string[];
  instructions: string[];
  gist: string[];
  chunks: ContextChunk[];
  responseContract: string[];
}

/**
 * Parses ai-context.ts's output. Returns null if the required sections
 * or the `[C1]`/`[C2]`… chunk markers inside "## Context" aren't found —
 * callers must fall back to plain markdown rendering.
 */
export function parseAiContextOutput(markdown: string): ParsedAiContext | null {
  try {
    const sections = splitMdSections(markdown);

    const instructionsSection = findSection(sections, /^instructions for the assistant$/i);
    const gistSection = findSection(sections, /^gist$/i);
    const contextSection = findSection(sections, /^context$/i);
    const contractSection = findSection(sections, /^response contract$/i);
    if (!instructionsSection || !gistSection || !contextSection || !contractSection) return null;

    const chunks: ContextChunk[] = [];
    for (const line of contextSection.body) {
      const match = /^\[C(\d+)\]\s(.*)$/.exec(line);
      if (match) chunks.push({ id: match[1] ?? "", text: match[2] ?? "" });
    }
    if (!chunks.length) return null;

    const topicsRaw = extractBoldField(markdown, "Detected topics");

    return {
      subject: extractBoldField(markdown, "Subject"),
      origin: extractBoldField(markdown, "Origin"),
      topics:
        topicsRaw && topicsRaw.toLowerCase() !== "n/a"
          ? topicsRaw
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      instructions: numberedItems(instructionsSection),
      gist: bulletItems(gistSection),
      chunks,
      responseContract: bulletItems(contractSection),
    };
  } catch {
    return null;
  }
}
