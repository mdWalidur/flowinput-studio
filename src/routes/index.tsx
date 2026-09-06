import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileText,
  LockKeyhole,
  MousePointer2,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoalIcon } from "@/components/goal-icon";
import { PageShell } from "@/components/page-shell";

import { GOALS } from "@/domain/goals";
import { SAMPLES } from "@/lib/sample-content";
import {
  SITE,
  organizationJsonLd,
  publicRouteMeta,
  webApplicationJsonLd,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    publicRouteMeta({
      path: "/",
      title:
        "FlowInput — turn rough material into something useful",
      description:
        "FlowInput turns notes, documents and half-formed ideas into clean Markdown, study packs, AI briefs, product plans and sharper prompts in your browser.",
    }),
  component: LandingPage,
});

const DEMO_INPUTS = [
  {
    id: "text",
    label: "Text",
    sampleId: "lecture",
  },
  {
    id: "document",
    label: "Document",
    sampleId: "product",
  },
  {
    id: "prompt",
    label: "Prompt / Idea",
    sampleId: "prompt",
  },
] as const;

const DEMO_GOALS = [
  { id: "markdown", label: "Markdown" },
  { id: "study", label: "Study" },
  { id: "ai-context", label: "AI Context" },
  { id: "spec", label: "App Plan" },
  { id: "prompt", label: "Better Prompt" },
] as const;

const DEMO_OUTPUT: Record<
  (typeof DEMO_GOALS)[number]["id"],
  string
> = {
  markdown:
    "# Cleaned Notes\n\n## Key points\n- Selective permeability\n- Active vs passive transport",

  study:
    "# Study Pack\n\n## Overview\n- Membrane transport controls exchange\n\n## Recall\n1. Explain osmosis.\n2. Compare active and passive transport.",

  "ai-context":
    "# Context Package\n\n## Instructions\n- Answer only from context\n- Cite chunk ids\n\nBEGIN_UNTRUSTED_CONTEXT\n[C1] ...",

  spec:
    "# Product Overview\n\n## Problem\nManual booking causes no-shows.\n\n## Target Users\n- Clinic owner\n- Receptionist\n- Patient\n\n## MVP Features\n1. Self-booking\n2. Reminder system\n3. Attendance reports",

  prompt:
    "ROLE\nYou are a senior prompt engineer.\n\nTASK\nCreate a cinematic lighthouse reel prompt for Instagram.\n\nCONSTRAINTS\n- 10 seconds\n- Moody, hopeful tone",
};

function LandingPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            organizationJsonLd(),
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webApplicationJsonLd(),
          ),
        }}
      />

      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="relative z-10">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em]"
              >
                A workspace for useful next versions
              </Badge>

              <h1 className="mt-7 max-w-4xl text-balance font-display text-6xl leading-[0.93] tracking-tight sm:text-7xl lg:text-[6.5rem]">
                Bring the messy
                <br />
                version.
                <br />
                Leave with momentum.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                {SITE.name} takes the notes, documents,
                requirements and half-formed ideas you already
                have and shapes them into something you can
                actually use next.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-6"
                >
                  <Link to="/workspace">
                    Open the workspace
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-5"
                >
                  <Link
                    to="/workspace"
                    search={{
                      goal: "study",
                      sample: "lecture",
                    }}
                  >
                    Try a sample
                  </Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.13em] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <LockKeyhole className="size-3.5" />
                  Runs in your browser
                </span>

                <span className="flex items-center gap-2">
                  <Sparkles className="size-3.5" />
                  No account required
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="border-y border-border bg-secondary/25 p-5 sm:p-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-muted-foreground">
                    The Flow
                  </span>

                  <span className="font-mono text-[10px] text-muted-foreground">
                    INPUT → OUTPUT
                  </span>
                </div>

                <div className="grid gap-5 py-7">
                  <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                    <div className="border border-border bg-background p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        Raw material
                      </p>

                      <p className="mt-5 text-sm leading-7 text-muted-foreground">
                        “A booking tool for small clinics.
                        Receptionists use WhatsApp. No-shows
                        cost money…”
                      </p>
                    </div>

                    <div className="bg-[#193f38] p-5 text-[#f7f3e9]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b7cec0]">
                        Useful next version
                      </p>

                      <h2 className="mt-5 max-w-sm font-display text-2xl leading-tight">
                        A booking flow people can trust
                      </h2>

                      <div className="mt-6 space-y-3">
                        {[
                          "Users and roles",
                          "MVP requirements",
                          "Proposed screens",
                          "Open questions",
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex gap-3 text-sm"
                          >
                            <Check className="mt-0.5 size-4 text-[#e39a69]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center py-1">
                    <ArrowDown
                      className="size-4 text-brand"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
                    <MiniStatement
                      label="Bring"
                      text="notes · PDF · idea"
                    />
                    <MiniStatement
                      label="Choose"
                      text="study · plan · prompt"
                    />
                    <MiniStatement
                      label="Take"
                      text="copy · save · download"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <div className="eyebrow">The idea</div>

            <h2 className="mt-5 max-w-xl font-display text-4xl tracking-tight sm:text-5xl">
              One place between
              <br />
              raw material
              <br />
              and useful work.
            </h2>
          </div>

          <div className="border-t border-border pt-7">
            <p className="max-w-3xl text-xl leading-8 sm:text-2xl sm:leading-9">
              You already have the material. The problem
              is the next step: cleaning it, structuring it,
              understanding it, or making it ready for another
              tool.
            </p>

            <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
              <Statement
                number="01"
                title="Bring anything"
                body="Notes, documents, prompts, requirements, research and ideas."
              />

              <Statement
                number="02"
                title="Choose the outcome"
                body="Tell FlowInput what useful form you need next."
              />

              <Statement
                number="03"
                title="Keep moving"
                body="Review it, copy it, download it or save it locally."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <div className="eyebrow">Try the product</div>

              <h2 className="mt-5 max-w-md font-display text-4xl tracking-tight sm:text-5xl">
                See the transformation before you start.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                Pick a kind of material and tell FlowInput
                what you need back.
              </p>
            </div>

            <FlowDemo />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <div className="eyebrow">Five directions</div>

            <h2 className="mt-5 max-w-md font-display text-4xl tracking-tight sm:text-5xl">
              Choose the shape of the answer.
            </h2>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {GOALS.map((goal, index) => (
              <Link
                key={goal.id}
                to="/workspace"
                search={{ goal: goal.id }}
                className="group grid gap-5 px-1 py-7 transition-colors hover:bg-secondary/45 sm:grid-cols-[58px_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="flex items-start gap-4">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-border">
                    <GoalIcon
                      icon={goal.icon}
                      className="size-4"
                    />
                  </span>

                  <span>
                    <span className="block font-display text-2xl tracking-tight">
                      {goal.label}
                    </span>

                    <span className="mt-1 block max-w-xl text-sm leading-6 text-muted-foreground">
                      {goal.description}
                    </span>
                  </span>
                </span>

                <ArrowRight
                  className="hidden size-4 text-brand transition-transform group-hover:translate-x-1 sm:block"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-[#193f38] text-[#f7f3e9]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#b7cec0]">
                Start without a blank page
              </div>

              <h2 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Bring something in.
                <br />
                Leave with a next step.
              </h2>
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#e39a69] px-6 text-[#193f38] hover:bg-[#efad80]"
            >
              <Link to="/workspace">
                Start something
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function MiniStatement({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">
        {label}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function Statement({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="font-mono text-xs text-brand">
        {number}
      </div>

      <h3 className="mt-4 font-display text-xl tracking-tight">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function FlowDemo() {
  const [inputId, setInputId] =
    useState<(typeof DEMO_INPUTS)[number]["id"]>(
      "document",
    );

  const [goalId, setGoalId] =
    useState<(typeof DEMO_GOALS)[number]["id"]>(
      "spec",
    );

  const sample = useMemo(() => {
    const selected = DEMO_INPUTS.find(
      (input) => input.id === inputId,
    );

    return (
      SAMPLES.find(
        (item) => item.id === selected?.sampleId,
      ) ?? SAMPLES[0]
    );
  }, [inputId]);

  const output =
    DEMO_OUTPUT[goalId];

  return (
    <div className="border-y border-border bg-background">
      <div className="grid divide-y border-border lg:grid-cols-[0.9fr_1.1fr] lg:divide-x lg:divide-y-0">
        <div className="p-6 sm:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-muted-foreground">
            01 / Input
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {DEMO_INPUTS.map((input) => (
              <button
                key={input.id}
                type="button"
                aria-pressed={inputId === input.id}
                onClick={() =>
                  setInputId(input.id)
                }
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  inputId === input.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {input.label}
              </button>
            ))}
          </div>

          <div className="mt-6 min-h-48 border border-border bg-secondary/30 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Raw material
              </span>

              <FileText className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {sample?.text ?? ""}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-muted-foreground">
            02 / Need
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {DEMO_GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                aria-pressed={goalId === goal.id}
                onClick={() =>
                  setGoalId(goal.id)
                }
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  goalId === goal.id
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-[#193f38] p-5 text-[#f7f3e9]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b7cec0]">
                03 / Output
              </span>

              <WandSparkles className="size-4 text-[#e39a69]" />
            </div>

            <pre className="mt-5 max-h-52 overflow-auto whitespace-pre-wrap font-mono text-[12px] leading-6">
              {output}
            </pre>

            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-[#b7cec0]">
              <MousePointer2 className="size-3.5" />
              Review it. Copy it. Take it somewhere useful.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}