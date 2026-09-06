import type { Project, WorkItem } from "@/domain/types";
import { DEFAULT_PROJECT_ID } from "@/domain/types";
import { z } from "zod";

/**
 * Repository boundary for persistence.
 *
 * The MVP ships a localStorage implementation. Swapping in an authenticated
 * cloud implementation (per-user rows + row level security) means writing a
 * second class against this same interface — no UI changes required.
 *
 * TODO(production): add CloudWorkItemRepository backed by server functions with
 * auth/authorization, pagination, soft delete, object storage for large source
 * files, and audit logging of every mutation.
 */
export interface WorkItemRepository {
  list(): Promise<WorkItem[]>;
  get(id: string): Promise<WorkItem | undefined>;
  save(item: WorkItem): Promise<WorkItem>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
  listProjects(): Promise<Project[]>;
}

const STORAGE_KEY = "flowinput.workitems.v1";
const MAX_ITEMS = 50;
/** Avoid filling localStorage with huge blobs. */
const MAX_STORED_CHARS = 20_000;

const workItemSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(1),
  goalId: z.enum(["markdown", "study", "ai-context", "spec", "prompt"]),
  status: z.enum(["draft", "completed", "failed"]),
  source: z.object({
    id: z.string().min(1),
    kind: z.enum(["text", "file", "idea"]),
    name: z.string().min(1),
    extension: z.enum(["txt", "md", "markdown", "pdf", "docx", "text"]),
    mimeType: z.string(),
    sizeBytes: z.number().nonnegative(),
    text: z.string(),
    engine: z.enum(["typed", "plain-text", "docx", "pdf"]),
    warnings: z.array(z.string()),
    meta: z.record(z.union([z.string(), z.number()])).optional(),
    createdAt: z.string(),
  }),
  options: z.object({
    detail: z.enum(["concise", "standard", "detailed"]),
    includeMetadata: z.boolean(),
    instructions: z.string().max(500).optional(),
  }),
  result: z
    .object({
      goalId: z.enum(["markdown", "study", "ai-context", "spec", "prompt"]),
      output: z.string(),
      format: z.enum(["md", "txt"]),
      notes: z.array(z.string()),
      stats: z.object({
        inputWords: z.number().nonnegative(),
        outputWords: z.number().nonnegative(),
        readingMinutes: z.number().nonnegative(),
      }),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const isBrowser = () => typeof window !== "undefined";

export class StorageError extends Error {}

function readAll(): WorkItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const result = workItemSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
}

function writeAll(items: WorkItem[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    throw new StorageError(
      "Your browser could not save this item. Storage may be full or unavailable.",
    );
  }
}

const truncate = (item: WorkItem): WorkItem => {
  const next: WorkItem = {
    ...item,
    source: { ...item.source, text: item.source.text.slice(0, MAX_STORED_CHARS) },
  };
  if (item.result) {
    next.result = { ...item.result, output: item.result.output.slice(0, MAX_STORED_CHARS) };
  } else {
    delete next.result;
  }
  return next;
};

export class LocalWorkItemRepository implements WorkItemRepository {
  async list(): Promise<WorkItem[]> {
    return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string): Promise<WorkItem | undefined> {
    return readAll().find((i) => i.id === id);
  }

  async save(item: WorkItem): Promise<WorkItem> {
    const items = readAll();
    const next = truncate({ ...item, updatedAt: new Date().toISOString() });
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) items[index] = next;
    else items.unshift(next);
    writeAll(items);
    return next;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((i) => i.id !== id));
  }

  async clear(): Promise<void> {
    writeAll([]);
  }

  async listProjects(): Promise<Project[]> {
    return [{ id: DEFAULT_PROJECT_ID, name: "My workspace", createdAt: new Date(0).toISOString() }];
  }
}

export const workItemRepository: WorkItemRepository = new LocalWorkItemRepository();

export const newId = (): string =>
  isBrowser() && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
