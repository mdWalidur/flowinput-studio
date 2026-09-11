import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import { Point } from "@/components/point";
import { GOALS, SHORT_GOAL_LABEL } from "@/domain/goals";
import type { GoalId, SourceDocument } from "@/domain/types";
import { extractDocument } from "@/lib/parsing";
import { SAMPLES } from "@/lib/sample-content";
import { fileSource, textSource } from "@/lib/source";
import { organizationJsonLd, publicRouteMeta, webApplicationJsonLd } from "@/lib/site";
import { ACCEPT_ATTRIBUTE, MAX_TEXT_CHARS } from "@/lib/validation";
import { putDraft } from "@/services/draft-handoff";

export const Route = createFileRoute("/")({
  head: () =>
    publicRouteMeta({
      path: "/",
      title: "FlowPoint — turn source material into a useful result",
      description:
        "Paste or open a document, choose a direction, and FlowPoint returns study material, AI context, a product plan, clean Markdown or a sharper prompt.",
    }),
  component: LandingPage,
});

/** The example that greets a first-time visitor: real source material, not marketing copy. */
const EXAMPLE = SAMPLES[0]!;

function LandingPage() {
  const navigate = useNavigate();
  const [text, setText] = useState(EXAMPLE.text);
  const [pristine, setPristine] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [goalId, setGoalId] = useState<GoalId>("study");
  const [reading, setReading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  /** The last file we read, kept so its real provenance survives the handoff. */
  const readRef = useRef<SourceDocument | null>(null);

  const sourceName = fileName ?? (pristine ? `${EXAMPLE.label} (example)` : "Pasted text");

  const write = (value: string) => {
    setText(value.slice(0, MAX_TEXT_CHARS));
    setPristine(false);
    setNotice(null);
  };

  const readFile = async (file: File) => {
    setReading(true);
    setNotice(null);
    try {
      const extracted = await extractDocument(file);
      readRef.current = fileSource(file, extracted);
      setText(extracted.text);
      setFileName(file.name);
      setPristine(false);
    } catch (reason) {
      setNotice(
        reason instanceof Error
          ? reason.message
          : "That file could not be read. Try pasting the text.",
      );
    } finally {
      setReading(false);
    }
  };

  const cont = () => {
    if (!text.trim()) {
      setNotice("Add something to work from — paste text or open a file.");
      editorRef.current?.focus();
      return;
    }

    const opened = readRef.current;
    const source =
      opened && opened.text === text ? opened : textSource(text, fileName ?? sourceName);

    putDraft({ source, goalId });

    void navigate({ to: "/workspace", search: { goal: goalId } });
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd()) }}
      />

      <div className="mx-auto max-w-[72rem] px-6 pb-16 pt-14 sm:px-10 sm:pt-20">
        <div className="grid gap-x-8 gap-y-6 lg:grid-cols-12">
          <h1 className="text-4xl sm:text-5xl lg:col-span-8">
            Turn what you have
            <br />
            into what’s next.
          </h1>

          <p className="label lg:col-span-3 lg:col-start-10 lg:self-end lg:text-right">
            Read in your browser · Deterministic · No account
          </p>
        </div>

        {/* The composer is the page. Everything else is a hairline around it. */}
        <section
          aria-label="Prepare your source"
          className="rule-top mt-10 sm:mt-14"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) void readFile(file);
          }}
        >
          <div className="flex items-baseline justify-between gap-4 py-3">
            <span className="label">Source</span>
            <span className="label truncate">{reading ? "Reading…" : sourceName}</span>
          </div>

          <div className="relative border-t border-rule">
            <textarea
              ref={editorRef}
              value={text}
              onChange={(event) => write(event.target.value)}
              onFocus={(event) => {
                if (pristine) event.currentTarget.select();
              }}
              spellCheck={false}
              aria-label="Source material"
              aria-describedby="source-hint"
              placeholder="Paste notes, a chapter, meeting minutes — or open a file"
              className="block h-[15rem] w-full resize-none overflow-auto bg-transparent px-0 py-5 font-mono text-sm leading-6 text-foreground outline-none placeholder:font-sans placeholder:text-base placeholder:text-muted-foreground sm:h-[17rem]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border py-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-foreground underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              Open a file
            </button>

            <span className="label">TXT · MD · DOCX · PDF</span>

            <p id="source-hint" className="label ml-auto">
              {pristine
                ? "Example — type to replace"
                : `${text.trim().length.toLocaleString()} characters`}
            </p>

            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              className="sr-only"
              aria-label="Open a file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void readFile(file);
              }}
            />
          </div>

          <div className="flex flex-col gap-4 border-t border-rule py-4 sm:flex-row sm:items-center">
            <div
              role="radiogroup"
              aria-label="Choose a direction"
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {GOALS.map((goal) => {
                const selected = goalId === goal.id;

                return (
                  <button
                    key={goal.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    onKeyDown={(event) => {
                      const step =
                        event.key === "ArrowRight" || event.key === "ArrowDown"
                          ? 1
                          : event.key === "ArrowLeft" || event.key === "ArrowUp"
                            ? -1
                            : 0;
                      if (!step) return;
                      event.preventDefault();
                      const index = GOALS.findIndex((item) => item.id === goalId);
                      const next = GOALS[(index + step + GOALS.length) % GOALS.length]!;
                      setGoalId(next.id);
                      const nodes = event.currentTarget.parentElement?.querySelectorAll("button");
                      const target = nodes?.[(index + step + GOALS.length) % GOALS.length];
                      (target as HTMLButtonElement | undefined)?.focus();
                    }}
                    onClick={() => setGoalId(goal.id)}
                    className="flex items-center gap-2 text-sm transition-colors duration-200"
                  >
                    <Point state={selected ? "active" : "idle"} />
                    <span
                      className={
                        selected
                          ? "font-medium text-foreground underline decoration-signal decoration-1 underline-offset-4"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      {SHORT_GOAL_LABEL[goal.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={cont}
              className="self-start bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity duration-200 hover:opacity-85 sm:ml-auto sm:self-auto"
            >
              Continue →
            </button>
          </div>

          {notice && (
            <p role="alert" className="border-t border-border py-3 text-sm text-destructive">
              {notice}
            </p>
          )}
        </section>

        <section
          aria-label="How FlowPoint works"
          className="rule-top mt-16 grid gap-y-6 pt-6 sm:grid-cols-3 sm:gap-x-8"
        >
          {[
            ["01", "Source", "Your notes, document or rough idea, read in this browser."],
            ["02", "Direction", "The point where the flow turns: choose what it should become."],
            ["03", "Result", "A finished document to read, copy, download or keep."],
          ].map(([index, heading, body]) => (
            <div key={index}>
              <p className="label">{index}</p>
              <h2 className="mt-2 text-lg">{heading}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
