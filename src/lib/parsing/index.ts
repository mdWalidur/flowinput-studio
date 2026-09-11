import {
  MAX_TEXT_CHARS,
  MAX_FILE_BYTES,
  validateFile,
  validateFileSignature,
} from "@/lib/validation";
import { ExtractionError, type ExtractionResult } from "./types";

export { ExtractionError } from "./types";
export type { ExtractionResult, ExtractionEngine } from "./types";

/**
 * Single entry point the UI calls. It decides which engine to use, keeps heavy
 * engines lazily loaded, enforces the text ceiling and supports cancellation.
 */
export async function extractDocument(file: File, signal?: AbortSignal): Promise<ExtractionResult> {
  if (file.size > MAX_FILE_BYTES) {
    throw new ExtractionError(
      "This file is too large to process safely in the browser.",
      "TOO_LARGE",
    );
  }

  const check = validateFile(file);
  if (!check.ok) throw new ExtractionError(check.message, "INVALID_FILE");

  const signatureCheck = await validateFileSignature(file, check.extension);
  if (!signatureCheck.ok) throw new ExtractionError(signatureCheck.message, "INVALID_FILE");

  const start = performance.now();
  let result: ExtractionResult;

  switch (check.extension) {
    case "pdf": {
      const { extractPdf } = await import("./extract-pdf");
      result = await extractPdf(file, signal);
      break;
    }
    case "docx": {
      const { extractDocx } = await import("./extract-docx");
      result = await extractDocx(file, signal);
      break;
    }
    case "md":
    case "markdown": {
      const text = await file.text();
      if (signal?.aborted) throw new ExtractionError("Reading was cancelled.", "CANCELLED");
      if (!text.trim()) {
        throw new ExtractionError(`“${file.name}” has no readable text.`, "SCANNED");
      }
      const normalized = normalizePlainText(text);
      result = {
        text: normalized,
        engine: "markdown",
        warnings: [],
        changes: ["Normalized line endings and whitespace for Markdown input."],
        raw: text,
        fileName: file.name,
        fileSize: file.size,
        fileType: check.extension,
      };
      break;
    }
    default: {
      const text = await file.text();
      if (signal?.aborted) throw new ExtractionError("Reading was cancelled.", "CANCELLED");
      if (!text.trim()) {
        throw new ExtractionError(`“${file.name}” has no readable text.`, "SCANNED");
      }
      const normalized = normalizePlainText(text);
      result = {
        text: normalized,
        engine: "plain-text",
        warnings: [],
        changes: ["Normalized line endings, removed null bytes, trimmed trailing spaces."],
        raw: text,
        fileName: file.name,
        fileSize: file.size,
        fileType: check.extension,
      };
    }
  }

  if (result.text.length > MAX_TEXT_CHARS) {
    result = {
      ...result,
      text: result.text.slice(0, MAX_TEXT_CHARS),
      warnings: [
        ...result.warnings,
        `Only the first ${MAX_TEXT_CHARS.toLocaleString()} characters were kept.`,
      ],
      isTruncated: true,
    };
    result.changes = [
      ...(result.changes ?? []),
      "Truncated very long input to the configured ceiling.",
    ];
  }

  result.durationMs = (result.durationMs ?? 0) + (performance.now() - start);

  return result;
}

function normalizePlainText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/^\uFEFF/, "") // BOM
    .replaceAll("\u0000", "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
