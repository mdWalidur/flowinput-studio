import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { DirectionLine } from "@/components/point";
import { GoalPicker } from "@/components/workspace/goal-picker";
import { InputStudio } from "@/components/workspace/input-studio";
import { OptionsPanel } from "@/components/workspace/options-panel";
import { ResultStudio } from "@/components/workspace/result-studio";

import { GOALS, SHORT_GOAL_LABEL, goalById } from "@/domain/goals";
import {
  DEFAULT_OPTIONS,
  DEFAULT_PROJECT_ID,
  type GoalId,
  type SourceDocument,
  type TransformOptions,
  type TransformResult,
  type WorkItem,
} from "@/domain/types";

import { useSaveWorkItem } from "@/hooks/use-work-items";
import { enter, reveal } from "@/lib/motion";
import { SAMPLES } from "@/lib/sample-content";
import { privateRouteMeta } from "@/lib/site";
import { documentTitle, textSource } from "@/lib/source";
import { TransformError, transform } from "@/lib/transform";
import { transformOptionsSchema } from "@/lib/validation";
import { StorageError, newId } from "@/services/work-item-repository";
import { takeDraft } from "@/services/draft-handoff";

const isGoalId = (value: unknown): value is GoalId =>
  typeof value === "string" && GOALS.some((goal) => goal.id === value);

const isSampleId = (value: unknown): value is string =>
  typeof value === "string" && SAMPLES.some((sample) => sample.id === value);

export const Route = createFileRoute("/workspace")({
  validateSearch: (search: Record<string, unknown>): { goal?: GoalId; sample?: string } => ({
    ...(isGoalId(search["goal"]) ? { goal: search["goal"] } : {}),
    ...(isSampleId(search["sample"]) ? { sample: search["sample"] } : {}),
  }),

  head: () =>
    privateRouteMeta(
      "Workspace — FlowPoint",
      "Bring in your source, choose a direction, and read the result.",
    ),

  component: WorkspacePage,
});

function WorkspacePage() {
  const { goal: goalFromUrl, sample: sampleFromUrl } = useSearch({ from: "/workspace" });
  const navigate = useNavigate();

  const [source, setSource] = useState<SourceDocument | null>(null);
  const [goalId, setGoalId] = useState<GoalId | null>(goalFromUrl ?? null);
  const [options, setOptions] = useState<TransformOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<TransformResult | null>(null);

  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const saveItem = useSaveWorkItem();

  /** Client-only: pick up a draft prepared on the landing page. */
  useEffect(() => {
    const draft = takeDraft();
    if (!draft) return;
    setSource(draft.source);
    setGoalId(draft.goalId);
  }, []);

  useEffect(() => {
    if (goalFromUrl) setGoalId(goalFromUrl);
  }, [goalFromUrl]);

  useEffect(() => {
    if (source || !sampleFromUrl) return;
    const sample = SAMPLES.find((item) => item.id === sampleFromUrl);
    if (sample) setSource(textSource(sample.text, sample.label));
  }, [sampleFromUrl, source]);

  const goal = goalId ? goalById(goalId) : null;
  const ready = Boolean(source?.text.trim() && goalId);

  const title = useMemo(
    () => (goal ? `${documentTitle(source)} — ${goal.label}` : documentTitle(source)),
    [source, goal],
  );

  const run = useCallback(() => {
    if (!source || !goalId) return;

    setWorking(true);
    setError(null);
    setResult(null);
    setSavedId(null);

    window.setTimeout(() => {
      try {
        const check = transformOptionsSchema.safeParse(options);
        if (!check.success) throw new TransformError("Please review the options and try again.");

        const { instructions, ...validated } = check.data;
        const next = transform(goalId, {
          source,
          options: instructions === undefined ? validated : { ...validated, instructions },
        });

        setResult(next);
        window.setTimeout(
          () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          60,
        );
      } catch (err) {
        setError(
          err instanceof TransformError
            ? err.message
            : "Something went wrong preparing this. Try again, or adjust your source.",
        );
      } finally {
        setWorking(false);
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
      onError: (saveError) =>
        toast.error(
          saveError instanceof StorageError
            ? saveError.message
            : "We couldn't save that. Download it instead.",
        ),
    });
  };

  const startOver = () => {
    setSource(null);
    setGoalId(null);
    setOptions(DEFAULT_OPTIONS);
    setResult(null);
    setError(null);
    setSavedId(null);
    void navigate({ to: "/workspace", search: {} });
    window.scrollTo({ top: 0 });
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-[72rem] px-6 pb-20 pt-10 sm:px-10">
        {/* Quiet document header: context, not chrome. */}
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4">
          <h1 className="text-xl">{source ? documentTitle(source) : "Untitled source"}</h1>

          <div className="flex items-baseline gap-6">
            <span className="label">
              {result
                ? "Result ready"
                : working
                  ? "Working…"
                  : goal
                    ? SHORT_GOAL_LABEL[goal.id]
                    : "No direction"}
            </span>

            {(source || result) && (
              <button
                type="button"
                onClick={startOver}
                className="text-sm text-muted-foreground underline decoration-rule decoration-1 underline-offset-4 hover:text-foreground"
              >
                Start over
              </button>
            )}
          </div>
        </header>

        <DirectionLine
          progress={result ? "complete" : working ? "working" : ready ? "selected" : "none"}
        />

        <section aria-label="Source" className="pt-8">
          <InputStudio
            source={source}
            onChange={(next) => {
              setSource(next);
              setResult(null);
              setSavedId(null);
              setError(null);
            }}
          />
        </section>

        {/* Control strip: direction, options and the single action, on one line where it fits. */}
        <section aria-label="Direction" className="rule-top mt-10 pt-5">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="label">Direction</span>

            <GoalPicker
              value={goalId}
              onChange={(id) => {
                setGoalId(id);
                setResult(null);
                setSavedId(null);
              }}
            />

            <button
              type="button"
              onClick={run}
              disabled={!ready || working}
              className="ml-auto bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity duration-200 hover:opacity-85 disabled:opacity-30"
            >
              {working ? "Working…" : "Make result →"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {goal && goal.options.length > 0 && (
              <motion.div key={goal.id} {...reveal} className="overflow-hidden">
                <div className="pt-5">
                  <OptionsPanel goal={goal} options={options} onChange={setOptions} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!ready && (
            <p className="pt-4 text-sm text-muted-foreground">
              {source ? "Choose what this should become." : "Add a source above to begin."}
            </p>
          )}

          {error && (
            <p role="alert" className="pt-4 text-sm text-destructive">
              {error}
            </p>
          )}
        </section>

        <AnimatePresence mode="wait">
          {result && source && (
            <motion.div
              key={`${result.goalId}-${result.output.length}`}
              ref={resultRef}
              {...enter}
              className="rule-top mt-14 pt-10"
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
