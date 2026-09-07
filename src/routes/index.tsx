import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Loader2, RotateCcw } from "lucide-react";

import { InputStudio } from "@/components/workspace/input-studio";
import { GoalPicker } from "@/components/workspace/goal-picker";
import { ResultStudio } from "@/components/workspace/result-studio";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { goalById } from "@/domain/goals";
import {
  DEFAULT_OPTIONS,
  type GoalId,
  type SourceDocument,
  type TransformResult,
} from "@/domain/types";
import { transform } from "@/lib/transform";
import {
  organizationJsonLd,
  publicRouteMeta,
  webApplicationJsonLd,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    publicRouteMeta({
      path: "/",
      title: "FlowPoint — turn source into a useful result",
      description:
        "Turn notes, documents and ideas into Markdown, study material, AI context, product plans and clearer prompts.",
    }),
  component: LandingPage,
});

function LandingPage() {
  const [source, setSource] = useState<SourceDocument | null>(null);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [working, setWorking] = useState(false);
  const goal = goalId ? goalById(goalId) : null;
  const ready = Boolean(source?.text.trim() && goalId);
  const title = useMemo(
    () => `${source?.name.replace(/\.[^.]+$/, "") ?? "Untitled"} — ${goal?.label ?? "Result"}`,
    [goal, source],
  );

  const run = () => {
    if (!source || !goalId) return;
    setWorking(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(transform(goalId, { source, options: DEFAULT_OPTIONS }));
      setWorking(false);
    }, 80);
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd()) }}
      />

      <section className="mx-auto w-full max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
        <header className="max-w-3xl">
          <h1 className="font-sans text-6xl font-semibold leading-none tracking-normal sm:text-8xl">
            FlowPoint
          </h1>
          <p className="mt-7 text-2xl leading-tight sm:text-4xl">
            Turn source material into a useful result.
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Add what you have, then choose what you want to make. Everything runs in your browser.
          </p>
        </header>

        <div className="mt-16 border-t border-border sm:mt-24">
          <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
            <section className="min-w-0 py-10 lg:border-r lg:border-border lg:pr-12" aria-labelledby="landing-source">
              <h2 id="landing-source" className="font-sans text-lg font-medium tracking-normal">
                What do you have?
              </h2>
              <div className="mt-6">
                <InputStudio
                  source={source}
                  onChange={(next) => {
                    setSource(next);
                    setResult(null);
                  }}
                />
              </div>
            </section>

            <section className="border-t border-border py-10 lg:border-t-0 lg:pl-12" aria-labelledby="landing-goal">
              <h2 id="landing-goal" className="font-sans text-lg font-medium tracking-normal">
                What would you like to make?
              </h2>
              <div className="mt-6">
                <GoalPicker value={goalId} onChange={(next) => { setGoalId(next); setResult(null); }} compact />
              </div>
              <Button type="button" onClick={run} disabled={!ready || working} className="mt-8 shadow-none">
                {working ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                {working ? "Making result…" : "Make result"}
                {!working ? <ArrowRight aria-hidden="true" /> : null}
              </Button>
            </section>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && source ? (
            <motion.section
              key={`${result.goalId}-${result.output.length}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border py-12"
              aria-live="polite"
            >
              <ResultStudio title={title} source={source} result={result} />
              <Button
                type="button"
                variant="ghost"
                className="mt-8"
                onClick={() => { setSource(null); setGoalId(null); setResult(null); }}
              >
                <RotateCcw aria-hidden="true" /> Start again
              </Button>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <p className="border-t border-border pt-8 text-sm text-muted-foreground">
          Source → direction → result. Local, deterministic, and always available for review.
        </p>
      </section>
    </PageShell>
  );
}