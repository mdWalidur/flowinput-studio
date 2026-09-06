import { useState } from "react";
import { Check, Copy, Download, Save } from "lucide-react";
import { toast } from "sonner";
import type { SourceDocument, TransformResult } from "@/domain/types";
import { goalById } from "@/domain/goals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownView } from "@/components/markdown-view";
import { copyToClipboard, downloadText } from "@/lib/download";

interface Props {
  title: string;
  source: SourceDocument;
  result: TransformResult;
  onSave?: () => void;
  saved?: boolean;
}

export function ResultStudio({ title, source, result, onSave, saved }: Props) {
  const [copied, setCopied] = useState(false);
  const goal = goalById(result.goalId);
  const isMarkdown = result.format === "md";
  const promptSourcePreview =
    source.text.length > 800
      ? `${source.text.slice(0, 800)}\n\n[truncated for preview]`
      : source.text;

  const handleCopy = async () => {
    const ok = await copyToClipboard(result.output);
    if (ok) {
      setCopied(true);
      toast.success("Copied to your clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copying was blocked. Select the text and copy it manually.");
    }
  };

  const handleDownload = () => {
    downloadText(title, result.output, result.format);
    toast.success(`Saved as a .${result.format} file`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{goal.label}</Badge>
        <Badge variant="outline">Prepared locally</Badge>
        <span className="text-sm text-muted-foreground">
          {result.stats.inputWords.toLocaleString()} words in ·{" "}
          {result.stats.outputWords.toLocaleString()} out · about {result.stats.readingMinutes} min
          to read
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
            <Download className="size-4" aria-hidden="true" />
            Download .{result.format}
          </Button>
          {onSave && (
            <Button type="button" size="sm" onClick={onSave} disabled={saved}>
              <Save className="size-4" aria-hidden="true" />
              {saved ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="result">
        <TabsList>
          <TabsTrigger value="result">Result</TabsTrigger>
          {isMarkdown && <TabsTrigger value="raw">Raw Markdown</TabsTrigger>}
          <TabsTrigger value="source">Your source</TabsTrigger>
        </TabsList>

        <TabsContent value="result" className="mt-3">
          <ScrollArea className="h-[28rem] rounded-xl border border-border bg-surface">
            <div className="p-5 sm:p-6">
              {isMarkdown ? (
                <MarkdownView markdown={result.output} />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
                  {result.output}
                </pre>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {isMarkdown && (
          <TabsContent value="raw" className="mt-3">
            <ScrollArea className="h-[28rem] rounded-xl border border-border bg-surface-2">
              <pre className="whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed">
                {result.output}
              </pre>
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="source" className="mt-3">
          <ScrollArea className="h-[28rem] rounded-xl border border-border bg-surface-2">
            <pre className="whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-muted-foreground">
              {source.text}
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <p className="text-sm font-medium">What we changed</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {result.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Prepared on your device with deterministic rules. No AI provider was used for this result.
        </p>
      </div>

      {result.goalId === "prompt" && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm font-medium">Prompt comparison</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <p
                id="prompt-original-preview-label"
                className="text-xs uppercase tracking-wide text-muted-foreground"
              >
                Original
              </p>
              <pre
                aria-labelledby="prompt-original-preview-label"
                className="mt-1 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-muted-foreground"
              >
                {promptSourcePreview}
              </pre>
            </div>
            <div>
              <p
                id="prompt-improved-preview-label"
                className="text-xs uppercase tracking-wide text-muted-foreground"
              >
                Improved
              </p>
              <pre
                aria-labelledby="prompt-improved-preview-label"
                className="mt-1 whitespace-pre-wrap font-mono text-[12px] leading-relaxed"
              >
                {result.output}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
