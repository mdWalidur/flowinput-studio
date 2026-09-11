import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import { MAX_FILE_BYTES, MAX_TEXT_CHARS, formatBytes } from "@/lib/validation";
import { privateRouteMeta } from "@/lib/site";

export const Route = createFileRoute("/settings")({
  head: () =>
    privateRouteMeta(
      "Settings — FlowPoint",
      "Where your content lives, the current limits, and what is planned next.",
    ),
  component: SettingsPage,
});

const LIMITS = [
  ["Largest file", formatBytes(MAX_FILE_BYTES)],
  ["Most text at once", `${MAX_TEXT_CHARS.toLocaleString()} characters`],
  ["Files that fully work", ".txt, .md, .docx, text-based .pdf"],
  ["Not supported yet", "Scanned PDFs and photos of text (needs OCR)"],
];

const PLANNED = [
  ["Accounts", "Sign in so your work follows you between devices instead of living in one browser."],
  ["Saved to the cloud", "Optional storage for saved items, with clear export and delete controls."],
  ["Scanned documents", "Reading text out of scans and photos, handled on a server."],
];

function SettingsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[72rem] px-6 pb-20 pt-10 sm:px-10">
        <header className="pb-5">
          <h1 className="text-2xl">How this version works</h1>
          <p className="measure mt-2 text-sm text-muted-foreground">
            There isn't much to configure yet, and that's deliberate — nothing here needs an account.
          </p>
        </header>

        <section className="rule-top pt-5" aria-labelledby="storage">
          <h2 id="storage" className="label">
            Where your content lives
          </h2>
          <p className="measure mt-3 text-base leading-7">
            Files are opened and read inside your browser. Results are worked out on your device with
            fixed rules — nothing is uploaded and nothing is sent to an AI service. Anything you save
            stays in this browser only; see{" "}
            <Link to="/my-work" className="underline decoration-rule underline-offset-4">
              My work
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline decoration-rule underline-offset-4">
              privacy
            </Link>
            .
          </p>
        </section>

        <section className="mt-10 border-t border-border pt-5" aria-labelledby="limits">
          <h2 id="limits" className="label">
            Current limits
          </h2>
          <dl className="measure mt-4">
            {LIMITS.map(([label, value]) => (
              <div key={label} className="flex flex-wrap gap-x-6 border-b border-border py-3 text-base">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="ml-auto text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10 border-t border-border pt-5" aria-labelledby="planned">
          <h2 id="planned" className="label">
            Planned — none of this exists today
          </h2>
          <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {PLANNED.map(([title, body]) => (
              <div key={title}>
                <h3 className="text-base">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
