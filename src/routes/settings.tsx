import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, FileWarning, HardDrive, Lock } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { MAX_FILE_BYTES, MAX_TEXT_CHARS, formatBytes } from "@/lib/validation";
import { privateRouteMeta } from "@/lib/site";

export const Route = createFileRoute("/settings")({
  head: () =>
    privateRouteMeta(
      "Settings — FlowInput",
      "Where your content lives, the current limits, and what is planned next.",
    ),
  component: SettingsPage,
});

const LIMITS = [
  { label: "Largest file", value: formatBytes(MAX_FILE_BYTES) },
  { label: "Most text at once", value: `${MAX_TEXT_CHARS.toLocaleString()} characters` },
  { label: "Files that fully work", value: ".txt, .md, .docx, text-based .pdf" },
  { label: "Not supported yet", value: "Scanned PDFs and photos of text (needs OCR)" },
];

const PLANNED = [
  {
    icon: Lock,
    title: "Accounts",
    body: "Sign in so your work follows you between devices instead of living in one browser.",
  },
  {
    icon: Database,
    title: "Saved to the cloud",
    body: "Optional storage for your saved items, with clear controls to export or delete everything.",
  },
  {
    icon: FileWarning,
    title: "Scanned documents",
    body: "Reading text out of scans and photos, handled on a server rather than in your browser.",
  },
];

function SettingsPage() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="eyebrow">Settings</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          How this version works
        </h1>
        <p className="mt-3 text-muted-foreground">
          There isn't much to configure yet, and that's deliberate — nothing here needs an account.
        </p>

        <section className="panel mt-8 p-5 sm:p-6" aria-labelledby="storage">
          <div className="flex items-start gap-3">
            <HardDrive className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <h2 id="storage" className="font-display text-xl font-medium">
                Your content stays with you
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Files are opened and read inside your browser. Results are worked out on your device
                with fixed rules. Nothing is uploaded, and nothing is sent to an AI service. Anything
                you press Save on is stored in this browser only — see{" "}
                <Link to="/my-work" className="text-primary underline underline-offset-2">
                  My work
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary underline underline-offset-2">
                  privacy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="panel mt-4 p-5 sm:p-6" aria-labelledby="limits">
          <h2 id="limits" className="font-display text-xl font-medium">
            Current limits
          </h2>
          <dl className="mt-4 divide-y divide-border text-sm">
            {LIMITS.map((limit) => (
              <div key={limit.label} className="flex flex-wrap gap-x-4 gap-y-1 py-2.5">
                <dt className="text-muted-foreground">{limit.label}</dt>
                <dd className="ml-auto text-right font-medium">{limit.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-4" aria-labelledby="planned">
          <h2 id="planned" className="font-display text-xl font-medium">
            What's planned
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Listed honestly: none of this exists in the app today.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PLANNED.map((item) => (
              <div key={item.title} className="panel p-4">
                <item.icon className="size-4 text-brand" aria-hidden="true" />
                <div className="mt-3 flex items-center gap-2">
                  <h3 className="font-display text-base font-medium">{item.title}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    Planned
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
