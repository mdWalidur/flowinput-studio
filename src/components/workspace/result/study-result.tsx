import { useMemo, useState } from "react";

import { MarkdownView } from "@/components/markdown-view";
import { Point } from "@/components/point";
import type { TransformResult } from "@/domain/types";
import { parseStudyOutput } from "./parse-study";
import { Section } from "./section";

/**
 * A revision document: summary and outline read as prose, terms scan in one
 * line, and the review plan is a session-only checklist (never persisted).
 */
export function StudyResult({ result }: { result: TransformResult }) {
  const parsed = useMemo(() => parseStudyOutput(result.output), [result.output]);
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});

  if (!parsed) return <MarkdownView markdown={result.output} />;

  const isChecked = (i: number) => overrides[i] ?? parsed.reviewPlan[i]?.checked ?? false;
  const toggle = (i: number) => setOverrides((prev) => ({ ...prev, [i]: !isChecked(i) }));

  return (
    <div>
      <Section title="Summary" first>
        <div className="space-y-2 text-base leading-7">
          {parsed.summary.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </Section>

      {parsed.outline.length > 0 && (
        <Section title="Outline">
          <ol className="space-y-1.5 text-base">
            {parsed.outline.map((line, i) => (
              <li key={i} className="flex gap-3">
                <span className="label pt-1 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {parsed.keyPoints.length > 0 && (
        <Section title="Key points">
          <ul className="list-disc space-y-1.5 pl-5 text-base">
            {parsed.keyPoints.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Key terms">
        <p className="text-base leading-8">{parsed.terms.join(" · ")}</p>
      </Section>

      <Section title="Active recall">
        <ol className="space-y-3 text-base">
          {parsed.questions.map((question, i) => (
            <li key={i} className="flex gap-3">
              <span className="label pt-1 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>{question}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Review plan" note="Progress is kept for this session only.">
        <ul className="space-y-2">
          {parsed.reviewPlan.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                aria-pressed={isChecked(i)}
                onClick={() => toggle(i)}
                className="flex items-center gap-3 text-base"
              >
                <Point state={isChecked(i) ? "done" : "idle"} />
                <span className={isChecked(i) ? "text-muted-foreground line-through" : ""}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {parsed.focusRequested && (
        <Section title="Your note">
          <p className="text-base text-muted-foreground">{parsed.focusRequested}</p>
        </Section>
      )}
    </div>
  );
}
