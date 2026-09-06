import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, type GoalId, type SourceDocument } from "@/domain/types";
import { transform } from "@/lib/transform";

const source: SourceDocument = {
  id: "s1",
  kind: "text",
  name: "Sample Notes",
  extension: "text",
  mimeType: "text/plain",
  sizeBytes: 120,
  text: `Idea: clinic booking workflow.
- Patients need reminders.
- Owners need attendance reports.
Dashboard and scheduling are required.`,
  engine: "typed",
  warnings: [],
  createdAt: new Date().toISOString(),
};

const GOALS: GoalId[] = ["markdown", "study", "ai-context", "spec", "prompt"];

describe("transform strategies", () => {
  for (const goalId of GOALS) {
    it(`returns usable output for ${goalId}`, () => {
      const result = transform(goalId, {
        source,
        options: { ...DEFAULT_OPTIONS, detail: "standard" },
      });
      expect(result.goalId).toBe(goalId);
      expect(result.output.length).toBeGreaterThan(20);
      expect(result.stats.inputWords).toBeGreaterThan(0);
      expect(result.stats.outputWords).toBeGreaterThan(0);
      expect(result.notes.length).toBeGreaterThan(0);
    });
  }
});
