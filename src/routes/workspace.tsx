import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { InputStudio } from "@/components/workspace/input-studio";
import { GoalPicker } from "@/components/workspace/goal-picker";
import { OptionsPanel } from "@/components/workspace/options-panel";
import { ResultStudio } from "@/components/workspace/result-studio";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { goalById, GOALS } from "@/domain/goals";
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
import { useSaveWorkItem } from "@/hooks/use-work-items";
import {
  StorageError,
  newId,
} from "@/services/work-item-repository";
import { privateRouteMeta } from "@/lib/site";
import { SAMPLES } from "@/lib/sample-content";
import { transformOptionsSchema } from "@/lib/validation";

const isGoalId = (value: unknown): value is GoalId =>
  typeof value === "string" && GOALS.some((goal) => goal.id === value);

const isSampleId = (value: unknown): value is string =>
  typeof value === "string" &&
  SAMPLES.some((sample) => sample.id === value);

export const Route = createFileRoute("/workspace")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { goal?: GoalId; sample?: string } => ({
    ...(isGoalId(search["goal"]) ? { goal: search["goal"] } : {}),
    ...(isSampleId(search["sample"])
      ? { sample: search["sample"] }
      : {}),
  }),

  head: () =>
    privateRouteMeta(
      "Workspace — FlowPoint",
      "Bring in your content, choose what you need back, and review the result.",
    ),

  component: WorkspacePage,
});

function WorkspacePage() {
  const { goal: goalFromUrl, sample: sampleFromUrl } = useSearch({
    from: "/workspace",
  });

  const navigate = useNavigate();

  const [source, setSource] =
    useState<SourceDocument | null>(null);
  const [goalId, setGoalId] =
    useState<GoalId | null>(goalFromUrl ?? null);
  const [options, setOptions] =
    useState<TransformOptions>(DEFAULT_OPTIONS);
  const [result, setResult] =
    useState<TransformResult | null>(null);

  const [working, setWorking] = useState(false);
  const [processingStage, setProcessingStage] =
    useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const saveItem = useSaveWorkItem();

  useEffect(() => {
    if (goalFromUrl) {
      setGoalId(goalFromUrl);
    }
  }, [goalFromUrl]);

  useEffect(() => {
    if (source || !sampleFromUrl) return;

    const sample = SAMPLES.find(
      (item) => item.id === sampleFromUrl,
    );

    if (!sample) return;

    const now = new Date().toISOString();

    setSource({
      id: newId(),
      kind: "text",
      name: sample.label,
      extension: "text",
      mimeType: "text/plain",
      sizeBytes: new Blob([sample.text]).size,
      text: sample.text,
      engine: "typed",
      warnings: [],
      meta: {
        characters: sample.text.length,
      },
      createdAt: now,
    });
  }, [sampleFromUrl, source]);

  const goal = goalId ? goalById(goalId) : null;

  const ready = Boolean(
    source?.text.trim() && goalId,
  );

  const title = useMemo(() => {
    if (!source || !goal) return "Untitled";

    const stem = source.name.replace(
      /\.[^.]+$/,
      "",
    );

    return `${stem} — ${goal.label}`;
  }, [source, goal]);

  const run = useCallback(() => {
    if (!source || !goalId) return;

    setWorking(true);
    setProcessingStage("Preparing your result");
    setError(null);
    setResult(null);
    setSavedId(null);

    window.setTimeout(() => {
      try {
        const check =
          transformOptionsSchema.safeParse(options);

        if (!check.success) {
          throw new TransformError(
            "Please review your preparation options and try again.",
          );
        }

        setProcessingStage("Organizing your content");

        const { instructions, ...validatedOptions } = check.data;
        const next = transform(goalId, {
          source,
          options:
            instructions === undefined
              ? validatedOptions
              : { ...validatedOptions, instructions },
        });

        setProcessingStage("Building your output");
        setResult(next);

        window.setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 60);
      } catch (err) {
        setError(
          err instanceof TransformError
            ? err.message
            : "Something went wrong preparing this. Try again, or adjust your input.",
        );
      } finally {
        setWorking(false);
        setProcessingStage(null);
      }
    }, 30);
  }, [goalId, options, source]);

  const save = () => {
    if (!source || !goalId || !result) return;

    const now = new Date().toISOString();

    const item: WorkItem = {
      id: newId(),
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

    saveItem.mutate(item, {
      onSuccess: () => {
        setSavedId(item.id);
        toast.success("Saved to My work");
      },

      onError: (saveError) => {
        toast.error(
          saveError instanceof StorageError
            ? saveError.message
            : "We couldn't save that. Try downloading it instead.",
        );
      },
    });
  };

  const startOver = () => {
    setSource(null);
    setGoalId(null);
    setOptions(DEFAULT_OPTIONS);
    setResult(null);
    setError(null);
    setSavedId(null);

    void navigate({
      to: "/workspace",
      search: {},
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <header className="border-b border-border pb-8 sm:pb-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="font-sans text-3xl font-semibold leading-none tracking-normal sm:text-5xl">
                Workspace
              </h1>
            </div>

            {(source || result) && (
              <Button
                type="button"
                variant="ghost"
                onClick={startOver}
                className="shrink-0"
              >
                <RotateCcw className="size-4" />
                Start over
              </Button>
            )}
          </div>

        </header>

        <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
            <section className="min-w-0 py-10 lg:border-r lg:border-border lg:pr-12" aria-label="Source">
              <div>
              <InputStudio source={source} onChange={(next) => {
                setSource(next); setResult(null); setSavedId(null); setError(null);
              }} />
            </div>
          </section>

          <div className="border-t border-border py-10 lg:border-t-0 lg:pl-12">
            <section aria-label="Direction">
              <div>
                <GoalPicker value={goalId} onChange={(id) => { setGoalId(id); setResult(null); setSavedId(null); }} compact />
              </div>
            </section>

            <AnimatePresence initial={false}>
              {goal ? (
                <motion.section
                  key={goal.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden border-b border-border py-6"
                  aria-label="Options"
                >
                  <OptionsPanel goal={goal} options={options} onChange={setOptions} />
                </motion.section>
              ) : null}
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              type="button"
              size="lg"
              onClick={run}
              disabled={!ready || working}
              className="shadow-none"
            >
              {working ? (
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                null
              )}

              {working
                ? "Working…"
                : goal
                  ? "Make result"
                  : "Choose a direction"}

              {!working && (
                <ArrowRight className="size-4" />
              )}
            </Button>

            {!ready && (
              <p className="text-sm text-muted-foreground">
                Add content and pick what you'd like back.
              </p>
            )}
            </div>

            {error && (
            <Alert
              variant="destructive"
              role="alert"
              className="mt-8"
            >
              <AlertTitle>That didn't work</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            )}
          </div>
        </div>

          {working && (
            <div
              className="mt-12 border-y border-border py-8"
              aria-live="polite"
            >
              <p className="text-sm font-medium">
                {processingStage ?? "Working…"}
              </p>

              <div className="mt-5 space-y-3">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {result && source && (
              <motion.div
                key={`${result.goalId}-${result.output.length}`}
                ref={resultRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border py-12 sm:py-16"
              >
                  <ResultStudio
                    title={title}
                    source={source}
                    result={result}
                    onSave={save}
                    saved={Boolean(savedId)}
                  />
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </PageShell>
  );
}