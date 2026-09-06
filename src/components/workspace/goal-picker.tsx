import { useRef } from "react";
import { Check } from "lucide-react";
import { GOALS } from "@/domain/goals";
import type { GoalId } from "@/domain/types";
import { GoalIcon } from "@/components/goal-icon";
import { cn } from "@/lib/utils";

/**
 * Accessible radio group: arrow keys move between goals, Space/Enter selects.
 */
export function GoalPicker({
  value,
  onChange,
}: {
  value: GoalId | null;
  onChange: (id: GoalId) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (index: number, delta: number) => {
    const next = (index + delta + GOALS.length) % GOALS.length;
    const goal = GOALS[next];
    if (!goal) return;
    onChange(goal.id);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="What would you like to do?" className="grid gap-3 sm:grid-cols-2">
      {GOALS.map((goal, index) => {
        const selected = value === goal.id;
        return (
          <button
            key={goal.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!value && index === 0) ? 0 : -1}
            onClick={() => onChange(goal.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(index, 1);
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(index, -1);
              }
            }}
            className={cn(
              "group relative h-full rounded-xl border border-border bg-surface p-4 text-left transition-all",
              "hover:border-primary/40 hover:shadow-soft",
              selected && "border-primary bg-primary/[0.04] shadow-soft",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors",
                  selected && "bg-primary text-primary-foreground",
                )}
              >
                <GoalIcon icon={goal.icon} className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[0.95rem] font-medium">{goal.label}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {goal.tagline}
                </p>
              </div>
              {selected && (
                <Check className="ml-auto size-4 shrink-0 text-primary" aria-hidden="true" />
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{goal.description}</p>
          </button>
        );
      })}
    </div>
  );
}
