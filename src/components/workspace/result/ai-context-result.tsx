import { useMemo } from "react";

import { MarkdownView } from "@/components/markdown-view";
import type { TransformResult } from "@/domain/types";
import { ContextChunkCard } from "./context-chunk-card";
import { parseAiContextOutput } from "./parse-ai-context";
import { Section } from "./section";

/** A brief built to be pasted elsewhere: labelled blocks, copyable in pieces. */
export function AiContextResult({ result }: { result: TransformResult }) {
  const parsed = useMemo(() => parseAiContextOutput(result.output), [result.output]);
  if (!parsed) return <MarkdownView markdown={result.output} />;

  return (
    <div>
      {parsed.subject && (
        <header>
          <h3 className="text-xl">{parsed.subject}</h3>
          {parsed.origin && <p className="label mt-2">Origin · {parsed.origin}</p>}
          {parsed.topics.length > 0 && (
            <p className="mt-3 text-base text-muted-foreground">{parsed.topics.join(" · ")}</p>
          )}
        </header>
      )}

      <Section title="Instructions for the assistant" first={!parsed.subject}>
        <ol className="space-y-2 text-base">
          {parsed.instructions.map((line, i) => (
            <li key={i} className="flex gap-3">
              <span className="label pt-1 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Gist">
        <ul className="list-disc space-y-1.5 pl-5 text-base">
          {parsed.gist.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Section>

      <Section title="Context">
        <div className="space-y-6">
          {parsed.chunks.map((chunk) => (
            <ContextChunkCard key={chunk.id} chunk={chunk} />
          ))}
        </div>
      </Section>

      <Section title="Response contract">
        <ul className="space-y-1.5 text-base text-muted-foreground">
          {parsed.responseContract.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
