import type { GoalId } from "./types";

/** Which of the shared options actually make sense for a goal. */
export type GoalOption = "detail" | "metadata" | "instructions";

export interface GoalDefinition {
  id: GoalId;
  /** Plain-language name shown in the picker. */
  label: string;
  /** Short answer to "what do I get?" */
  tagline: string;
  description: string;
  /** Lucide icon name rendered by the UI layer. */
  icon: "file-text" | "graduation-cap" | "bot" | "layout-dashboard" | "wand";
  audience: string[];
  outputFormat: "md" | "txt";
  options: GoalOption[];
  /** Label for the detail control, worded for this goal. */
  detailLabel?: string;
  /** Placeholder for the free-text direction field. */
  instructionsHint: string;
}

export const GOALS: GoalDefinition[] = [
  {
    id: "markdown",
    label: "Convert to Markdown",
    tagline: "Clean, tidy, portable text",
    description:
      "Straightens out messy formatting into consistent headings, lists and spacing you can paste anywhere.",
    icon: "file-text",
    audience: ["Writers", "Developers"],
    outputFormat: "md",
    options: ["metadata"],
    instructionsHint: "",
  },
  {
    id: "study",
    label: "Prepare to Study",
    tagline: "Summary, key terms, questions",
    description:
      "Builds a revision pack: an outline, the terms that matter, recall questions and a simple review plan.",
    icon: "graduation-cap",
    audience: ["Students", "Researchers"],
    outputFormat: "md",
    options: ["detail", "metadata", "instructions"],
    detailLabel: "How much detail?",
    instructionsHint: "e.g. focus on the exam topics, keep it to one page",
  },
  {
    id: "ai-context",
    label: "Prepare for an AI",
    tagline: "A clean, structured brief",
    description:
      "Wraps your content in a clearly labelled context block that an assistant can follow without guessing.",
    icon: "bot",
    audience: ["Everyone"],
    outputFormat: "md",
    options: ["detail", "metadata", "instructions"],
    detailLabel: "How much of the source to include?",
    instructionsHint: "e.g. the assistant should answer only from this text",
  },
  {
    id: "spec",
    label: "Turn into a Website or App Plan",
    tagline: "A plan you can build from",
    description:
      "Reads your notes for goals, screens, data and milestones, then lays them out as a working plan.",
    icon: "layout-dashboard",
    audience: ["Founders", "Developers"],
    outputFormat: "md",
    options: ["detail", "metadata", "instructions"],
    detailLabel: "How thorough?",
    instructionsHint: "e.g. mobile first, two-week first release",
  },
  {
    id: "prompt",
    label: "Improve a Prompt",
    tagline: "Clear role, task and limits",
    description:
      "Rewrites a rough request into a precise prompt with the role, the task, the limits and the output you expect.",
    icon: "wand",
    audience: ["Creators", "Marketers"],
    outputFormat: "txt",
    options: ["detail", "instructions"],
    detailLabel: "How strict?",
    instructionsHint: "e.g. for a video tool, keep it under 80 words",
  },
];

export const goalById = (id: GoalId): GoalDefinition =>
  GOALS.find((g) => g.id === id) ?? (GOALS[0] as GoalDefinition);

/** Compact names used in the direction rails. */
export const SHORT_GOAL_LABEL: Record<GoalId, string> = {
  study: "Study",
  "ai-context": "AI Context",
  spec: "Product Plan",
  markdown: "Markdown",
  prompt: "Prompt",
};
