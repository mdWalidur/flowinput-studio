import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
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
      "Workspace — FlowInput",
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

  const currentStage = useMemo(() => {
    if (result) return 4;
    if (working) return 3;
    if (goalId) return 2;
    if (source?.text.trim()) return 1;
    return 0;
  }, [goalId, result, source, working]);

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

        const next = transform(goalId, {
          source,
          options: check.data,
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
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="max-w-4xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow">Workspace</div>

              <h1 className="mt-5 max-w-3xl text-balance text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                Turn what you have
                <br />
                into what you need.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Bring in the material. Choose the purpose.
                FlowInput shapes the next useful version.
              </p>
            </div>

            {(source || result) && (
              <Button
                type="button"
                variant="ghost"
                onClick={startOver}
                className="shrink-0 rounded-full"
              >
                <RotateCcw className="size-4" />
                Start over
              </Button>
            )}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            {[
              ["01", "Source"],
              ["02", "Purpose"],
              ["03", "Direction"],
              ["04", "Output"],
            ].map(([number, label], index) => (
              <div key={number} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border font-mono text-[10px]",
                    currentStage > index
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStage === index
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {currentStage > index ? (
                    <Check className="size-3" />
                  ) : (
                    number
                  )}
                </div>

                <span
                  className={cn(
                    "text-sm",
                    currentStage === index
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>

                {index < 3 && (
                  <ArrowRight
                    className="mx-1 size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </header>

        <div className="mt-20">
          <WorkspaceStage
            number="01"
            eyebrow="Source"
            title="Start with what you already have."
            description="Paste it, open a file, or begin with an idea."
          >
            <InputStudio
              source={source}
              onChange={(next) => {
                setSource(next);
                setResult(null);
                setSavedId(null);
                setError(null);
              }}
            />
          </WorkspaceStage>

          <FlowDivider />

          <WorkspaceStage
            number="02"
            eyebrow="Purpose"
            title="Choose what you need back."
            description="The purpose changes how FlowInput shapes the material."
            muted={!source?.text.trim()}
          >
            <GoalPicker
              value={goalId}
              onChange={(id) => {
                setGoalId(id);
                setResult(null);
                setSavedId(null);
              }}
            />
          </WorkspaceStage>

          {goal && (
            <>
              <FlowDivider />

              <WorkspaceStage
                number="03"
                eyebrow="Direction"
                title="Give the result a little direction."
              >
                <OptionsPanel
                  goal={goal}
                  options={options}
                  onChange={setOptions}
                />
              </WorkspaceStage>
            </>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              type="button"
              size="lg"
              onClick={run}
              disabled={!ready || working}
              className="rounded-full px-6"
            >
              {working ? (
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Sparkles
                  className="size-4"
                  aria-hidden="true"
                />
              )}

              {working
                ? "Working…"
                : goal
                  ? goal.label
                  : "Choose what you need"}

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

          {result && source && (
            <>
              <FlowDivider />

              <div ref={resultRef}>
                <WorkspaceStage
                  number="04"
                  eyebrow="Output"
                  title="Here's the version you can use."
                  description="Review it, copy it, download it, or save it for later."
                >
                  <ResultStudio
                    title={title}
                    source={source}
                    result={result}
                    onSave={save}
                    saved={Boolean(savedId)}
                  />
                </WorkspaceStage>
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function WorkspaceStage({
  number,
  eyebrow,
  title,
  description,
  children,
  muted,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      className={cn("relative", muted && "opacity-65")}
      aria-label={`${number} ${eyebrow}`}
    >
      <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="font-mono text-xs text-brand">
            {number}
          </div>

          <div className="mt-3 text-xs font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            {eyebrow}
          </div>
        </div>

        <div>
          <h2 className="max-w-3xl text-balance font-display text-3xl tracking-tight sm:text-4xl">
            {title}
          </h2>

          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          )}

          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowDivider() {
  return (
    <div
      className="my-14 flex items-center gap-4 lg:ml-[180px]"
      aria-hidden="true"
    >
      <div className="h-px flex-1 bg-border" />
      <div className="flex size-7 items-center justify-center rounded-full border border-border bg-background">
        <ArrowDown className="size-3.5 text-brand" />
      </div>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}