import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { Point } from "@/components/point";
import { ResultBody } from "@/components/workspace/result/result-body";
import { SHORT_GOAL_LABEL } from "@/domain/goals";
import { SOURCE_ENGINE_LABEL } from "@/domain/types";
import { useClearWorkItems, useDeleteWorkItem, useWorkItems } from "@/hooks/use-work-items";
import { copyToClipboard, downloadText } from "@/lib/download";
import { reveal } from "@/lib/motion";
import { privateRouteMeta } from "@/lib/site";
import { StorageError } from "@/services/work-item-repository";

export const Route = createFileRoute("/my-work")({
  head: () =>
    privateRouteMeta(
      "My work — FlowPoint",
      "Everything you saved, kept in this browser: source, direction, result and when you made it.",
    ),
  component: MyWorkPage,
});

const quiet =
  "text-sm text-muted-foreground underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-foreground";

function MyWorkPage() {
  const { data: items, isPending } = useWorkItems();
  const remove = useDeleteWorkItem();
  const clear = useClearWorkItems();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <PageShell>
      <div className="mx-auto max-w-[72rem] px-6 pb-20 pt-10 sm:px-10">
        <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-5">
          <div>
            <h1 className="text-2xl">What you've saved</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Saved items stay in this browser only. Download anything you want to keep.
            </p>
          </div>

          {items && items.length > 0 && (
            <button
              type="button"
              className={quiet}
              onClick={() =>
                clear.mutate(undefined, {
                  onSuccess: () => toast.success("Cleared"),
                  onError: (error) =>
                    toast.error(
                      error instanceof StorageError
                        ? error.message
                        : "Could not clear saved work in this browser.",
                    ),
                })
              }
            >
              Clear all
            </button>
          )}
        </header>

        <div className="rule-top">
          {isPending && (
            <p className="label py-6" aria-live="polite">
              Loading your saved work…
            </p>
          )}

          {!isPending && (!items || items.length === 0) && (
            <div className="py-16">
              <p className="text-lg">Nothing saved yet</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Make something in the workspace, press Save, and it will be listed here.
              </p>
              <Link
                to="/workspace"
                className="mt-5 inline-block bg-foreground px-4 py-2 text-sm font-medium text-background"
              >
                Start something →
              </Link>
            </div>
          )}

          {items?.map((item) => {
            const open = openId === item.id;

            return (
              <article key={item.id} className="border-b border-border py-5">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base">{item.title}</h2>
                    <p className="label mt-1.5">
                      {SHORT_GOAL_LABEL[item.goalId]} · {SOURCE_ENGINE_LABEL[item.source.engine]} ·{" "}
                      {item.result?.stats.outputWords.toLocaleString() ?? 0} words ·{" "}
                      <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </time>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Point state={open ? "active" : "idle"} />
                      <span className={open ? "font-medium" : "text-muted-foreground"}>
                        {open ? "Hide" : "Open"}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={quiet}
                      onClick={() =>
                        void navigate({ to: "/workspace", search: { goal: item.goalId } })
                      }
                    >
                      Do it again
                    </button>

                    {item.result && (
                      <>
                        <button
                          type="button"
                          className={quiet}
                          onClick={async () => {
                            const ok = await copyToClipboard(item.result?.output ?? "");
                            if (ok) toast.success("Copied");
                            else toast.error("Copying was blocked by your browser.");
                          }}
                        >
                          Copy
                        </button>

                        <button
                          type="button"
                          className={quiet}
                          onClick={() => {
                            if (!item.result) return;
                            downloadText(item.title, item.result.output, item.result.format);
                          }}
                        >
                          Download
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className={quiet}
                      onClick={() =>
                        remove.mutate(item.id, {
                          onSuccess: () => toast.success("Deleted"),
                          onError: (error) =>
                            toast.error(
                              error instanceof StorageError
                                ? error.message
                                : "Could not delete this item from browser storage.",
                            ),
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {open && item.result && (
                    <motion.div {...reveal} className="overflow-hidden">
                      <div className="measure max-h-[32rem] overflow-auto border-t border-border pt-5 mt-5">
                        <ResultBody result={item.result} sourceText={item.source.text} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
