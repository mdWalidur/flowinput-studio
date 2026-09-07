import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import type {
  SourceDocument,
  TransformResult,
} from "@/domain/types";

import { goalById } from "@/domain/goals";
import { Button } from "@/components/ui/button";
import { ResultBody } from "@/components/workspace/result/result-body";
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
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-border pb-6">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-normal sm:text-4xl">
            {goal.label}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleCopy}
            className="shadow-none"
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
            className=""
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
              className=""
            >
              <Save className="size-4" />

              {saved ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <ResultBody result={result} sourceText={source.text} />
        </article>

        <aside className="self-start xl:sticky xl:top-28">
          <section className="border-y border-border py-5">
            <h3 className="text-sm font-medium">
              What changed
            </h3>

            <ul className="mt-4 space-y-3">
              {result.notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 text-sm leading-6"
                >
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            {result.stats.outputWords.toLocaleString()} words · about {result.stats.readingMinutes} min
          </p>
        </aside>
      </div>

      <div className="border-t border-border pt-5">
        <details>
          <summary className="cursor-pointer text-sm font-medium">Source</summary>
          <pre className="mt-5 max-h-80 overflow-auto whitespace-pre-wrap border-l border-border pl-5 text-sm leading-7 text-muted-foreground">{source.text}</pre>
        </details>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium">Raw {result.format === "md" ? "Markdown" : "text"}</summary>
          <pre className="mt-5 max-h-80 overflow-auto whitespace-pre-wrap border-l border-border pl-5 font-mono text-xs leading-6 text-muted-foreground">{result.output}</pre>
        </details>
      </div>
    </div>
  );
}