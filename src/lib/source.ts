import type { SourceDocument, SourceKind, SupportedExtension } from "@/domain/types";
import { extensionOf } from "@/lib/validation";
import { newId } from "@/services/work-item-repository";
import type { ExtractionResult } from "@/lib/parsing";

/**
 * Single place where a SourceDocument is constructed. The landing composer and
 * the workspace both go through here, so the shape can never drift apart.
 */
export function textSource(
  text: string,
  name = "Pasted text",
  kind: SourceKind = "text",
): SourceDocument {
  return {
    id: newId(),
    kind,
    name,
    extension: "text",
    mimeType: "text/plain",
    sizeBytes: new Blob([text]).size,
    text,
    engine: "typed",
    warnings: [],
    meta: { characters: text.trim().length },
    createdAt: new Date().toISOString(),
  };
}

export function fileSource(file: File, extracted: ExtractionResult): SourceDocument {
  return {
    id: newId(),
    kind: "file",
    name: file.name,
    extension: (extensionOf(file.name) || "text") as SupportedExtension,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    text: extracted.text,
    engine: extracted.engine === "markdown" ? "plain-text" : extracted.engine,
    warnings: extracted.warnings,
    meta: { ...(extracted.meta ?? {}), characters: extracted.text.length },
    createdAt: new Date().toISOString(),
  };
}

export const wordCount = (text: string): number => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

/** Document title used in headings, downloads and saved work. */
export const documentTitle = (source: SourceDocument | null): string =>
  source ? source.name.replace(/\.[^.]+$/, "") : "Untitled source";
