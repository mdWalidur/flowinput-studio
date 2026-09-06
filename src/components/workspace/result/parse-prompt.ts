const LABELS = [
  "ROLE",
  "TASK",
  "CONTEXT (verbatim from the requester)",
  "REQUIRED DETAILS TO HONOUR",
  "CONSTRAINTS",
  "OUTPUT FORMAT",
  "QUALITY BAR",
] as const;

const FOOTER_PREFIX = "-- optimized by FlowInput";

export interface ParsedPrompt {
  role: string;
  task: string;
  context: string;
  requiredDetails: string[];
  constraints: string[];
  outputFormat: string;
  qualityBar: string;
}

/**
 * Parses prompt.ts's plain-text, label-per-line output (the only "txt" goal —
 * no markdown headings). Returns null if the core labels aren't found —
 * callers must fall back to plain <pre> rendering.
 */
export function parsePromptOutput(text: string): ParsedPrompt | null {
  try {
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    const sections = new Map<string, string[]>();
    let current: string | null = null;

    for (const line of lines) {
      const label = LABELS.find((l) => line.trim() === l);
      if (label) {
        current = label;
        sections.set(label, []);
        continue;
      }
      if (current && !line.startsWith(FOOTER_PREFIX)) {
        sections.get(current)!.push(line);
      }
    }

    if (!sections.has("ROLE") || !sections.has("TASK") || !sections.has("CONSTRAINTS")) return null;

    const body = (label: string) => (sections.get(label) ?? []).join("\n").trim();
    const bullets = (label: string) =>
      (sections.get(label) ?? [])
        .filter((l) => /^\s*-\s+/.test(l))
        .map((l) => l.replace(/^\s*-\s+/, "").trim());

    return {
      role: body("ROLE"),
      task: body("TASK"),
      context: body("CONTEXT (verbatim from the requester)"),
      requiredDetails: bullets("REQUIRED DETAILS TO HONOUR"),
      constraints: bullets("CONSTRAINTS"),
      outputFormat: body("OUTPUT FORMAT"),
      qualityBar: body("QUALITY BAR"),
    };
  } catch {
    return null;
  }
}
