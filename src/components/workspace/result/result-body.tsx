import type { TransformResult } from "@/domain/types";
import { AiContextResult } from "./ai-context-result";
import { MarkdownResult } from "./markdown-result";
import { PromptResult } from "./prompt-result";
import { SpecResult } from "./spec-result";
import { StudyResult } from "./study-result";

interface Props {
  result: TransformResult;
  /** Only used by the Prompt goal, for its before/after comparison. */
  sourceText?: string;
}

/** Goal-keyed dispatcher: each transformation type gets its own layout, not a generic panel with different text. */
export function ResultBody({ result, sourceText }: Props) {
  switch (result.goalId) {
    case "study":
      return <StudyResult result={result} />;
    case "ai-context":
      return <AiContextResult result={result} />;
    case "spec":
      return <SpecResult result={result} />;
    case "prompt":
      return <PromptResult result={result} sourceText={sourceText ?? ""} />;
    case "markdown":
    default:
      return <MarkdownResult result={result} />;
  }
}
