import { cn } from "@/lib/utils";

/**
 * FlowInput mark: a page edge turning into a clean stack of lines —
 * content going in, structure coming out. Drawn, not a stock icon.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      role="img"
      aria-label="FlowInput"
      fill="none"
    >
      <rect x="1" y="1" width="30" height="30" rx="8" fill="currentColor" opacity="0.08" />
      <path
        d="M8 8.5h9.5L23 14v9.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path d="M11 15h11M11 19h8M11 23h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
