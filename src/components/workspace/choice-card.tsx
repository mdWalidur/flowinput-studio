import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  selected?: boolean;
  icon?: ReactNode;
  label: string;
  tagline?: string;
  description?: string;
  className?: string;
}

/**
 * Presentational shell for a "pick one of several" choice — icon, label,
 * tagline, selected mark, optional description. Callers own the interactive
 * element (button/link) and all ARIA/keyboard behavior; this only renders content.
 */
export function ChoiceCard({
  selected,
  icon,
  label,
  tagline,
  description,
  className,
}: ChoiceCardProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        {icon && (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors",
              selected && "bg-primary text-primary-foreground",
            )}
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-display text-[0.95rem] font-medium">{label}</p>
          {tagline && (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{tagline}</p>
          )}
        </div>
        {selected && <Check className="ml-auto size-4 shrink-0 text-primary" aria-hidden="true" />}
      </div>
      {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
