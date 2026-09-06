import { useState } from "react";
import { Check, Copy, Download, Save } from "lucide-react";
import { toast } from "sonner";
import type { SourceDocument, TransformResult } from "@/domain/types";
import { goalById } from "@/domain/goals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const handleCopy = async () => {
    const ok = await copyToClipboard(result.output);
    if (ok) {
      setCopied(true);
      toast.success("Result copied to your clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copying was blocked. Select the text and copy manually.");
    }
  };

  const handleDownload = () => {
    downloadText(title, result.output, result.format);
    toast.success(`Downloaded as .${result.format}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{goal.label}</Badge>
        <span className="text-sm text-muted-foreground">
          {result.stats.inputWords.toLocaleString()} words in ·{" "}
          {result.stats.outputWords.toLocaleString()} words out · ~
          {result.stats.readingMinutes} min read
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
              {saved ? "Saved" : "Save to history"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="output">
        <TabsList>
          <TabsTrigger value="output">Result</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>

        <TabsContent value="output" className="mt-3">
          <ScrollArea className="h-[26rem] rounded-xl border border-border bg-surface-2">
            <pre className="whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed">
              {result.output}
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="source" className="mt-3">
          <ScrollArea className="h-[26rem] rounded-xl border border-border bg-surface-2">
            <pre className="whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-muted-foreground">
              {source.text}
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div>
        <Separator className="mb-3" />
        <p className="text-sm font-medium">What we did</p>
        <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
          {result.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Transformations run locally with deterministic rules — no AI service is connected
          in this version.
        </p>
      </div>
    </div>
  );
}
