import { MarkdownView } from "@/components/markdown-view";
import type { TransformResult } from "@/domain/types";

/** Markdown is already the shared shell's native format — keep this a clean, unadorned document view. */
export function MarkdownResult({ result }: { result: TransformResult }) {
  return (
    <div className="mx-auto max-w-2xl">
      <MarkdownView markdown={result.output} />
    </div>
  );
}
