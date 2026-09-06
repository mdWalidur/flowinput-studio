import type {
  GoalId,
  SourceDocument,
  TransformOptions,
  TransformResult,
} from "@/domain/types";
import { readingMinutes, wordCount } from "./text-utils";
import { markdownStrategy } from "./strategies/markdown";
import { studyStrategy } from "./strategies/study";
import { aiContextStrategy } from "./strategies/ai-context";
import { specStrategy } from "./strategies/spec";
import { promptStrategy } from "./strategies/prompt";

/**
 * Transformation strategy/adapter pattern keyed by goal.
 *
 * Every strategy here is a pure, deterministic local function — no network, no
 * secrets. A future AI provider (see src/lib/providers/ai-provider.ts) can be
 * registered as an alternative adapter for the same goal id without touching
 * any UI code.
 */
export interface TransformContext {
  source: SourceDocument;
  options: TransformOptions;
}

export interface TransformStrategy {
  id: GoalId;
  format: "md" | "txt";
  /** Returns the rendered output plus notes about what was done. */
  run(ctx: TransformContext): { output: string; notes: string[] };
}

const STRATEGIES: Record<GoalId, TransformStrategy> = {
  markdown: markdownStrategy,
  study: studyStrategy,
  "ai-context": aiContextStrategy,
  spec: specStrategy,
  prompt: promptStrategy,
};

export class TransformError extends Error {}

export function getStrategy(goalId: GoalId): TransformStrategy {
  const strategy = STRATEGIES[goalId];
  if (!strategy) throw new TransformError("That goal isn’t available yet.");
  return strategy;
}

export function transform(
  goalId: GoalId,
  ctx: TransformContext,
): TransformResult {
  const strategy = getStrategy(goalId);
  const text = ctx.source.text.trim();

  if (!text) {
    throw new TransformError("There's no readable text in this input yet.");
  }


  const { output, notes } = strategy.run(ctx);

  return {
    goalId,
    output,
    format: strategy.format,
    notes,
    stats: {
      inputWords: wordCount(text),
      outputWords: wordCount(output),
      readingMinutes: readingMinutes(output),
    },
  };
}
