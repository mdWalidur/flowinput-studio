import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileDown, Layers, Lock, Zap } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GoalIcon } from "@/components/goal-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GOALS } from "@/domain/goals";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowInput — Input anything. Get what you need." },
      {
        name: "description",
        content:
          "Paste or upload your content, choose a goal, and get clean Markdown, a study pack, an AI-ready context block, a product spec or an optimized prompt in seconds.",
      },
      { property: "og:title", content: "FlowInput — Input anything. Get what you need." },
      {
        property: "og:description",
        content:
          "One input, five useful outputs: Markdown, study pack, AI context, product spec, optimized prompt.",
      },
    ],
  }),
  component: LandingPage,
});

const AUDIENCES = [
  { title: "Students", body: "Turn lecture notes into a study pack with recall questions." },
  { title: "Developers", body: "Shape rough notes into a buildable product specification." },
  { title: "Researchers", body: "Package sources into referenced context for an assistant." },
  { title: "Creators", body: "Rewrite a rough idea into a precise image or video prompt." },
];

const HOW = [
  { step: "01", title: "Input", body: "Paste text or drop a TXT or Markdown file." },
  { step: "02", title: "Choose a goal", body: "Five outcomes, one shared source." },
  { step: "03", title: "Review and take it", body: "Copy it, or download a real .md or .txt file." },
];

const PROMISES = [
  { icon: Zap, title: "Instant, deterministic", body: "Runs in your browser — no queue, no waiting." },
  { icon: Lock, title: "Private by default", body: "Your content is never uploaded in this version." },
  { icon: FileDown, title: "Real files out", body: "Copy to clipboard or download .md / .txt." },
  { icon: Layers, title: "One source, many outputs", body: "Switch goals without re-entering anything." },
];

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-3xl">
              <Badge variant="outline" className="bg-surface font-normal">
                Early build · works offline in your browser
              </Badge>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-6xl">
                Input anything.
                <br />
                Get what you need.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                FlowInput takes whatever you have — notes, an article, a half-formed idea — and
                turns it into the exact artefact you need next. Not just a converter, not just a
                prompt toy.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/workspace">
                    Start transforming
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/history">
                    <Clock className="size-4" aria-hidden="true" />
                    See recent work
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No sign-up. Example content is loaded for you, so you can test the whole flow in
                under a minute.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="goals">
          <h2 id="goals" className="text-2xl font-semibold sm:text-3xl">
            Five goals, one input
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pick the outcome and FlowInput restructures your content for it. Every goal produces
            something you can copy or download immediately.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GOALS.map((goal) => (
              <li key={goal.id} className="panel flex h-full flex-col p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <GoalIcon icon={goal.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{goal.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{goal.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {goal.audience.map((a) => (
                    <Badge key={a} variant="outline" className="font-normal">
                      {a}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
            <li className="flex h-full flex-col justify-center rounded-xl border border-dashed border-border bg-surface-2 p-5">
              <h3 className="font-display text-base font-semibold">Creative Studio</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Image and video workflows reuse the same projects and history. Coming next.
              </p>
            </li>
          </ul>
        </section>

        <section className="border-y border-border bg-surface-2" aria-labelledby="how">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="how" className="text-2xl font-semibold sm:text-3xl">
              How it works
            </h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {HOW.map((item) => (
                <li key={item.step}>
                  <span className="font-mono text-sm text-primary">{item.step}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="why">
          <h2 id="why" className="text-2xl font-semibold sm:text-3xl">
            Built to feel fast and trustworthy
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <li key={p.title} className="panel p-5">
                <p.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-display text-base font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-labelledby="who">
          <h2 id="who" className="text-2xl font-semibold sm:text-3xl">
            Made for how you already work
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a) => (
              <li key={a.title} className="rounded-xl border border-border p-5">
                <h3 className="font-display text-base font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>

          <div className="panel mt-10 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-semibold">Try it with our example notes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Load a sample, pick a goal, and see the finished result — no account needed.
              </p>
            </div>
            <Button asChild size="lg" className="sm:ml-auto">
              <Link to="/workspace">
                Open the workspace
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
