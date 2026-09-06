import type { GoalId } from "./types";

export interface GoalDefinition {
  id: GoalId;
  label: string;
  tagline: string;
  description: string;
  /** Lucide icon name rendered by the UI layer. */
  icon: "file-text" | "graduation-cap" | "bot" | "layout-dashboard" | "wand";
  audience: string[];
  outputFormat: "md" | "txt";
}

export const GOALS: GoalDefinition[] = [
  {
    id: "markdown",
    label: "Convert to Markdown",
    tagline: "Clean, portable structure",
    description:
      "Normalize messy text into tidy Markdown with headings, lists and consistent spacing.",
    icon: "file-text",
    audience: ["Writers", "Developers"],
    outputFormat: "md",
  },
  {
    id: "study",
    label: "Prepare for Study",
    tagline: "Summary, key terms, questions",
    description:
      "Turn source material into a study pack: outline, key terms, recall questions and review plan.",
    icon: "graduation-cap",
    audience: ["Students", "Researchers"],
    outputFormat: "md",
  },
  {
    id: "ai-context",
    label: "Optimize for AI",
    tagline: "Token-friendly context block",
    description:
      "Wrap your content in a structured context block that any assistant can consume reliably.",
    icon: "bot",
    audience: ["Everyone"],
    outputFormat: "md",
  },
  {
    id: "spec",
    label: "Build Website / App Spec",
    tagline: "Scaffolded product brief",
    description:
      "Infer goals, pages, data model and milestones from your notes into a buildable specification.",
    icon: "layout-dashboard",
    audience: ["Founders", "Developers"],
    outputFormat: "md",
  },
  {
    id: "prompt",
    label: "Optimize a Prompt",
    tagline: "Role, task, constraints",
    description:
      "Rewrite a rough idea into a precise prompt with role, task, constraints and output contract.",
    icon: "wand",
    audience: ["Creators", "Marketers"],
    outputFormat: "txt",
  },
];

export const goalById = (id: GoalId): GoalDefinition =>
  GOALS.find((g) => g.id === id) ?? (GOALS[0] as GoalDefinition);
