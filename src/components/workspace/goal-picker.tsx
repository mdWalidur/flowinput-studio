import { useRef } from "react";
import { Check } from "lucide-react";

import { GOALS } from "@/domain/goals";
import type { GoalId } from "@/domain/types";
import { GoalIcon } from "@/components/goal-icon";
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
      className="divide-y divide-border border-y border-border"
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
              "group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-5 text-left transition-colors",
              "hover:text-primary",
              selected && "text-primary",
            )}
          >
            <span className="min-w-0">
              <span className="flex items-center gap-3">
                <GoalIcon icon={goal.icon} className="size-4 shrink-0" />
                <span className="text-base font-medium">{compact ? shortLabel(goal.id) : goal.label}</span>
              </span>
              {!compact ? (
                <span className="mt-1.5 block max-w-2xl pl-7 text-sm leading-6 text-muted-foreground">
                  {goal.description}
                </span>
              ) : null}
            </span>

            <span className={cn("size-2 rounded-full border border-border", selected && "border-primary bg-primary")}>
              <Check className="hidden" aria-hidden="true" />
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