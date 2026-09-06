import { useMemo } from "react";
import type { TransformResult } from "@/domain/types";
import { MarkdownView } from "@/components/markdown-view";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContextChunkCard } from "./context-chunk-card";
import { parseAiContextOutput } from "./parse-ai-context";

/** A structured brief meant to be pasted elsewhere — stacked labeled sections, not a card grid. */
export function AiContextResult({ result }: { result: TransformResult }) {
  const parsed = useMemo(() => parseAiContextOutput(result.output), [result.output]);
  if (!parsed) return <MarkdownView markdown={result.output} />;

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        {parsed.subject && <p className="font-display text-lg font-semibold">{parsed.subject}</p>}
        {parsed.origin && <p className="text-sm text-muted-foreground">Origin: {parsed.origin}</p>}
        {parsed.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {parsed.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="font-normal">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <section aria-labelledby="ctx-instructions">
        <h3 id="ctx-instructions" className="eyebrow">
          Instructions for the assistant
        </h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm">
          {parsed.instructions.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="ctx-gist">
        <h3 id="ctx-gist" className="eyebrow">
          Gist
        </h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
          {parsed.gist.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ctx-chunks">
        <h3 id="ctx-chunks" className="eyebrow">
          Context
        </h3>
        <div className={parsed.chunks.length > 1 ? "mt-2 grid gap-3 sm:grid-cols-2" : "mt-2"}>
          {parsed.chunks.map((chunk) => (
            <ContextChunkCard key={chunk.id} chunk={chunk} />
          ))}
        </div>
      </section>

      <section aria-labelledby="ctx-contract" className="panel-flat p-4">
        <h3 id="ctx-contract" className="eyebrow">
          Response contract
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {parsed.responseContract.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
