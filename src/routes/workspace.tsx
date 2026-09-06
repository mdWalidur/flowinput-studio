import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GoalPicker } from "@/components/workspace/goal-picker";
import { InputStudio } from "@/components/workspace/input-studio";
import { OptionsPanel } from "@/components/workspace/options-panel";
import { ResultStudio } from "@/components/workspace/result-studio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { goalById } from "@/domain/goals";
import {
  DEFAULT_OPTIONS,
  DEFAULT_PROJECT_ID,
  type GoalId,
  type SourceDocument,
  type TransformOptions,
  type TransformResult,
  type WorkItem,
} from "@/domain/types";
import { TransformError, transform } from "@/lib/transform";
import { deriveTitle } from "@/lib/transform/text-utils";
import { useSaveWorkItem } from "@/hooks/use-work-items";
import { newId } from "@/services/work-item-repository";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Transform your content | FlowInput" },
      {
        name: "description",
        content:
          "Paste or upload content, pick a goal, and turn it into clean Markdown, a study pack, an AI context block, a product spec or an optimized prompt.",
      },
      { property: "og:title", content: "FlowInput Workspace" },
      {
        property: "og:description",
        content: "Input anything. Choose a goal. Get exactly what you need.",
      },
    ],
  }),
  component: WorkspacePage,
});

type Step = 1 | 2 | 3 | 4;

const STEPS: Array<{ id: Step; label: string }> = [
  { id: 1, label: "Input" },
  { id: 2, label: "Goal" },
  { id: 3, label: "Configure" },
  { id: 4, label: "Review" },
];

function WorkspacePage() {
  const [source, setSource] = useState<SourceDocument | null>(null);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [options, setOptions] = useState<TransformOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const saveItem = useSaveWorkItem();

  const canTransform = Boolean(source?.text.trim() && goalId);
  const title = source ? deriveTitle(source.text, source.name) : "Untitled";

  // Changing input or goal invalidates a previous result.
  useEffect(() => {
    setResult(null);
    setSavedId(null);
  }, [source?.id, goalId]);

  const runTransform = useCallback(async () => {
    if (!source || !goalId) return;
    setError(null);
    setRunning(true);
    // Yield a frame so the loading state paints before synchronous work.
    await new Promise((r) => window.setTimeout(r, 220));
    try {
      const next = transform(goalId, { source, options });
      setResult(next);
      window.setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60,
      );
    } catch (err) {
      setError(
        err instanceof TransformError
          ? err.message
          : "Something went wrong while transforming. Try again.",
      );
    } finally {
      setRunning(false);
    }
  }, [source, goalId, options]);

  const handleSave = async () => {
    if (!source || !goalId || !result) return;
    const now = new Date().toISOString();
    const item: WorkItem = {
      id: savedId ?? newId(),
      projectId: DEFAULT_PROJECT_ID,
      title,
      goalId,
      status: "completed",
      source,
      options,
      result,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await saveItem.mutateAsync(item);
      setSavedId(item.id);
      toast.success("Saved to your history");
    } catch {
      toast.error("We couldn’t save this locally. Your browser storage may be full.");
    }
  };

  const reset = () => {
    setSource(null);
    setGoalId(null);
    setOptions(DEFAULT_OPTIONS);
    setResult(null);
    setError(null);
    setSavedId(null);
  };

  const currentStep: Step = result ? 4 : goalId ? 3 : source ? 2 : 1;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">New transformation</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Input → choose goal → configure → transform → review.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
        </div>

        <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm" aria-label="Progress">
          {STEPS.map((step, i) => {
            const state =
              currentStep > step.id ? "done" : currentStep === step.id ? "current" : "todo";
            return (
              <li key={step.id} className="flex items-center gap-2">
                <span
                  className={
                    state === "todo"
                      ? "flex size-6 items-center justify-center rounded-full border border-border text-xs text-muted-foreground"
                      : state === "current"
                        ? "flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                        : "flex size-6 items-center justify-center rounded-full bg-success text-xs font-semibold text-success-foreground"
                  }
                >
                  {step.id}
                </span>
                <span
                  className={state === "todo" ? "text-muted-foreground" : "font-medium"}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  {step.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="hidden h-px w-8 bg-border sm:block" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-8 space-y-6">
          <section aria-labelledby="step-input" className="panel p-5 sm:p-6">
            <h2 id="step-input" className="font-display text-lg font-semibold">
              1. Input Studio
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Paste text or drop a file. TXT and Markdown flow straight through.
            </p>
            <InputStudio source={source} onChange={setSource} />
          </section>

          <section aria-labelledby="step-goal" className="panel p-5 sm:p-6">
            <h2 id="step-goal" className="font-display text-lg font-semibold">
              2. Choose your goal
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              One input, five different outputs. Pick what you actually need.
            </p>
            <GoalPicker value={goalId} onChange={setGoalId} />
          </section>

          <section aria-labelledby="step-config" className="panel p-5 sm:p-6">
            <h2 id="step-config" className="font-display text-lg font-semibold">
              3. Configure
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              {goalId
                ? `Fine-tune “${goalById(goalId).label}”.`
                : "Choose a goal above to see its settings."}
            </p>
            <OptionsPanel options={options} onChange={setOptions} />

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
              <Button onClick={() => void runTransform()} disabled={!canTransform || running}>
                {running ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="size-4" aria-hidden="true" />
                )}
                {running ? "Transforming…" : "Transform"}
                {!running && <ArrowRight className="size-4" aria-hidden="true" />}
              </Button>
              {!canTransform && (
                <p className="text-sm text-muted-foreground">
                  {source?.text.trim()
                    ? "Pick a goal to continue."
                    : "Add some readable text to continue."}
                </p>
              )}
            </div>
          </section>

          <section aria-labelledby="step-review" ref={resultRef} className="panel p-5 sm:p-6">
            <h2 id="step-review" className="font-display text-lg font-semibold">
              4. Result Studio
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Compare source and output, then copy, download or save.
            </p>

            {error && (
              <Alert variant="destructive" role="alert">
                <AlertTitle>That didn’t work</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {running && !result && (
              <div className="space-y-3" aria-live="polite">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-[26rem] w-full" />
              </div>
            )}

            {!running && !result && !error && (
              <div className="rounded-xl border border-dashed border-border bg-surface-2 p-10 text-center">
                <p className="text-sm font-medium">No result yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your transformed content will appear here.
                </p>
              </div>
            )}

            {result && source && (
              <div aria-live="polite">
                <ResultStudio
                  title={title}
                  source={source}
                  result={result}
                  onSave={() => void handleSave()}
                  saved={Boolean(savedId)}
                />
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
