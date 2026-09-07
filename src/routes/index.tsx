import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Loader2, Paperclip, X } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { GOALS } from "@/domain/goals";
import {
  DEFAULT_OPTIONS,
  type GoalId,
  type SourceDocument,
  type SupportedExtension,
  type TransformResult,
} from "@/domain/types";
import { extractDocument } from "@/lib/parsing";
import { transform } from "@/lib/transform";
import { ACCEPT_ATTRIBUTE, extensionOf, MAX_TEXT_CHARS } from "@/lib/validation";
import { newId } from "@/services/work-item-repository";
import {
  organizationJsonLd,
  publicRouteMeta,
  webApplicationJsonLd,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    publicRouteMeta({
      path: "/",
      title: "FlowPoint — turn what you have into what’s next",
      description:
        "Turn notes, documents and ideas into Markdown, study material, AI context, product plans and clearer prompts.",
    }),
  component: LandingPage,
});

const goalNames: Record<GoalId, string> = {
  study: "Study",
  "ai-context": "AI Context",
  spec: "Product Plan",
  markdown: "Markdown",
  prompt: "Prompt",
};
const goalOrder: GoalId[] = ["study", "ai-context", "spec", "markdown", "prompt"];

function LandingPage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [goalId, setGoalId] = useState<GoalId>("study");
  const [result, setResult] = useState<TransformResult | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setSourceText = (value: string) => {
    setText(value.slice(0, MAX_TEXT_CHARS));
    setFileName(null);
    setResult(null);
    setError(null);
  };

  const readFile = async (file: File) => {
    setWorking(true);
    setError(null);
    try {
      const extracted = await extractDocument(file);
      setText(extracted.text);
      setFileName(file.name);
      setResult(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "That file could not be read.");
    } finally {
      setWorking(false);
    }
  };

  const makeSource = (): SourceDocument => ({
    id: newId(),
    kind: fileName ? "file" : "text",
    name: fileName ?? "Pasted text",
    extension: fileName ? (extensionOf(fileName) as SupportedExtension) : "text",
    mimeType: "text/plain",
    sizeBytes: new Blob([text]).size,
    text,
    engine: fileName ? "plain-text" : "typed",
    warnings: [],
    meta: { characters: text.length },
    createdAt: new Date().toISOString(),
  });

  const run = () => {
    if (!text.trim()) return;
    setWorking(true);
    window.setTimeout(() => {
      setResult(transform(goalId, { source: makeSource(), options: DEFAULT_OPTIONS }));
      setWorking(false);
    }, 80);
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd()) }} />

      <section className="mx-auto flex w-full max-w-5xl flex-col px-5 pb-16 pt-16 sm:min-h-[calc(100vh-8rem)] sm:justify-center sm:px-8 sm:py-20">
        <header className="max-w-3xl">
          <h1 className="font-sans text-5xl font-semibold leading-[1.02] tracking-normal sm:text-7xl">
            Turn what you have into what’s next.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">Choose a direction. Get a result you can use.</p>
        </header>

        <div className="mt-12 border border-border sm:mt-16">
          <div
            className="relative"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file) void readFile(file);
            }}
          >
            <textarea
              value={text}
              onChange={(event) => setSourceText(event.target.value)}
              placeholder="Paste something or drop a file"
              aria-label="Source material"
              className="min-h-52 w-full resize-y bg-transparent px-5 py-5 text-base leading-7 outline-none placeholder:text-muted-foreground sm:min-h-64 sm:px-7 sm:py-7"
            />
            <div className="flex min-h-12 items-center border-t border-border px-3 sm:px-5">
              <Button type="button" variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
                {working ? <Loader2 className="animate-spin" /> : <Paperclip />}
                {fileName ?? "Choose file"}
              </Button>
              {fileName ? (
                <Button type="button" variant="ghost" size="icon" aria-label="Remove file" onClick={() => { setText(""); setFileName(null); setResult(null); }}>
                  <X />
                </Button>
              ) : null}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_ATTRIBUTE}
                className="sr-only"
                aria-label="Choose a file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void readFile(file);
                }}
              />
              <span className="ml-auto text-xs text-muted-foreground">TXT, MD, DOCX, PDF</span>
            </div>
          </div>

          <div className="flex flex-col border-t border-border sm:flex-row sm:items-center">
            <div role="radiogroup" aria-label="Choose a direction" className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-4 sm:px-7">
              {goalOrder.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={goalId === id}
                  onClick={() => { setGoalId(id); setResult(null); }}
                  className={`py-1 text-sm transition-colors ${goalId === id ? "text-signal" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {goalNames[id]}
                </button>
              ))}
            </div>
            <Button type="button" onClick={run} disabled={!text.trim() || working} className="m-3 mt-0 self-start bg-signal text-signal-foreground shadow-none hover:bg-signal/90 sm:ml-auto sm:mt-3">
              Continue <ArrowRight />
            </Button>
          </div>
        </div>

        {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}

        <AnimatePresence mode="wait">
          {result ? (
            <motion.section
              key={result.goalId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-x border-b border-border"
              aria-live="polite"
            >
              <div className="px-5 py-6 sm:px-7">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-sans text-lg font-medium tracking-normal">{goalNames[result.goalId]}</h2>
                  <span className="text-xs text-muted-foreground">Local result</span>
                </div>
                <pre className="mt-4 max-h-44 overflow-auto whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{result.output}</pre>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </section>
    </PageShell>
  );
}