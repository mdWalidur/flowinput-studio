import { useRef } from "react";
import { Check, ArrowRight } from "lucide-react";

import { GOALS } from "@/domain/goals";
import type { GoalId } from "@/domain/types";
import { GoalIcon } from "@/components/goal-icon";
import { cn } from "@/lib/utils";

export function GoalPicker({
  value,
  onChange,
}: {
  value: GoalId | null;
  onChange: (id: GoalId) => void;
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
              "group grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-5 px-2 py-6 text-left transition-colors",
              "hover:bg-secondary/55",
              selected && "bg-secondary/70",
            )}
          >
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="flex min-w-0 items-center gap-4">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
                  selected &&
                    "border-primary bg-primary text-primary-foreground",
                )}
              >
                <GoalIcon
                  icon={goal.icon}
                  className="size-4"
                />
              </span>

              <span className="min-w-0">
                <span className="block font-display text-xl tracking-tight">
                  {goal.label}
                </span>

                <span className="mt-1 block max-w-2xl text-sm leading-6 text-muted-foreground">
                  {goal.description}
                </span>
              </span>
            </span>

            <span className="flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:block">
                {goal.tagline}
              </span>

              {selected ? (
                <Check
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight
                  className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}