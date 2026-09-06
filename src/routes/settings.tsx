import { createFileRoute } from "@tanstack/react-router";
import { Cloud, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MAX_FILE_BYTES, MAX_TEXT_CHARS, formatBytes } from "@/lib/validation";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Account, storage and limits | FlowInput" },
      {
        name: "description",
        content:
          "FlowInput settings: current limits, where your data lives, and the accounts, cloud sync and AI connections planned next.",
      },
      { property: "og:title", content: "FlowInput Settings" },
      {
        property: "og:description",
        content: "Current limits, local-only storage, and what’s coming next.",
      },
    ],
  }),
  component: SettingsPage,
});

const PLANNED = [
  {
    icon: KeyRound,
    title: "Accounts and sign-in",
    body: "Email and social sign-in, so your work follows you across devices.",
  },
  {
    icon: Cloud,
    title: "Cloud sync and PDF/DOCX reading",
    body: "Server-side text extraction plus synced history and shared projects.",
  },
  {
    icon: ShieldCheck,
    title: "Assistant connections",
    body: "Optional AI providers for smarter summaries and rewrites, off by default.",
  },
];

function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This is an early build, so most controls arrive with accounts.
        </p>

        <section className="panel mt-8 p-5 sm:p-6" aria-labelledby="privacy">
          <h2 id="privacy" className="flex items-center gap-2 font-display text-lg font-semibold">
            <Lock className="size-4 text-primary" aria-hidden="true" />
            Where your data lives
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Your text is transformed inside your browser — nothing is uploaded.</li>
            <li>Saved work is stored on this device and cleared when you clear history.</li>
            <li>No accounts, no tracking of your content, no third-party AI calls.</li>
          </ul>
        </section>

        <section className="panel mt-4 p-5 sm:p-6" aria-labelledby="limits">
          <h2 id="limits" className="font-display text-lg font-semibold">
            Current limits
          </h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface-2 p-3">
              <dt className="text-xs text-muted-foreground">Max file size</dt>
              <dd className="mt-1 font-medium">{formatBytes(MAX_FILE_BYTES)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 p-3">
              <dt className="text-xs text-muted-foreground">Max pasted characters</dt>
              <dd className="mt-1 font-medium">{MAX_TEXT_CHARS.toLocaleString()}</dd>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 p-3">
              <dt className="text-xs text-muted-foreground">Saved items kept</dt>
              <dd className="mt-1 font-medium">50</dd>
            </div>
          </dl>
        </section>

        <section className="panel mt-4 p-5 sm:p-6" aria-labelledby="planned">
          <h2 id="planned" className="font-display text-lg font-semibold">
            Coming next
          </h2>
          <Separator className="my-4" />
          <ul className="space-y-4">
            {PLANNED.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {item.title}
                    <Badge variant="outline" className="font-normal">
                      Planned
                    </Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
