import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  LockKeyhole,
  MousePointer2,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoalIcon } from "@/components/goal-icon";
import { PageShell } from "@/components/page-shell";
import { GOALS } from "@/domain/goals";
import { SAMPLES } from "@/lib/sample-content";
import { SITE, publicRouteMeta } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    publicRouteMeta({
      path: "/",
      title: "FlowInput — turn rough material into something useful",
      description:
        "FlowInput turns notes, documents and half-formed ideas into clean Markdown, study packs, AI briefs, product plans and sharper prompts in your browser.",
    }),
  component: LandingPage,
});

const steps = [
  ["01", "Bring the raw material", "Paste notes, describe an idea, or open a text-based document."],
  ["02", "Choose the outcome", "Pick the format that matches what you need next."],
  ["03", "Take the result", "Review it, copy it, download it, or save it locally."],
] as const;

function LandingPage() {
  return (
    <PageShell>
      <section className="overflow-hidden border-b border-border bg-[#173c36] text-[#f7f3e9]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
          <div>
            <Badge className="border-white/20 bg-white/10 text-[#f7f3e9] hover:bg-white/10">
              A calmer first step
            </Badge>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">
              Start with the mess. Leave with momentum.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#d7e1d7]">
              {SITE.name} turns the notes, documents and half-ideas you already have into a clear
              next version — ready to read, share, build from or hand to an assistant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[#e18b5a] text-[#1d2923] hover:bg-[#eda477]">
                <Link to="/workspace">
                  Open the workspace <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-[#f7f3e9] hover:bg-white/10 hover:text-white"
              >
                <Link to="/workspace" search={{ goal: "study", sample: "lecture" }}>
                  Try sample notes
                </Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#b9d0c2]">
              <span className="flex items-center gap-2">
                <LockKeyhole className="size-4" /> Runs in your browser
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="size-4" /> No account required
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-[#e18b5a]/15 blur-3xl" />
            <div className="relative rounded-2xl border border-white/15 bg-[#f7f3e9] p-4 text-[#26342e] shadow-2xl sm:p-6">
              <div className="flex items-center justify-between border-b border-[#d9d4c8] pb-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <WandSparkles className="size-4 text-[#b45e38]" /> Your next version
                </div>
                <span className="font-mono text-[11px] text-[#77817a]">FLOW / 03</span>
              </div>
              <div className="grid gap-3 py-5 sm:grid-cols-[.8fr_1.2fr]">
                <div className="rounded-xl bg-[#e8e5da] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#77817a]">
                    Input
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#66706a]">
                    “A booking tool for small clinics. Receptionists use WhatsApp. No-shows cost
                    money…”
                  </p>
                  <div className="mt-5 flex gap-1">
                    <span className="h-1.5 w-10 rounded-full bg-[#b8c7bb]" />
                    <span className="h-1.5 w-16 rounded-full bg-[#b8c7bb]" />
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#b45e38]">
                    Product plan
                  </p>
                  <h2 className="mt-4 font-display text-xl">A booking flow people can trust</h2>
                  <ul className="mt-4 space-y-2 text-sm text-[#66706a]">
                    {[
                      "Users and roles",
                      "MVP requirements",
                      "Proposed screens",
                      "Open questions",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="size-3.5 text-[#2c8062]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-[#d9d4c8] pt-4 text-xs text-[#77817a]">
                <MousePointer2 className="size-3.5" /> Review, copy or download when it feels right.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="flow">
        <div className="max-w-2xl">
          <p className="eyebrow">A useful loop</p>
          <h2 id="flow" className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            Less formatting. More moving forward.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, body]) => (
            <div key={number} className="panel p-6">
              <span className="font-mono text-xs text-brand">{number}</span>
              <h3 className="mt-8 font-display text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-2" aria-labelledby="outcomes">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Five ways to begin</p>
              <h2 id="outcomes" className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
                Choose the shape of the answer.
              </h2>
            </div>
            <Link
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              to="/workspace"
            >
              See all in workspace <ArrowRight className="ml-1 inline size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {GOALS.map((goal) => (
              <Link
                key={goal.id}
                to="/workspace"
                search={{ goal: goal.id }}
                className="group rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lifted"
              >
                <GoalIcon icon={goal.icon} className="size-5 text-primary" />
                <h3 className="mt-8 font-display text-lg leading-tight">{goal.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{goal.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="examples">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">Start with a real example</p>
            <h2 id="examples" className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              You do not need a blank page.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Pick a sample to see the complete flow, then replace it with your own material. No
              setup, no account, no upload.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {SAMPLES.map((sample) => (
              <Link
                key={sample.id}
                to="/workspace"
                search={{
                  goal:
                    sample.id === "lecture" ? "study" : sample.id === "product" ? "spec" : "prompt",
                  sample: sample.id,
                }}
                className="panel group p-5 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <FileText className="size-5 text-brand" />
                  <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1" />
                </div>
                <h3 className="mt-8 font-display text-lg">{sample.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{sample.hint}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-[#e8e5da]" aria-labelledby="privacy">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-6">
          <div className="flex items-start gap-4">
            <BookOpen className="mt-1 size-5 text-primary" />
            <div>
              <h2 id="privacy" className="font-display text-xl">
                Your material stays yours.
              </h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Text transformations happen locally. Saved work stays in this browser, and
                unsupported files are described honestly instead of being sent somewhere unexpected.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/workspace">
              Make a first pass <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
