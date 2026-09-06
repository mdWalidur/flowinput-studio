/**
 * Core domain models for FlowInput.
 *
 * These entities are intentionally transport-agnostic so a future Creative
 * Studio (image/video generation) and authenticated cloud persistence can
 * reuse them without change.
 *
 * TODO(production): mirror these types in a server-side schema (database
 * tables + zod validators shared with server functions) once auth is added.
 */

export type GoalId =
  | "markdown"
  | "study"
  | "ai-context"
  | "spec"
  | "prompt";

export type SourceKind = "text" | "file";

export type SupportedExtension = "txt" | "md" | "markdown" | "pdf" | "docx";

export interface SourceDocument {
  id: string;
  kind: SourceKind;
  /** Original file name, or a generated label for pasted text. */
  name: string;
  extension: SupportedExtension | "text";
  mimeType: string;
  sizeBytes: number;
  /** Extracted plain text. Empty when extraction is not available client-side. */
  text: string;
  /** True when the content could not be parsed in the browser (PDF/DOCX). */
  requiresServerParsing: boolean;
  createdAt: string;
}

export interface TransformOptions {
  /** Tone / verbosity control used by several strategies. */
  detail: "concise" | "standard" | "detailed";
  /** Include a short metadata header in the output. */
  includeMetadata: boolean;
  /** Optional user note that steers the transformation. */
  instructions?: string;
}

export interface TransformResult {
  goalId: GoalId;
  /** Rendered output text. */
  output: string;
  /** File format used for download. */
  format: "md" | "txt";
  /** Human readable notes about what the transformation did. */
  notes: string[];
  stats: {
    inputWords: number;
    outputWords: number;
    readingMinutes: number;
  };
}

export type WorkItemStatus = "draft" | "completed" | "failed";

/** A single unit of work: one source + one goal + one result. */
export interface WorkItem {
  id: string;
  projectId: string;
  title: string;
  goalId: GoalId;
  status: WorkItemStatus;
  source: SourceDocument;
  options: TransformOptions;
  result?: TransformResult;
  createdAt: string;
  updatedAt: string;
}

/** Grouping entity, reserved for multi-item projects and future studios. */
export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export const DEFAULT_PROJECT_ID = "default";

export const DEFAULT_OPTIONS: TransformOptions = {
  detail: "standard",
  includeMetadata: true,
  instructions: "",
};
