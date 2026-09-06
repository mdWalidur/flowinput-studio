import type { GoalId, TransformOptions } from "@/domain/types";

/**
 * Provider interfaces reserved for future services. Nothing here is wired up in
 * the MVP — all transformations run locally and deterministically.
 *
 * TODO(production): implement these against server functions only. API keys and
 * model credentials MUST live in server-side secrets; never in client code.
 * Add rate limiting, per-user quotas, request/response audit logging, content
 * moderation and timeout/retry policy at that boundary.
 */
export interface TextTransformProvider {
  readonly name: string;
  /** True when the provider is configured and reachable. */
  isAvailable(): Promise<boolean>;
  transform(input: {
    goalId: GoalId;
    text: string;
    options: TransformOptions;
  }): Promise<{ output: string }>;
}

/** Future Creative Studio: image / video generation. */
export interface MediaGenerationProvider {
  readonly name: string;
  isAvailable(): Promise<boolean>;
  generate(input: { prompt: string; kind: "image" | "video" }): Promise<{ assetUrl: string }>;
}

/** Future external platform connections (Notion, Drive, YouTube, ...). */
export interface PlatformConnector {
  readonly id: string;
  readonly label: string;
  isConnected(): Promise<boolean>;
}

/** Server-side document parsing for PDF/DOCX. Not connected in the MVP. */
export interface DocumentParsingProvider {
  readonly name: string;
  isAvailable(): Promise<boolean>;
  /**
   * TODO(production): implement as a server function: validate the file
   * signature, run malware scanning, store the original in object storage,
   * then parse in a background job and return extracted text.
   */
  extractText(file: File): Promise<{ text: string }>;
}

/** The MVP has no configured providers; the UI reflects this honestly. */
export const configuredTextProviders: TextTransformProvider[] = [];
export const configuredDocumentParser: DocumentParsingProvider | null = null;
