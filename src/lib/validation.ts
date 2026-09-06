import { z } from "zod";
import type { SupportedExtension } from "@/domain/types";

/**
 * Centralized client-side validation.
 *
 * TODO(production): every rule here MUST be re-checked server-side before
 * storage or processing — real file-signature sniffing, malware scanning,
 * per-user/IP rate limiting, and audit logging of every upload.
 */

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_TEXT_CHARS = 200_000;
export const MIN_TEXT_CHARS = 40;

export const ACCEPTED_EXTENSIONS: SupportedExtension[] = ["txt", "md", "markdown", "pdf", "docx"];

export const ACCEPT_ATTRIBUTE = ".txt,.md,.markdown,.pdf,.docx";

/** Extension → MIME types we consider consistent. Empty list = browsers vary. */
const MIME_BY_EXTENSION: Record<SupportedExtension, string[]> = {
  txt: ["text/plain", ""],
  md: ["text/markdown", "text/x-markdown", "text/plain", ""],
  markdown: ["text/markdown", "text/x-markdown", "text/plain", ""],
  pdf: ["application/pdf", ""],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "",
  ],
};

export type ValidationOk = { ok: true; extension: SupportedExtension };
export type ValidationError = { ok: false; message: string };
export type ValidationResult = ValidationOk | ValidationError;

export const extensionOf = (name: string): string => name.split(".").pop()?.toLowerCase() ?? "";

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export function validateFile(file: File): ValidationResult {
  const ext = extensionOf(file.name);

  if (!ACCEPTED_EXTENSIONS.includes(ext as SupportedExtension)) {
    return {
      ok: false,
      message: `“${file.name}” isn’t a file type we read. Use a .txt, .md, .pdf or .docx file.`,
    };
  }

  const extension = ext as SupportedExtension;
  const allowedMimes = MIME_BY_EXTENSION[extension];
  const mime = (file.type || "").toLowerCase();

  if (mime && !allowedMimes.includes(mime)) {
    return {
      ok: false,
      message: `“${file.name}” doesn’t look like a real .${extension} file, so we didn’t open it.`,
    };
  }

  if (file.size === 0) return { ok: false, message: `“${file.name}” is empty.` };

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message: `“${file.name}” is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_FILE_BYTES)}.`,
    };
  }

  return { ok: true, extension };
}

export const pastedTextSchema = z
  .string()
  .trim()
  .min(MIN_TEXT_CHARS, `Add a little more — at least ${MIN_TEXT_CHARS} characters.`)
  .max(MAX_TEXT_CHARS, `That’s longer than the ${MAX_TEXT_CHARS.toLocaleString()} character limit.`);

export const transformOptionsSchema = z.object({
  detail: z.enum(["concise", "standard", "detailed"]),
  includeMetadata: z.boolean(),
  instructions: z.string().max(500).optional(),
});
