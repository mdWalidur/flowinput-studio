import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { Point } from "@/components/point";
import { ResultBody } from "@/components/workspace/result/result-body";
import { SHORT_GOAL_LABEL } from "@/domain/goals";
import type { SourceDocument, TransformResult } from "@/domain/types";
import { copyToClipboard, downloadText } from "@/lib/download";
import { reveal } from "@/lib/motion";

interface Props {
  title: string;
  source: SourceDocument;
  result: TransformResult;
  onSave?: () => void;
  saved?: boolean;
}

type Disclosure = "changed" | "source" | "raw";

/**
 * The result is the product. A quiet header, the document at a reading measure,
 * and one secondary disclosure row that reveals a single thing at a time.
 */
export function ResultStudio({ title, source, result, onSave, saved }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<Disclosure | null>(null);

  const handleCopy = async () => {
    const ok = await copyToClipboard(result.output);

    if (!ok) {
      toast.error("Copying was blocked. Select the text and copy it manually.");
      return;
    }

    setCopied(true);
    toast.success("Copied to your clipboard");
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    downloadText(title, result.output, result.format);
    toast.success(`Downloaded as .${result.format}`);
  };

  const quiet =
    "text-sm text-muted-foreground underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-foreground";

  return (
    <div>
      <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-8">
        <div className="flex items-baseline gap-2">
          <Point state="done" className="translate-y-[-2px]" />
          <h2 className="text-2xl">{SHORT_GOAL_LABEL[result.goalId]}</h2>
          <span className="label ml-2">
            {result.stats.outputWords.toLocaleString()} words · {result.stats.readingMinutes} min
            read
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={handleCopy}
            className="text-sm font-medium text-foreground underline decoration-signal decoration-1 underline-offset-4"
          >
            {copied ? "Copied" : "Copy"}
          </button>

          <button type="button" onClick={handleDownload} className={quiet}>
            Download .{result.format}
          </button>

          {onSave && (
            <button type="button" onClick={onSave} disabled={saved} className={quiet}>
              {saved ? "Saved" : "Save"}
            </button>
          )}
        </div>
      </header>

      <article className="measure">
        <ResultBody result={result} sourceText={source.text} />
      </article>

      <div className="rule-top mt-14">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          {(
            [
              ["changed", "What changed"],
              ["source", "Source"],
              ["raw", result.format === "md" ? "Raw Markdown" : "Raw text"],
            ] as Array<[Disclosure, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-expanded={open === key}
              onClick={() => setOpen(open === key ? null : key)}
              className="flex items-center gap-2 text-sm"
            >
              <Point state={open === key ? "active" : "idle"} />
              <span
                className={
                  open === key
                    ? "font-medium text-foreground underline decoration-signal decoration-1 underline-offset-4"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence initial={false} mode="wait">
          {open && (
            <motion.div key={open} {...reveal} className="overflow-hidden">
              <div className="border-t border-border py-5">
                {open === "changed" && (
                  <ul className="measure space-y-2 text-sm text-muted-foreground">
                    {result.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                )}

                {open === "source" && (
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs leading-6 text-muted-foreground">
                    {source.text}
                  </pre>
                )}

                {open === "raw" && (
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs leading-6 text-muted-foreground">
                    {result.output}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
