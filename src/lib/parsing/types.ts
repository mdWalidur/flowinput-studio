/**
 * Document extraction boundary.
 *
 * Every extractor below runs in the user's browser. Nothing is uploaded.
 *
 * TODO(production): add a ServerDocumentExtractor implementation that posts the
 * file to a signed upload URL and runs extraction in a background job with:
 * file-signature sniffing, malware scanning, object storage, OCR for scanned
 * PDFs and images, per-user rate limiting, retries, monitoring and audit logs.
 */
export type ExtractionEngine = "plain-text" | "docx" | "pdf";

export interface ExtractionResult {
  text: string;
  engine: ExtractionEngine;
  /** Non-fatal notes shown to the user (e.g. "page 4 had no selectable text"). */
  warnings: string[];
  /** Extra facts worth surfacing, e.g. page count. */
  meta?: Record<string, string | number>;
}

export class ExtractionError extends Error {}

export interface DocumentExtractor {
  readonly engine: ExtractionEngine;
  extract(file: File, signal?: AbortSignal): Promise<ExtractionResult>;
}

export function assertNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new ExtractionError("Reading was cancelled.");
}
