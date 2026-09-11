import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}

/** Shared layout for the legal and support pages: one measure, one rhythm. */
export function ProsePage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-[72rem] px-6 py-16 sm:px-10 sm:py-24">
      <div className="grid gap-x-8 gap-y-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          <p className="measure mt-5 text-lg text-muted-foreground">{intro}</p>
        </div>

        {updated && (
          <p className="label lg:col-span-3 lg:col-start-10 lg:self-end">Updated {updated}</p>
        )}
      </div>

      <div className="measure rule-top mt-14 space-y-10 pt-10">{children}</div>
    </article>
  );
}

export function ProseSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg">{heading}</h2>
      <div className="mt-3 space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
