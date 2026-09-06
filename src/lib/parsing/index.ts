import { MAX_TEXT_CHARS, validateFile, validateFileSignature } from "@/lib/validation";
import { ExtractionError, type ExtractionResult } from "./types";

export { ExtractionError } from "./types";
export type { ExtractionResult, ExtractionEngine } from "./types";

/**
 * Single entry point the UI calls. It decides which engine to use, keeps heavy
 * engines lazily loaded, enforces the text ceiling and supports cancellation.
 */
export async function extractDocument(file: File, signal?: AbortSignal): Promise<ExtractionResult> {
  const check = validateFile(file);
  if (!check.ok) throw new ExtractionError(check.message);
  const signatureCheck = await validateFileSignature(file, check.extension);
  if (!signatureCheck.ok) throw new ExtractionError(signatureCheck.message);

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
    default: {
      const text = await file.text();
      if (signal?.aborted) throw new ExtractionError("Reading was cancelled.");
      if (!text.trim()) throw new ExtractionError(`“${file.name}” has no readable text.`);
      result = { text: normalizePlainText(text), engine: "plain-text", warnings: [] };
    }
  }

  if (result.text.length > MAX_TEXT_CHARS) {
    return {
      ...result,
      text: result.text.slice(0, MAX_TEXT_CHARS),
      warnings: [
        ...result.warnings,
        `Only the first ${MAX_TEXT_CHARS.toLocaleString()} characters were kept.`,
      ],
    };
  }

  return result;
}

function normalizePlainText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replaceAll("\u0000", "")
    .replace(/[ \t]+$/gm, "")
    .trim();
}
