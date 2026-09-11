import { useCallback, useEffect, useId, useRef, useState } from "react";

import { SAMPLES } from "@/lib/sample-content";
import { ExtractionError, extractDocument } from "@/lib/parsing";
import { fileSource, textSource } from "@/lib/source";
import { ACCEPT_ATTRIBUTE, MAX_TEXT_CHARS, MIN_TEXT_CHARS, formatBytes } from "@/lib/validation";
import { SOURCE_ENGINE_LABEL, type SourceDocument } from "@/domain/types";
import { cn } from "@/lib/utils";

interface Props {
  source: SourceDocument | null;
  onChange: (source: SourceDocument | null) => void;
}

/**
 * One source surface: an editor that also accepts files. No tabs, no panels —
 * the text itself is the interface.
 */
export function InputStudio({ source, onChange }: Props) {
  const [text, setText] = useState(source?.text ?? "");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [readingName, setReadingName] = useState<string | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const editorId = useId();

  useEffect(() => () => abortRef.current?.abort(), []);

  /* Adopt text only when the document identity changes (draft, sample, file). */
  const adoptedId = useRef<string | null>(null);
  if (source && adoptedId.current !== source.id) {
    adoptedId.current = source.id;
    if (source.text !== text) setText(source.text);
  }

  const commit = useCallback(
    (next: string, name?: string) => {
      setText(next);
      const trimmed = next.trim();

      if (!trimmed) {
        setError(null);
        onChange(null);
        return;
      }

      if (trimmed.length > MAX_TEXT_CHARS) {
        setError(`That is longer than the ${MAX_TEXT_CHARS.toLocaleString()} character limit.`);
        onChange(null);
        return;
      }

      setError(null);
      onChange(trimmed.length < MIN_TEXT_CHARS ? null : textSource(next, name ?? "Pasted text"));
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
        onChange(fileSource(file, extracted));
      } catch (reason) {
        if (controller.signal.aborted) return;
        setError(
          reason instanceof ExtractionError
            ? reason.message
            : "We couldn't read that file. Try another one, or paste the text instead.",
        );
        onChange(null);
      } finally {
        if (!controller.signal.aborted) setReadingName(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [onChange],
  );

  const length = text.trim().length;
  const short = length > 0 && length < MIN_TEXT_CHARS;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 pb-3">
        <span className="label">Source</span>
        <span className="label truncate">
          {readingName
            ? `Reading ${readingName}…`
            : source
              ? `${SOURCE_ENGINE_LABEL[source.engine]} · ${formatBytes(source.sizeBytes)}`
              : "Empty"}
        </span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className={cn(
          "border-t border-rule transition-colors duration-200",
          dragging && "border-signal",
        )}
      >
        <textarea
          ref={editorRef}
          id={editorId}
          value={text}
          onChange={(event) => commit(event.target.value)}
          spellCheck={false}
          aria-label="Source material"
          aria-describedby={`${editorId}-meter`}
          aria-invalid={Boolean(error)}
          placeholder={
            dragging
              ? "Drop to read this file"
              : "Paste your notes, a chapter, meeting minutes — or drop a file here"
          }
          className="block h-[18rem] w-full resize-y overflow-auto bg-transparent px-0 py-5 font-mono text-sm leading-6 outline-none placeholder:font-sans placeholder:text-base placeholder:text-muted-foreground sm:h-[24rem]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border py-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm underline decoration-rule decoration-1 underline-offset-4 hover:decoration-foreground"
        >
          Open a file
        </button>

        {readingName ? (
          <button
            type="button"
            onClick={() => {
              abortRef.current?.abort();
              setReadingName(null);
            }}
            className="text-sm text-muted-foreground underline decoration-rule decoration-1 underline-offset-4 hover:text-foreground"
          >
            Stop reading
          </button>
        ) : (
          <span className="label">TXT · MD · DOCX · PDF up to {formatBytes(10 * 1024 * 1024)}</span>
        )}

        <p id={`${editorId}-meter`} className="label ml-auto" aria-live="polite">
          {short
            ? `${MIN_TEXT_CHARS - length} more characters needed`
            : `${length.toLocaleString()} / ${MAX_TEXT_CHARS.toLocaleString()} characters`}
        </p>

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          aria-label="Open a document"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>

      {/* Designed empty state: an offer, not a blank page. */}
      {!text && !readingName && (
        <p className="border-t border-border py-3 text-sm text-muted-foreground">
          Or start from an example:{" "}
          {SAMPLES.map((sample, index) => (
            <span key={sample.id}>
              {index > 0 ? " · " : ""}
              <button
                type="button"
                onClick={() => commit(sample.text, sample.label)}
                className="text-foreground underline decoration-rule decoration-1 underline-offset-4 hover:decoration-foreground"
              >
                {sample.label}
              </button>
            </span>
          ))}
        </p>
      )}

      {error && (
        <p role="alert" className="border-t border-border py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {source && source.warnings.length > 0 && (
        <ul className="border-t border-border py-3 text-sm text-muted-foreground">
          {source.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
