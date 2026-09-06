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
export type ExtractionEngine = "plain-text" | "docx" | "pdf" | "markdown";

export interface ExtractionResult {
  text: string;
  engine: ExtractionEngine;
  /** Non-fatal notes shown to the user (e.g. "page 4 had no selectable text"). */
  warnings: string[];
  /** What FlowInput changed or normalized. */
  changes?: string[];
  /** Raw extractor output (e.g. HTML from mammoth, raw PDF blocks). */
  raw?: string;
  /** Extra facts worth surfacing, e.g. page count. */
  meta?: Record<string, string | number>;
  /** File metadata for traceability. */
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  /** Extraction metrics. */
  durationMs?: number;
  pagesRead?: number;
  pagesSkipped?: number;
  /** Flags for UX and trust. */
  isScanned?: boolean;
  isTruncated?: boolean;
}

export class ExtractionError extends Error {
  constructor(
    message: string,
    public code?:
      | "INVALID_FILE"
      | "UNSUPPORTED_TYPE"
      | "CORRUPTED"
      | "SCANNED"
      | "TOO_LARGE"
      | "PASSWORD_PROTECTED"
      | "CANCELLED",
  ) {
    super(message);
  }
}

export interface DocumentExtractor {
  readonly engine: ExtractionEngine;
  readonly version?: string;
  extract(file: File, signal?: AbortSignal): Promise<ExtractionResult>;
}

export function assertNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new ExtractionError("Reading was cancelled before completion.", "CANCELLED");
  }
}
