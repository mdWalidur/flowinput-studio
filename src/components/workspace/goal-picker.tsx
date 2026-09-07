import { useRef } from "react";

import { GOALS } from "@/domain/goals";
import type { GoalId } from "@/domain/types";
import { cn } from "@/lib/utils";

export function GoalPicker({
  value,
  onChange,
  compact = false,
}: {
  value: GoalId | null;
  onChange: (id: GoalId) => void;
  compact?: boolean;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (
    index: number,
    direction: number,
  ) => {
    const nextIndex =
      (index + direction + GOALS.length) %
      GOALS.length;

    const next = GOALS[nextIndex];

    if (!next) return;

    onChange(next.id);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="What would you like to do?"
      className="flex flex-wrap gap-x-6 gap-y-1 border-y border-border py-4"
    >
      {GOALS.map((goal, index) => {
        const selected = value === goal.id;

        return (
          <button
            key={goal.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={
              selected ||
              (!value && index === 0)
                ? 0
                : -1
            }
            onClick={() => onChange(goal.id)}
            onKeyDown={(event) => {
              if (
                event.key === "ArrowDown" ||
                event.key === "ArrowRight"
              ) {
                event.preventDefault();
                move(index, 1);
              }

              if (
                event.key === "ArrowUp" ||
                event.key === "ArrowLeft"
              ) {
                event.preventDefault();
                move(index, -1);
              }
            }}
            className={cn(
              "text-left text-sm text-muted-foreground transition-colors hover:text-foreground",
              selected && "text-signal",
            )}
          >
            <span className="min-w-0">
              <span className="font-medium">{compact ? shortLabel(goal.id) : goal.label}</span>
              {!compact ? (
                <span className="mt-1.5 block max-w-2xl text-sm leading-6 text-muted-foreground">
                  {goal.description}
                </span>
              ) : null}
            </span>

          </button>
        );
      })}
    </div>
  );
}

const shortLabel = (id: GoalId) => ({
  study: "Study",
  "ai-context": "AI Context",
  spec: "Product Plan",
  markdown: "Markdown",
  prompt: "Prompt",
})[id];