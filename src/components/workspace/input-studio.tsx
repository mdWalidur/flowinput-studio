import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, FileText, Info, Lightbulb, Loader2, Upload, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLES } from "@/lib/sample-content";
import { ExtractionError, extractDocument } from "@/lib/parsing";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_BYTES,
  MAX_TEXT_CHARS,
  MIN_TEXT_CHARS,
  extensionOf,
  formatBytes,
} from "@/lib/validation";
import { newId } from "@/services/work-item-repository";
import { SOURCE_ENGINE_LABEL, type SourceDocument, type SupportedExtension } from "@/domain/types";
import { cn } from "@/lib/utils";

interface Props {
  source: SourceDocument | null;
  onChange: (source: SourceDocument | null) => void;
}

const MIN_IDEA_CHARS = 12;

export function InputStudio({ source, onChange }: Props) {
  const [mode, setMode] = useState<"upload" | "paste" | "idea">("paste");
  const [text, setText] = useState(source && source.kind !== "file" ? source.text : "");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [readingName, setReadingName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaId = useId();

  useEffect(() => () => abortRef.current?.abort(), []);

  const minChars = mode === "idea" ? MIN_IDEA_CHARS : MIN_TEXT_CHARS;

  const commitText = useCallback(
    (next: string, kind: "text" | "idea") => {
      setText(next);
      const trimmed = next.trim();
      const floor = kind === "idea" ? MIN_IDEA_CHARS : MIN_TEXT_CHARS;

      if (trimmed.length === 0) {
        setError(null);
        onChange(null);
        return;
      }
      if (trimmed.length < floor) {
        setError(null); // the counter already explains it; no need to shout
        onChange(null);
        return;
      }
      if (trimmed.length > MAX_TEXT_CHARS) {
        setError(`That's longer than the ${MAX_TEXT_CHARS.toLocaleString()} character limit.`);
        onChange(null);
        return;
      }

      setError(null);
      onChange({
        id: newId(),
        kind,
        name: kind === "idea" ? "Your idea" : "Pasted text",
        extension: "text",
        mimeType: "text/plain",
        sizeBytes: new Blob([next]).size,
        text: next,
        engine: "typed",
        warnings: [],
        createdAt: new Date().toISOString(),
      });
    },
    [onChange],
  );

  const handleFile = useCallback(
    async (file: File) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      setReadingName(file.name);
      try {
        const extracted = await extractDocument(file, controller.signal);
        if (controller.signal.aborted) return;
        setText(extracted.text);
        onChange({
          id: newId(),
          kind: "file",
          name: file.name,
          extension: (extensionOf(file.name) || "text") as SupportedExtension,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          text: extracted.text,
          engine: extracted.engine,
          warnings: extracted.warnings,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("extract failed", err);
        setError(
          err instanceof ExtractionError
            ? err.message
            : "We couldn't read that file. Try another one, or paste the text instead.",
        );
        onChange(null);
      } finally {
        if (!controller.signal.aborted) setReadingName(null);
      }
    },
    [onChange],
  );

  const cancelReading = () => {
    abortRef.current?.abort();
    setReadingName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const clear = () => {
    abortRef.current?.abort();
    setText("");
    setError(null);
    setReadingName(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="paste" className="flex-1 sm:flex-none">
            Paste text
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1 sm:flex-none">
            Open a file
          </TabsTrigger>
          <TabsTrigger value="idea" className="flex-1 sm:flex-none">
            Start with an idea
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor={textareaId} className="mr-auto text-sm">
              Your content
            </Label>
            {SAMPLES.map((sample) => (
              <Button
                key={sample.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => commitText(sample.text, "text")}
                title={sample.hint}
              >
                Try: {sample.label}
              </Button>
            ))}
          </div>
          <TextField
            id={textareaId}
            value={text}
            onChange={(v) => commitText(v, "text")}
            placeholder="Paste notes, an article, a chapter, meeting minutes…"
            minChars={minChars}
            rows="min-h-56"
            help="Nothing leaves your browser."
            invalid={Boolean(error)}
          />
        </TabsContent>

        <TabsContent value="idea" className="mt-4 space-y-3">
          <div className="flex items-start gap-2 rounded-lg border border-border bg-accent/40 px-3 py-2.5 text-sm">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <p className="text-muted-foreground">
              No document yet? Describe what you have in mind in a sentence or two — this works best
              with <span className="text-foreground">Improve a Prompt</span> and{" "}
              <span className="text-foreground">Turn into a Website or App Plan</span>.
            </p>
          </div>
          <TextField
            id={`${textareaId}-idea`}
            value={text}
            onChange={(v) => commitText(v, "idea")}
            placeholder="A booking tool for small physio clinics that stops late cancellations…"
            minChars={MIN_IDEA_CHARS}
            rows="min-h-36"
            help="A couple of sentences is enough to start."
            invalid={Boolean(error)}
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
            className={cn(
              "rounded-xl border border-dashed border-border bg-surface-2 p-8 text-center transition-colors",
              dragging && "border-primary bg-primary/5",
            )}
          >
            {readingName ? (
              <div aria-live="polite">
                <Loader2 className="mx-auto size-6 animate-spin text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium">Reading “{readingName}”…</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Large PDFs take a moment. You can stop at any time.
                </p>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={cancelReading}>
                  <X className="size-4" aria-hidden="true" />
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium">Drop a file here</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  .txt · .md · .docx · text-based .pdf — up to {formatBytes(MAX_FILE_BYTES)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => inputRef.current?.click()}
                >
                  <FileText className="size-4" aria-hidden="true" />
                  Choose a file
                </Button>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              className="sr-only"
              aria-label="Open a document"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Word files and PDFs are read here in your browser. A PDF that is a scan or photo has no
            text to read — that needs OCR, which isn't available yet.
          </p>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" role="alert">
          <AlertTriangle className="size-4" aria-hidden="true" />
          <AlertTitle>We couldn't use that</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {source && (
        <div className="space-y-2 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary">{SOURCE_ENGINE_LABEL[source.engine]}</Badge>
            <span className="min-w-0 flex-1 truncate font-medium">{source.name}</span>
            <span className="text-xs text-muted-foreground">
              {source.text.trim().split(/\s+/).length.toLocaleString()} words
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={clear}>
              <X className="size-4" aria-hidden="true" />
              Replace
            </Button>
          </div>
          {source.warnings.length > 0 && (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {source.warnings.map((warning) => (
                <li key={warning} className="flex gap-1.5">
                  <AlertTriangle className="mt-0.5 size-3 shrink-0 text-warning" aria-hidden="true" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function TextField({
  id,
  value,
  onChange,
  placeholder,
  minChars,
  rows,
  help,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minChars: number;
  rows: string;
  help: string;
  invalid: boolean;
}) {
  const length = value.trim().length;
  const short = length > 0 && length < minChars;

  return (
    <>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("resize-y text-sm leading-relaxed", rows)}
        aria-describedby={`${id}-help`}
        aria-invalid={invalid || short}
      />
      <p id={`${id}-help`} className="text-xs text-muted-foreground">
        {short
          ? `${minChars - length} more character${minChars - length === 1 ? "" : "s"} to go.`
          : `${value.length.toLocaleString()} / ${MAX_TEXT_CHARS.toLocaleString()} characters. ${help}`}
      </p>
    </>
  );
}
