import { cn } from "@/lib/utils";

export type PointState = "idle" | "active" | "working" | "done";

/**
 * FlowPoint's single visual primitive: the point where a flow changes
 * direction. It is the wordmark glyph, the selection marker, the working
 * indicator and the result marker — nothing else is invented.
 */
export function Point({ state = "idle", className }: { state?: PointState; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[5px] shrink-0 rounded-full transition-colors duration-200",
        state === "idle" && "bg-transparent outline outline-1 outline-offset-0 outline-rule",
        state === "active" && "bg-signal",
        state === "done" && "bg-foreground",
        state === "working" && "animate-pulse bg-signal",
        className,
      )}
    />
  );
}

/**
 * The 1px direction line. `progress` expresses selection → processing →
 * completion by how far the signal segment has travelled.
 */
export function DirectionLine({
  progress,
  className,
}: {
  progress: "none" | "selected" | "working" | "complete";
  className?: string;
}) {
  const width =
    progress === "none"
      ? "0%"
      : progress === "selected"
        ? "18%"
        : progress === "working"
          ? "62%"
          : "100%";

  return (
    <span aria-hidden="true" className={cn("relative block h-px w-full bg-border", className)}>
      <span
        className="absolute inset-y-0 left-0 bg-signal transition-[width] duration-[600ms] ease-[cubic-bezier(0.2,0,0,1)]"
        style={{ width }}
      />
    </span>
  );
}
