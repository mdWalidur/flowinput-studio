import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Check, Loader2, RotateCcw, Sparkles } from "lucide-react";
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
import { newId } from "@/services/work-item-repository";
import { privateRouteMeta } from "@/lib/site";
import { cn } from "@/lib/utils";

const isGoalId = (value: unknown): value is GoalId =>
  typeof value === "string" && GOALS.some((g) => g.id === value);

export const Route = createFileRoute("/workspace")({
  validateSearch: (search: Record<string, unknown>): { goal?: GoalId } =>
    isGoalId(search["goal"]) ? { goal: search["goal"] } : {},
  head: () =>
    privateRouteMeta(
      "Workspace — FlowInput",
      "Bring in your content, choose what you need back, and review the result.",
    ),
  component: WorkspacePage,
});

const STEPS = ["What do you have?", "What would you like to do?", "Set it up", "Your result"];

function WorkspacePage() {
  const { goal: goalFromUrl } = useSearch({ from: "/workspace" });
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

  useEffect(() => {
    if (goalFromUrl) setGoalId(goalFromUrl);
  }, [goalFromUrl]);

  const goal = goalId ? goalById(goalId) : null;
  const ready = Boolean(source?.text.trim() && goalId);

  const step = useMemo(() => {
    if (result) return 3;
    if (ready) return 2;
    if (source?.text.trim()) return 1;
    return 0;
  }, [result, ready, source]);

  const title = useMemo(() => {
    if (!source || !goal) return "Untitled";
    const stem = source.name.replace(/\.[^.]+$/, "");
    return `${stem} — ${goal.label}`;
  }, [source, goal]);

  const run = useCallback(() => {
    if (!source || !goalId) return;
    setWorking(true);
    setError(null);
    setResult(null);
    setSavedId(null);

    // Yield a frame so the processing state paints before the (synchronous) work.
    window.setTimeout(() => {
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
            : "Something went wrong preparing this. Try again, or adjust your input.",
        );
      } finally {
        setWorking(false);
      }
    }, 30);
  }, [source, goalId, options]);

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
      onError: () =>
        toast.error("We couldn't save that. Your browser storage may be full — try downloading it."),
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Let's get this into shape
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Four short steps. Everything happens on your device, and nothing is kept unless you
              save it.
            </p>
          </div>
          {(source || result) && (
            <Button type="button" variant="ghost" size="sm" onClick={startOver}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Start over
            </Button>
          )}
        </header>

        <ol className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Progress">
          {STEPS.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={cn(
                "flex items-center gap-2",
                index === step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border text-[11px]",
                  index < step && "border-primary bg-primary text-primary-foreground",
                  index === step && "border-primary text-primary",
                  index > step && "border-border",
                )}
              >
                {index < step ? <Check className="size-3" aria-hidden="true" /> : index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-6">
          <Section index={1} title="What do you have?">
            <InputStudio
              source={source}
              onChange={(next) => {
                setSource(next);
                setResult(null);
                setSavedId(null);
                setError(null);
              }}
            />
          </Section>

          <Section
            index={2}
            title="What would you like to do?"
            muted={!source?.text.trim()}
            hint={!source?.text.trim() ? "Add some content first." : undefined}
          >
            <GoalPicker
              value={goalId}
              onChange={(id) => {
                setGoalId(id);
                setResult(null);
                setSavedId(null);
              }}
            />
          </Section>

          {goal && (
            <Section index={3} title="Set it up">
              <OptionsPanel goal={goal} options={options} onChange={setOptions} />
            </Section>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" size="lg" onClick={run} disabled={!ready || working}>
              {working ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              {working ? "Working…" : goal ? goal.label : "Choose what you need"}
              {!working && <ArrowRight className="size-4" aria-hidden="true" />}
            </Button>
            {!ready && (
              <p className="text-sm text-muted-foreground">
                Add content and pick what you'd like back.
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" role="alert">
              <AlertTitle>That didn't work</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {working && (
            <div className="panel space-y-3 p-5" aria-live="polite">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>
          )}

          {result && source && (
            <div ref={resultRef}>
              <Section index={4} title="Your result">
                <ResultStudio
                  title={title}
                  source={source}
                  result={result}
                  onSave={save}
                  saved={Boolean(savedId)}
                />
              </Section>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function Section({
  index,
  title,
  children,
  muted,
  hint,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
  muted?: boolean;
  hint?: string | undefined;
}) {
  return (
    <section className={cn("panel p-5 sm:p-6", muted && "opacity-70")} aria-label={title}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-muted-foreground">{String(index).padStart(2, "0")}</span>
        <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
        {hint && <span className="ml-auto text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
