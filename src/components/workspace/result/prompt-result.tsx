import { useMemo } from "react";

import type { TransformResult } from "@/domain/types";
import { parsePromptOutput } from "./parse-prompt";
import { Section } from "./section";

interface Props {
  result: TransformResult;
  sourceText: string;
}

/** Original → improved → the parts that make it work. No claims about models. */
export function PromptResult({ result, sourceText }: Props) {
  const parsed = useMemo(() => parsePromptOutput(result.output), [result.output]);
  const preview =
    sourceText.length > 800 ? `${sourceText.slice(0, 800)}\n\n[truncated for preview]` : sourceText;

  return (
    <div>
      <Section title="Improved prompt" first>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-6">{result.output}</pre>
      </Section>

      <Section title="You started with">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-muted-foreground">
          {preview}
        </pre>
      </Section>

      {parsed && (
        <Section title="What makes it work">
          <dl className="space-y-4">
            <Field label="Role" value={parsed.role} />
            <Field label="Task" value={parsed.task} />
            <Field label="Output format" value={parsed.outputFormat} />
            <Field label="Quality bar" value={parsed.qualityBar} />
          </dl>

          {parsed.requiredDetails.length > 0 && (
            <FieldList label="Details it must honour" items={parsed.requiredDetails} />
          )}

          {parsed.constraints.length > 0 && (
            <FieldList label="Constraints" items={parsed.constraints} />
          )}
        </Section>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  return (
    <div className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="label sm:pt-1.5">{label}</dt>
      <dd className="text-base leading-7">{value}</dd>
    </div>
  );
}

function FieldList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-6">
      <p className="label">{label}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
