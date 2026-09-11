import { useRef } from "react";

import { Point } from "@/components/point";
import { GOALS, SHORT_GOAL_LABEL } from "@/domain/goals";
import type { GoalId } from "@/domain/types";

/**
 * The direction rail. Selection is a point plus weight plus an underline —
 * never colour alone. Same idiom as the landing composer and the options.
 */
export function GoalPicker({
  value,
  onChange,
}: {
  value: GoalId | null;
  onChange: (id: GoalId) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (index: number, direction: number) => {
    const nextIndex = (index + direction + GOALS.length) % GOALS.length;
    const next = GOALS[nextIndex];
    if (!next) return;
    onChange(next.id);
    refs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Choose a direction"
      className="flex flex-wrap gap-x-6 gap-y-2"
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
            title={goal.description}
            tabIndex={selected || (!value && index === 0) ? 0 : -1}
            onClick={() => onChange(goal.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                event.preventDefault();
                move(index, 1);
              }
              if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                event.preventDefault();
                move(index, -1);
              }
            }}
            className="flex items-center gap-2 text-sm"
          >
            <Point state={selected ? "active" : "idle"} />
            <span
              className={
                selected
                  ? "font-medium text-foreground underline decoration-signal decoration-1 underline-offset-4"
                  : "text-muted-foreground transition-colors duration-200 hover:text-foreground"
              }
            >
              {SHORT_GOAL_LABEL[goal.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
