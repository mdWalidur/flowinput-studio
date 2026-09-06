import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Save,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

import type {
  SourceDocument,
  TransformResult,
} from "@/domain/types";

import { goalById } from "@/domain/goals";
import { Button } from "@/components/ui/button";
import { MarkdownView } from "@/components/markdown-view";
import {
  copyToClipboard,
  downloadText,
} from "@/lib/download";

interface Props {
  title: string;
  source: SourceDocument;
  result: TransformResult;
  onSave?: () => void;
  saved?: boolean;
}

export function ResultStudio({
  title,
  source,
  result,
  onSave,
  saved,
}: Props) {
  const [copied, setCopied] = useState(false);

  const goal = goalById(result.goalId);

  const handleCopy = async () => {
    const ok = await copyToClipboard(result.output);

    if (!ok) {
      toast.error(
        "Copying was blocked. Select the text and copy it manually.",
      );
      return;
    }

    setCopied(true);

    toast.success("Copied to your clipboard");

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const handleDownload = () => {
    downloadText(
      title,
      result.output,
      result.format,
    );

    toast.success(
      `Saved as a .${result.format} file`,
    );
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
            Prepared result
          </p>

          <h3 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
            {goal.label}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {result.stats.inputWords.toLocaleString()} words in
            <span className="mx-2">·</span>
            {result.stats.outputWords.toLocaleString()} out
            <span className="mx-2">·</span>
            about {result.stats.readingMinutes} min
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleCopy}
            className="rounded-full"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}

            {copied ? "Copied" : "Copy"}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="rounded-full"
          >
            <Download className="size-4" />
            Download .{result.format}
          </Button>

          {onSave && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onSave}
              disabled={saved}
              className="rounded-full"
            >
              <Save className="size-4" />

              {saved ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_280px]">
        <article className="result-paper min-w-0">
          <div className="px-5 py-7 sm:px-10 sm:py-10 lg:px-14">
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Result
              </span>

              <span className="text-xs text-muted-foreground">
                Prepared locally
              </span>
            </div>

            {result.format === "md" ? (
              <div className="max-w-3xl">
                <MarkdownView markdown={result.output} />
              </div>
            ) : (
              <pre className="max-w-3xl whitespace-pre-wrap font-mono text-[13px] leading-7">
                {result.output}
              </pre>
            )}
          </div>
        </article>

        <aside className="self-start xl:sticky xl:top-28">
          <section className="border-y border-border py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              What changed
            </p>

            <ul className="mt-4 space-y-3">
              {result.notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 text-sm leading-6"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-brand"
                    aria-hidden="true"
                  />

                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 border-b border-border pb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Source
            </p>

            <p className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">
              {source.text}
            </p>

            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
              onClick={() => {
                document
                  .getElementById("flowinput-source-preview")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              View source
              <ArrowUpRight className="size-3.5" />
            </button>
          </section>
        </aside>
      </div>

      <section
        id="flowinput-source-preview"
        className="border-t border-border pt-6"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Original material
        </p>

        <div className="mt-4 max-h-80 overflow-auto border-y border-border bg-secondary/30 px-5 py-5">
          <pre className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {source.text}
          </pre>
        </div>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Prepared on your device with deterministic rules.
          No AI provider was used for this result.
        </p>
      </section>
    </div>
  );
}