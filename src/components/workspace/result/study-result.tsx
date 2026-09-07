import { useMemo, useState } from "react";
import { BookOpen, Brain, Calendar, ListChecks } from "lucide-react";
import type { TransformResult } from "@/domain/types";
import { MarkdownView } from "@/components/markdown-view";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { parseStudyOutput } from "./parse-study";

/**
 * A revision environment, not a document preview: terms as scannable chips,
 * recall questions as a real list, and the spaced review plan as a session-only
 * checklist (state lives here, never persisted — an honest reading aid).
 */
export function StudyResult({ result }: { result: TransformResult }) {
  const parsed = useMemo(() => parseStudyOutput(result.output), [result.output]);
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});

  if (!parsed) return <MarkdownView markdown={result.output} />;

  const isChecked = (i: number) => overrides[i] ?? parsed.reviewPlan[i]?.checked ?? false;
  const toggle = (i: number) => setOverrides((prev) => ({ ...prev, [i]: !isChecked(i) }));

  return (
    <div className="space-y-6">
      {(parsed.depth || parsed.reviewTime) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {parsed.depth && <span>{parsed.depth} depth</span>}
          {parsed.depth && parsed.reviewTime ? <span>·</span> : null}
          {parsed.reviewTime && <span>{parsed.reviewTime}</span>}
        </div>
      )}

      <section aria-labelledby="study-summary">
        <h3 id="study-summary" className="eyebrow">
          Summary
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
          {parsed.summary.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      {parsed.outline.length > 0 && (
        <section aria-labelledby="study-outline">
          <h3 id="study-outline" className="eyebrow">
            Outline
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {parsed.outline.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </section>
      )}

      {parsed.keyPoints.length > 0 && (
        <section aria-labelledby="study-keypoints">
          <h3 id="study-keypoints" className="eyebrow">
            Key points to memorize
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {parsed.keyPoints.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      <Separator />

      <section aria-labelledby="study-terms">
        <h3 id="study-terms" className="eyebrow">
          <Brain className="size-3.5" aria-hidden="true" />
          Key terms
        </h3>
        <p className="mt-2 text-sm leading-7">{parsed.terms.join(" · ")}</p>
      </section>

      <section aria-labelledby="study-questions">
        <h3 id="study-questions" className="eyebrow">
          <ListChecks className="size-3.5" aria-hidden="true" />
          Active recall questions
        </h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
          {parsed.questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="study-plan" className="border-t border-border pt-5">
        <h3 id="study-plan" className="eyebrow">
          <Calendar className="size-3.5" aria-hidden="true" />
          Spaced review plan
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Check items off as you complete each review — this only tracks your progress for this
          session.
        </p>
        <ul className="mt-3 space-y-2">
          {parsed.reviewPlan.map((item, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <Checkbox
                id={`study-review-${i}`}
                checked={isChecked(i)}
                onCheckedChange={() => toggle(i)}
              />
              <label
                htmlFor={`study-review-${i}`}
                className={isChecked(i) ? "text-sm text-muted-foreground line-through" : "text-sm"}
              >
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </section>

      {parsed.focusRequested && (
        <section aria-labelledby="study-focus">
          <h3 id="study-focus" className="eyebrow">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Focus requested
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{parsed.focusRequested}</p>
        </section>
      )}
    </div>
  );
}
