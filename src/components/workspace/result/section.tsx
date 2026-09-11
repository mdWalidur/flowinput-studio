import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one section rhythm every result composition uses: a mono key, a hairline,
 * and content at reading size. No cards, no icons.
 */
export function Section({
  title,
  note,
  first,
  children,
}: {
  title: string;
  note?: string;
  first?: boolean;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <section
      aria-labelledby={id}
      className={cn("pt-5", first ? "" : "mt-8 border-t border-border")}
    >
      <h3 id={id} className="label">
        {title}
      </h3>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
