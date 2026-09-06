import { z } from "zod";
import type { SupportedExtension } from "@/domain/types";

/**
 * Centralized client-side validation.
 *
 * TODO(production): every rule here MUST be re-validated server-side before
 * storage or processing (file signature sniffing, size limits, malware
 * scanning, rate limiting per user/IP, audit logging of uploads).
 */

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_TEXT_CHARS = 200_000;

export const BROWSER_PARSEABLE: SupportedExtension[] = ["txt", "md", "markdown"];
export const SERVER_ONLY: SupportedExtension[] = ["pdf", "docx"];

export const ACCEPTED_EXTENSIONS: SupportedExtension[] = [
  ...BROWSER_PARSEABLE,
  ...SERVER_ONLY,
];

export const ACCEPT_ATTRIBUTE = ".txt,.md,.markdown,.pdf,.docx";

export type ValidationOk = {
  ok: true;
  extension: SupportedExtension;
  requiresServerParsing: boolean;
};
export type ValidationError = { ok: false; message: string };
export type ValidationResult = ValidationOk | ValidationError;

export const extensionOf = (name: string): string =>
  name.split(".").pop()?.toLowerCase() ?? "";

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
      message: `“${file.name}” isn’t supported yet. Use TXT, Markdown, PDF or DOCX.`,
    };
  }

  if (file.size === 0) {
    return { ok: false, message: `“${file.name}” looks empty.` };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message: `“${file.name}” is ${formatBytes(file.size)}. The limit is ${formatBytes(
        MAX_FILE_BYTES,
      )}.`,
    };
  }

  const extension = ext as SupportedExtension;
  return {
    ok: true,
    extension,
    requiresServerParsing: SERVER_ONLY.includes(extension),
  };
}

export const pastedTextSchema = z
  .string()
  .trim()
  .min(40, "Add a little more text (at least 40 characters) so we can work with it.")
  .max(MAX_TEXT_CHARS, "That’s longer than the current 200,000 character limit.");

export const transformOptionsSchema = z.object({
  detail: z.enum(["concise", "standard", "detailed"]),
  includeMetadata: z.boolean(),
  instructions: z.string().max(500).optional(),
});
