import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Copy, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GoalIcon } from "@/components/goal-icon";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { goalById } from "@/domain/goals";
import { copyToClipboard, downloadText } from "@/lib/download";
import {
  useClearWorkItems,
  useDeleteWorkItem,
  useWorkItems,
} from "@/hooks/use-work-items";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Your saved transformations | FlowInput" },
      {
        name: "description",
        content:
          "Revisit, copy, download or delete every transformation you saved in FlowInput. Stored on this device for now.",
      },
      { property: "og:title", content: "FlowInput History" },
      {
        property: "og:description",
        content: "Every saved transformation, ready to copy or download again.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { data, isLoading } = useWorkItems();
  const remove = useDeleteWorkItem();
  const clearAll = useClearWorkItems();
  const [openId, setOpenId] = useState<string | null>(null);

  const items = data ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Recent work</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Saved on this device only. Sign-in and cloud sync come later.
            </p>
          </div>
          {items.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="size-4" aria-hidden="true" />
                  Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all saved work?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes every saved transformation from this device. It can’t be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep them</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      void clearAll.mutateAsync().then(() => toast.success("History cleared"));
                    }}
                  >
                    Delete all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {isLoading && (
          <div className="mt-8 space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-surface-2 p-12 text-center">
            <Clock className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 font-medium">Nothing saved yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Run a transformation and hit “Save to history”.
            </p>
            <Button asChild className="mt-5">
              <Link to="/workspace">Open the workspace</Link>
            </Button>
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {items.map((item) => {
            const goal = goalById(item.goalId);
            const expanded = openId === item.id;
            return (
              <li key={item.id} className="panel p-4 sm:p-5">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <GoalIcon icon={goal.icon} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="font-normal">
                        {goal.label}
                      </Badge>
                      <span>{new Date(item.updatedAt).toLocaleString()}</span>
                      <span>{item.source.name}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenId(expanded ? null : item.id)}
                      aria-expanded={expanded}
                    >
                      {expanded ? "Hide" : "Preview"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void copyToClipboard(item.result?.output ?? "").then((ok) =>
                          ok ? toast.success("Copied") : toast.error("Copying was blocked"),
                        );
                      }}
                      aria-label={`Copy result of ${item.title}`}
                    >
                      <Copy className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        item.result &&
                        downloadText(item.title, item.result.output, item.result.format)
                      }
                      aria-label={`Download result of ${item.title}`}
                    >
                      <Download className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        void remove.mutateAsync(item.id).then(() => toast.success("Deleted"));
                      }}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                {expanded && item.result && (
                  <ScrollArea className="mt-4 h-64 rounded-lg border border-border bg-surface-2">
                    <pre className="whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed">
                      {item.result.output}
                    </pre>
                  </ScrollArea>
                )}
              </li>
            );
          })}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
