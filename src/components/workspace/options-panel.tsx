import { useId, useState } from "react";

import { Point } from "@/components/point";
import type { GoalDefinition } from "@/domain/goals";
import type { TransformOptions } from "@/domain/types";

const DETAIL: Array<[TransformOptions["detail"], string]> = [
  ["concise", "Short"],
  ["standard", "Balanced"],
  ["detailed", "Thorough"],
];

/**
 * A compressed control strip, not a settings panel. Every control uses the same
 * point-and-underline selection language as the direction rail.
 */
export function OptionsPanel({
  goal,
  options,
  onChange,
}: {
  goal: GoalDefinition;
  options: TransformOptions;
  onChange: (next: TransformOptions) => void;
}) {
  const noteId = useId();
  const [noteOpen, setNoteOpen] = useState(Boolean(options.instructions));
  const shows = (key: string) => goal.options.includes(key as never);

  if (goal.options.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing to set for this direction.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
        {shows("detail") && (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="label">{goal.detailLabel ?? "Detail"}</span>
            <div role="radiogroup" aria-label={goal.detailLabel ?? "Detail"} className="flex gap-4">
              {DETAIL.map(([key, label]) => {
                const selected = options.detail === key;

                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange({ ...options, detail: key })}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Point state={selected ? "active" : "idle"} />
                    <span
                      className={
                        selected
                          ? "font-medium text-foreground underline decoration-signal decoration-1 underline-offset-4"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {shows("metadata") && (
          <button
            type="button"
            aria-pressed={options.includeMetadata}
            onClick={() => onChange({ ...options, includeMetadata: !options.includeMetadata })}
            className="flex items-center gap-2 text-sm"
          >
            <Point state={options.includeMetadata ? "active" : "idle"} />
            <span
              className={
                options.includeMetadata
                  ? "font-medium text-foreground underline decoration-signal decoration-1 underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Include a short header
            </span>
          </button>
        )}

        {shows("instructions") && !noteOpen && (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="text-sm text-muted-foreground underline decoration-rule decoration-1 underline-offset-4 hover:text-foreground"
          >
            Add a note
          </button>
        )}
      </div>

      {shows("instructions") && noteOpen && (
        <div>
          <label htmlFor={noteId} className="label">
            Note
          </label>
          <textarea
            id={noteId}
            value={options.instructions ?? ""}
            maxLength={500}
            autoFocus
            onChange={(event) => onChange({ ...options, instructions: event.target.value })}
            placeholder={goal.instructionsHint}
            className="mt-2 block h-16 w-full resize-none border-b border-rule bg-transparent px-0 pb-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <p className="label mt-2">{(options.instructions ?? "").length}/500</p>
        </div>
      )}
    </div>
  );
}
