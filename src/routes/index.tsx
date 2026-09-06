import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Lock, MousePointerClick, ShieldCheck, Zap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoalIcon } from "@/components/goal-icon";
import { GOALS } from "@/domain/goals";
import { SAMPLES } from "@/lib/sample-content";
import { SITE, organizationJsonLd, publicRouteMeta, webApplicationJsonLd } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    publicRouteMeta({
      path: "/",
      title: "FlowInput — bring your content, choose what you need back",
      description:
        "Open a Word file, a text-based PDF, Markdown or plain notes — or just paste them — and get clean Markdown, a study pack, an AI brief, a product plan or a sharper prompt. Runs in your browser.",
    }),
  component: LandingPage,
});

const SCENARIOS = [
  {
    who: "Students and researchers",
    line: "A dense chapter becomes an outline, the terms worth knowing, and questions to test yourself with.",
  },
  {
    who: "Developers and makers",
    line: "Messy notes become tidy Markdown, or a first product plan with pages, data and a rough order of work.",
  },
  {
    who: "Writers and creators",
    line: "A half-formed request becomes a clear, specific brief you can hand to an assistant or a collaborator.",
  },
];

const TRUST = [
  {
    icon: Lock,
    title: "No account, no upload",
    body: "Files are read inside your browser. Nothing is sent to a server, so there is nothing for us to keep.",
  },
  {
    icon: Zap,
    title: "Instant, and predictable",
    body: "Results come from fixed rules, not a model — the same input gives you the same output every time.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about limits",
    body: "Scanned PDFs have no text to read, and we say so instead of quietly returning something empty.",
  },
];

function LandingPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        // Static, first-party structured data — no user input is interpolated.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd(), webApplicationJsonLd()]),
        }}
      />

      <section className="relative overflow-hidden border-b border-border paper-lines">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="eyebrow">A content preparation workspace</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
            Bring your content. Choose what you need back.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            {SITE.name} takes the notes, documents and half-ideas you already have and turns them
            into something usable — structured, readable and ready to hand on.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/workspace">
                Start something
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/workspace" search={{ goal: "study" }}>
                Try it with sample notes
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to use, nothing to install, and your content never leaves your browser.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6" aria-labelledby="concept">
        <h2 id="concept" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
          Two questions, one useful result
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="panel p-5">
            <p className="eyebrow">Step one</p>
            <h3 className="mt-2 font-display text-lg font-medium">What do you have?</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>A Word document or a text-based PDF</li>
              <li>Markdown or a plain text file</li>
              <li>Text you paste straight in</li>
              <li>Or just an idea, described in a sentence</li>
            </ul>
          </div>
          <ArrowRight
            className="mx-auto hidden size-5 text-muted-foreground md:block"
            aria-hidden="true"
          />
          <div className="panel p-5">
            <p className="eyebrow">Step two</p>
            <h3 className="mt-2 font-display text-lg font-medium">What would you like to do?</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {GOALS.map((goal) => (
                <li key={goal.id} className="flex items-center gap-2">
                  <GoalIcon icon={goal.icon} className="size-3.5 text-primary" />
                  {goal.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="border-y border-border bg-surface-2"
        aria-labelledby="examples"
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <h2 id="examples" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Start from something real
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
Each of these waits for you in the workspace as a one-tap example, so you can see a
            finished result before you bring your own material.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {SAMPLES.map((sample, index) => (
              <article key={sample.id} className="panel flex flex-col p-5">
                <Badge variant="secondary" className="w-fit">
                  Example {index + 1}
                </Badge>
                <h3 className="mt-3 font-display text-lg font-medium">{sample.label}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{sample.hint}</p>
                <p className="mt-4 line-clamp-3 border-l-2 border-border pl-3 font-mono text-xs text-muted-foreground">
                  {sample.text.slice(0, 160)}…
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-fit">
                  <Link to="/workspace">
                    <MousePointerClick className="size-4" aria-hidden="true" />
                    Use this example
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6" aria-labelledby="who">
        <h2 id="who" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
          Who it's for
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {SCENARIOS.map((scenario) => (
            <div key={scenario.who}>
              <h3 className="font-display text-lg font-medium">{scenario.who}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{scenario.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border-y border-border bg-surface-2"
        aria-labelledby="how"
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <h2 id="how" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-4">
            {[
              { step: "Bring it in", body: "Drop a file, paste text, or describe an idea." },
              { step: "Say what you need", body: "Pick one of five outcomes in plain language." },
              { step: "Adjust a little", body: "Only the choices that matter for that outcome." },
              { step: "Take it away", body: "Read it, copy it, download it, or save it for later." },
            ].map((item, index) => (
              <li key={item.step}>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-medium">{item.step}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6" aria-labelledby="trust">
        <h2 id="trust" className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
          What you can count on
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TRUST.map((item) => (
            <div key={item.title} className="panel p-5">
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-medium">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          You keep the rights to whatever you bring, and you're responsible for having permission to
          use it. Read the{" "}
          <Link to="/terms" className="text-primary underline underline-offset-2">
            terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary underline underline-offset-2">
            privacy note
          </Link>
          .
        </p>
      </section>

      <section className="border-t border-border paper-lines">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <FileText className="mx-auto size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Find out what your notes are hiding
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Open the workspace, paste anything, and see a finished result in a few seconds.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link to="/workspace">
              Start something
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
