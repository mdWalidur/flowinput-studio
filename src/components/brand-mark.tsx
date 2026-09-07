import { cn } from "@/lib/utils";

/** FlowPoint mark: one source point becoming a deliberate direction. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      role="img"
      aria-label="FlowPoint"
      fill="none"
    >
      <path
        d="M3 16h10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.42"
      />
      <circle cx="16" cy="16" r="3.25" fill="currentColor" />
      <path
        d="M19.5 16H29M23.5 16l-3.75-6M23.5 16l-3.75 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="10" r="1.25" fill="currentColor" opacity="0.58" />
      <circle cx="20" cy="22" r="1.25" fill="currentColor" opacity="0.58" />
    </svg>
  );
}
