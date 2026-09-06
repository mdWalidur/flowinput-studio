import { Check } from "lucide-react";
import { GOALS } from "@/domain/goals";
import type { GoalId } from "@/domain/types";
import { GoalIcon } from "@/components/goal-icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function GoalPicker({
  value,
  onChange,
}: {
  value: GoalId | null;
  onChange: (id: GoalId) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Choose your goal"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      {GOALS.map((goal) => {
        const selected = value === goal.id;
        return (
          <button
            key={goal.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(goal.id)}
            className={cn(
              "group h-full rounded-xl border border-border bg-surface p-4 text-left transition-all",
              "hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selected && "border-primary ring-2 ring-primary/25",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground",
                  selected && "bg-primary text-primary-foreground",
                )}
              >
                <GoalIcon icon={goal.icon} className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-display text-sm font-semibold">
                  {goal.label}
                  {selected && <Check className="size-4 text-primary" aria-hidden="true" />}
                </p>
                <p className="text-xs text-muted-foreground">{goal.tagline}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{goal.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {goal.audience.map((a) => (
                <Badge key={a} variant="outline" className="font-normal">
                  {a}
                </Badge>
              ))}
              <Badge variant="secondary" className="font-mono text-[10px]">
                .{goal.outputFormat}
              </Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
