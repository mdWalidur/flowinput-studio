import { useCallback, useId, useRef, useState } from "react";
import { AlertTriangle, FileUp, Trash2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLES } from "@/lib/sample-content";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_BYTES,
  MAX_TEXT_CHARS,
  formatBytes,
  pastedTextSchema,
  validateFile,
} from "@/lib/validation";
import { newId } from "@/services/work-item-repository";
import type { SourceDocument } from "@/domain/types";
import { cn } from "@/lib/utils";

interface Props {
  source: SourceDocument | null;
  onChange: (source: SourceDocument | null) => void;
}

export function InputStudio({ source, onChange }: Props) {
  const [text, setText] = useState(source?.kind === "text" ? source.text : "");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaId = useId();

  const commitText = useCallback(
    (next: string) => {
      setText(next);
      const parsed = pastedTextSchema.safeParse(next);
      if (!parsed.success) {
        setError(next.trim().length === 0 ? null : parsed.error.issues[0]?.message ?? "That text can’t be used yet.");
        onChange(null);
        return;
      }
      setError(null);
      onChange({
        id: newId(),
        kind: "text",
        name: "Pasted text",
        extension: "text",
        mimeType: "text/plain",
        sizeBytes: new Blob([next]).size,
        text: next,
        requiresServerParsing: false,
        createdAt: new Date().toISOString(),
      });
    },
    [onChange],
  );

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const check = validateFile(file);
      if (!check.ok) {
        setError(check.message);
        return;
      }

      if (check.requiresServerParsing) {
        // Honest behaviour: we accept the file but cannot extract text yet.
        // TODO(production): POST to a server function that validates the file
        // signature, scans it, stores it, and extracts text in a background job.
        onChange({
          id: newId(),
          kind: "file",
          name: file.name,
          extension: check.extension,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          text: "",
          requiresServerParsing: true,
          createdAt: new Date().toISOString(),
        });
        return;
      }

      setReading(true);
      try {
        const contents = await file.text();
        if (!contents.trim()) {
          setError(`“${file.name}” has no readable text.`);
          onChange(null);
          return;
        }
        setText(contents.slice(0, MAX_TEXT_CHARS));
        onChange({
          id: newId(),
          kind: "file",
          name: file.name,
          extension: check.extension,
          mimeType: file.type || "text/plain",
          sizeBytes: file.size,
          text: contents.slice(0, MAX_TEXT_CHARS),
          requiresServerParsing: false,
          createdAt: new Date().toISOString(),
        });
      } catch {
        setError("We couldn’t read that file. Try again or paste the text instead.");
        onChange(null);
      } finally {
        setReading(false);
      }
    },
    [onChange],
  );

  const clear = () => {
    setText("");
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="paste">
        <TabsList>
          <TabsTrigger value="paste">Paste text</TabsTrigger>
          <TabsTrigger value="upload">Upload file</TabsTrigger>
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
                onClick={() => commitText(sample.text)}
                title={sample.hint}
              >
                Try: {sample.label}
              </Button>
            ))}
          </div>
          <Textarea
            id={textareaId}
            value={text}
            onChange={(e) => commitText(e.target.value)}
            placeholder="Paste notes, an article, a rough idea, a prompt draft…"
            className="min-h-56 resize-y font-mono text-sm leading-relaxed"
            aria-describedby={`${textareaId}-help`}
            aria-invalid={Boolean(error)}
          />
          <p id={`${textareaId}-help`} className="text-xs text-muted-foreground">
            {text.length.toLocaleString()} / {MAX_TEXT_CHARS.toLocaleString()} characters.
            Nothing leaves your browser in this version.
          </p>
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
              "rounded-xl border-2 border-dashed border-border bg-surface-2 p-8 text-center transition-colors",
              dragging && "border-primary bg-primary/5",
            )}
          >
            <Upload className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium">Drag and drop a file here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              TXT, Markdown, PDF or DOCX · up to {formatBytes(MAX_FILE_BYTES)}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => inputRef.current?.click()}
              disabled={reading}
            >
              <FileUp className="size-4" aria-hidden="true" />
              {reading ? "Reading…" : "Choose a file"}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              className="sr-only"
              aria-label="Upload a document"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" role="alert">
          <AlertTriangle className="size-4" aria-hidden="true" />
          <AlertTitle>We can’t use that yet</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {source && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm">
          <Badge variant="secondary">{source.extension.toUpperCase()}</Badge>
          <span className="truncate font-medium">{source.name}</span>
          <span className="text-muted-foreground">{formatBytes(source.sizeBytes)}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={clear}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </Button>
        </div>
      )}

      {source?.requiresServerParsing && (
        <Alert role="status">
          <AlertTriangle className="size-4" aria-hidden="true" />
          <AlertTitle>{source.extension.toUpperCase()} text extraction isn’t connected yet</AlertTitle>
          <AlertDescription>
            We accepted the file, but reading text out of PDF and DOCX needs a server step
            that isn’t part of this version. Paste the text to continue right now.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
