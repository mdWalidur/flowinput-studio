import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}

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
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="eyebrow">FlowInput</div>

      <h1 className="mt-6 max-w-2xl text-balance font-display text-4xl tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        {intro}
      </p>

      {updated && (
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Last updated {updated}
        </p>
      )}

      <div className="editorial-rule mt-12 space-y-10 pt-10 text-[0.96rem] leading-7">
        {children}
      </div>
    </article>
  );
}

export function ProseSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl tracking-tight">{heading}</h2>

      <div className="mt-4 space-y-3 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}