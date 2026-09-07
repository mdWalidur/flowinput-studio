import { useMemo } from "react";
import type { TransformResult } from "@/domain/types";
import { Separator } from "@/components/ui/separator";
import { parsePromptOutput } from "./parse-prompt";

interface Props {
  result: TransformResult;
  sourceText: string;
}

/** Promotes the original-vs-improved comparison from an appendix to the primary layout. */
export function PromptResult({ result, sourceText }: Props) {
  const parsed = useMemo(() => parsePromptOutput(result.output), [result.output]);
  const preview =
    sourceText.length > 800 ? `${sourceText.slice(0, 800)}\n\n[truncated for preview]` : sourceText;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p id="prompt-original-label" className="eyebrow">
            Original
          </p>
          <pre
            aria-labelledby="prompt-original-label"
            className="mt-2 whitespace-pre-wrap border-l border-border py-2 pl-4 font-mono text-[12px] leading-relaxed text-muted-foreground"
          >
            {preview}
          </pre>
        </div>
        <div>
          <p id="prompt-improved-label" className="eyebrow">
            Improved
          </p>
          <pre
            aria-labelledby="prompt-improved-label"
            className="mt-2 whitespace-pre-wrap border-l border-primary py-2 pl-4 font-mono text-[12px] leading-relaxed"
          >
            {result.output}
          </pre>
        </div>
      </div>

      {parsed && (
        <>
          <Separator />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Role" value={parsed.role} />
            <Field label="Task" value={parsed.task} />
            <Field label="Output format" value={parsed.outputFormat} />
            <Field label="Quality bar" value={parsed.qualityBar} />
          </div>
          {parsed.requiredDetails.length > 0 && (
            <FieldList label="Required details to honour" items={parsed.requiredDetails} />
          )}
          {parsed.constraints.length > 0 && (
            <FieldList label="Constraints" items={parsed.constraints} />
          )}
        </>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed">{value}</p>
    </div>
  );
}

function FieldList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
