import { assertNotAborted, ExtractionError, type ExtractionResult } from "./types";

/**
 * Real text extraction for text-based PDFs, using pdf.js in the browser.
 * Scanned/image-only PDFs contain no selectable text — we detect that and say so
 * instead of returning nothing. OCR is not implemented (see types.ts TODO).
 *
 * This module is imported dynamically so the PDF engine never ships in the
 * initial bundle.
 */
const MAX_PAGES = 120;
const MAX_FILE_BYTES = 50_000_000; // ~50MB safety ceiling

export async function extractPdf(file: File, signal?: AbortSignal): Promise<ExtractionResult> {
  const start = performance.now();
  assertNotAborted(signal);

  if (file.size > MAX_FILE_BYTES) {
    throw new ExtractionError(
      "This PDF is too large to process safely in the browser.",
      "TOO_LARGE",
    );
  }

  let pdfjs: typeof import("pdfjs-dist");
  try {
    pdfjs = await import("pdfjs-dist");
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  } catch {
    throw new ExtractionError("PDF support is temporarily unavailable.", "INVALID_FILE");
  }

  const data = new Uint8Array(await file.arrayBuffer());
  assertNotAborted(signal);

  let doc: Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>;
  try {
    doc = await pdfjs.getDocument({ data }).promise;
  } catch (error: unknown) {
    const message =
      error instanceof Error && /password/i.test(error.message)
        ? "This PDF is password-protected and cannot be read."
        : "This PDF could not be opened. It may be password-protected or damaged.";
    throw new ExtractionError(message, /password/i.test(String(error)) ? "PASSWORD_PROTECTED" : "CORRUPTED");
  }

  const closable = doc as unknown as { destroy?: () => Promise<void>; cleanup?: () => void };

  try {
    const warnings: string[] = [];
    const changes: string[] = [];
    const pageCount = doc.numPages;
    const pagesToRead = Math.min(pageCount, MAX_PAGES);

    if (pageCount > MAX_PAGES) {
      warnings.push(`Only the first ${MAX_PAGES} of ${pageCount} pages were read.`);
    }

    const blocks: string[] = [];
    let emptyPages = 0;

    for (let pageNumber = 1; pageNumber <= pagesToRead; pageNumber++) {
      assertNotAborted(signal);
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();

      let line = "";
      const lines: string[] = [];

      for (const item of content.items) {
        if (!("str" in item)) continue;
        line += item.str;
        if ((item as any).hasEOL) {
          lines.push(line);
          line = "";
        }
      }
      if (line) lines.push(line);
      page.cleanup();

      const pageText = joinLines(lines);
      if (!pageText.trim()) emptyPages++;
      else blocks.push(pageText);
    }

    const text = blocks.join("\n\n").trim();

    if (!text) {
      throw new ExtractionError(
        "This PDF has no selectable text — it looks like a scan or photo. Reading scanned pages needs OCR, which isn’t available yet. Paste the text instead.",
        "SCANNED",
      );
    }

    if (emptyPages > 0) {
      warnings.push(
        `${emptyPages} page${emptyPages === 1 ? "" : "s"} had no selectable text and were skipped (likely scanned images).`,
      );
    }

    changes.push(
      "Rebuilt paragraphs from PDF text items.",
      "Merged hard-wrapped lines back into paragraphs.",
      "Skipped pages with no selectable text.",
    );

    const durationMs = performance.now() - start;

    return {
      text,
      engine: "pdf",
      warnings,
      changes,
      raw: blocks.join("\n\n"),
      meta: { pages: pageCount },
      fileName: file.name,
      fileSize: file.size,
      fileType: "pdf",
      durationMs,
      pagesRead: pagesToRead,
      pagesSkipped: pageCount - pagesToRead + emptyPages,
      isScanned: emptyPages === pageCount,
    };
  } finally {
    try {
      await closable.destroy?.();
      closable.cleanup?.();
    } catch {
      // Cleanup failures are non-fatal for the user.
    }
  }
}

/** Merge hard-wrapped PDF lines back into paragraphs. */
function joinLines(lines: string[]): string {
  const out: string[] = [];
  let paragraph = "";

  for (const raw of lines) {
    const trimmed = raw.replace(/\s+/g, " ").trim();
    if (!trimmed) {
      if (paragraph) out.push(paragraph);
      paragraph = "";
      continue;
    }

    // Skip pure page numbers as likely headers/footers.
    if (/^\d+$/.test(trimmed)) {
      continue;
    }

    if (!paragraph) {
      paragraph = trimmed;
      continue;
    }

    if (paragraph.endsWith("-")) {
      paragraph = `${paragraph.slice(0, -1)}${trimmed}`;
    } else if (/[.!?:;”")]$/.test(paragraph) || /^[-*•\d]/.test(trimmed)) {
      out.push(paragraph);
      paragraph = trimmed;
    } else {
      paragraph = `${paragraph} ${trimmed}`;
    }
  }

  if (paragraph) out.push(paragraph);
  return out.join("\n\n");
}
