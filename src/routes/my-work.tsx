import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Download, FileStack, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MarkdownView } from "@/components/markdown-view";
import { goalById } from "@/domain/goals";
import { SOURCE_ENGINE_LABEL } from "@/domain/types";
import { useClearWorkItems, useDeleteWorkItem, useWorkItems } from "@/hooks/use-work-items";
import { copyToClipboard, downloadText } from "@/lib/download";
import { privateRouteMeta } from "@/lib/site";

export const Route = createFileRoute("/my-work")({
  head: () =>
    privateRouteMeta(
      "My work — FlowInput",
      "Everything you saved, kept in this browser: source, goal, result and when you made it.",
    ),
  component: MyWorkPage,
});

function MyWorkPage() {
  const { data: items, isPending } = useWorkItems();
  const remove = useDeleteWorkItem();
  const clear = useClearWorkItems();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">My work</p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              What you've saved
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Saved items stay in this browser only. Clearing your browser data removes them, so
              download anything you want to keep.
            </p>
          </div>
          {items && items.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Trash2 className="size-4" aria-hidden="true" />
                  Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove everything you've saved?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This deletes all {items.length} saved items from this browser. It can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep them</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      clear.mutate();
                      toast.success("Cleared");
                    }}
                  >
                    Delete all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </header>

        <div className="mt-8 space-y-4">
          {isPending && (
            <>
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </>
          )}

          {!isPending && (!items || items.length === 0) && (
            <div className="panel flex flex-col items-center gap-3 p-10 text-center">
              <FileStack className="size-6 text-muted-foreground" aria-hidden="true" />
              <p className="font-display text-lg font-medium">Nothing saved yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Prepare something in the workspace, then press Save and it will show up here.
              </p>
              <Button asChild className="mt-2">
                <Link to="/workspace">Start something</Link>
              </Button>
            </div>
          )}

          {items?.map((item) => {
            const goal = goalById(item.goalId);
            const open = openId === item.id;
            return (
              <article key={item.id} className="panel p-5">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-display text-lg font-medium">{item.title}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{goal.label}</Badge>
                      <span>{SOURCE_ENGINE_LABEL[item.source.engine]}</span>
                      <span>·</span>
                      <span>{item.result?.stats.outputWords.toLocaleString() ?? 0} words out</span>
                      <span>·</span>
                      <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenId(open ? null : item.id)}
                      aria-expanded={open}
                    >
                      {open ? "Hide" : "Open"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void navigate({ to: "/workspace", search: { goal: item.goalId } })
                      }
                    >
                      Do it again
                    </Button>
                    {item.result && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const ok = await copyToClipboard(item.result?.output ?? "");
                            ok
                              ? toast.success("Copied")
                              : toast.error("Copying was blocked by your browser.");
                          }}
                        >
                          <Copy className="size-4" aria-hidden="true" />
                          <span className="sr-only">Copy result</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            item.result &&
                            downloadText(item.title, item.result.output, item.result.format)
                          }
                        >
                          <Download className="size-4" aria-hidden="true" />
                          <span className="sr-only">Download result</span>
                        </Button>
                      </>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        remove.mutate(item.id);
                        toast.success("Deleted");
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>

                {open && item.result && (
                  <div className="mt-4 max-h-96 overflow-auto rounded-lg border border-border bg-surface-2 p-4">
                    {item.result.format === "md" ? (
                      <MarkdownView markdown={item.result.output} />
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
                        {item.result.output}
                      </pre>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
