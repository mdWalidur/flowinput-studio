import type { GoalId, SourceDocument } from "@/domain/types";

/**
 * One-shot handoff from the landing composer to the workspace.
 *
 * The landing page only *prepares* a source; the workspace owns the transform.
 * sessionStorage keeps this to the current tab and it is consumed exactly once.
 *
 * TODO(production): when accounts exist, a draft should be persisted through the
 * work-item repository instead so it survives across devices.
 */
const KEY = "flowpoint.draft.v1";

export interface Draft {
  source: SourceDocument;
  goalId: GoalId;
}

export function putDraft(draft: Draft): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* private mode or full storage: the workspace simply starts empty */
  }
}

export function takeDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed?.source?.text || !parsed?.goalId) return null;
    return parsed;
  } catch {
    return null;
  }
}
