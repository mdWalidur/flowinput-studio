import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FlowStageProps {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FlowStage({
  number,
  eyebrow,
  title,
  description,
  children,
  className,
}: FlowStageProps) {
  return (
    <section className={cn("relative", className)}>
      <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="font-mono text-xs text-brand">{number}</span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            {title}
          </h2>

          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}