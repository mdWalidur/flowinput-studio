import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, type SourceDocument } from "@/domain/types";
import { transform } from "@/lib/transform";
import { parseAiContextOutput } from "./parse-ai-context";
import { parsePromptOutput } from "./parse-prompt";
import { parseSpecOutput } from "./parse-spec";
import { parseStudyOutput } from "./parse-study";

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

const options = { ...DEFAULT_OPTIONS, detail: "standard" as const };

describe("parseStudyOutput", () => {
  it("parses a real study transform", () => {
    const result = transform("study", { source, options });
    const parsed = parseStudyOutput(result.output);
    expect(parsed).not.toBeNull();
    expect(parsed?.terms.length).toBeGreaterThan(0);
    expect(parsed?.questions.length).toBeGreaterThan(0);
    expect(parsed?.reviewPlan.length).toBe(4);
  });

  it("falls back to null for unrelated text", () => {
    expect(parseStudyOutput("Just a plain paragraph with no headings at all.")).toBeNull();
  });
});

describe("parseAiContextOutput", () => {
  it("parses a real ai-context transform", () => {
    const result = transform("ai-context", { source, options });
    const parsed = parseAiContextOutput(result.output);
    expect(parsed).not.toBeNull();
    expect(parsed?.chunks.length).toBeGreaterThan(0);
    expect(parsed?.instructions.length).toBeGreaterThan(0);
  });

  it("falls back to null for unrelated text", () => {
    expect(parseAiContextOutput("Just a plain paragraph with no headings at all.")).toBeNull();
  });
});

describe("parseSpecOutput", () => {
  it("parses a real spec transform", () => {
    const result = transform("spec", { source, options });
    const sections = parseSpecOutput(result.output);
    expect(sections).not.toBeNull();
    expect(sections!.length).toBeGreaterThanOrEqual(6);
    const dataModel = sections!.find((s) => s.kind === "raw");
    expect(dataModel).toBeDefined();
    expect(dataModel?.raw).toContain("|");
  });

  it("falls back to null for unrelated text", () => {
    expect(parseSpecOutput("Just a plain paragraph with no headings at all.")).toBeNull();
  });
});

describe("parsePromptOutput", () => {
  it("parses a real prompt transform", () => {
    const result = transform("prompt", { source, options });
    const parsed = parsePromptOutput(result.output);
    expect(parsed).not.toBeNull();
    expect(parsed?.role.length).toBeGreaterThan(0);
    expect(parsed?.task.length).toBeGreaterThan(0);
  });

  it("falls back to null for unrelated text", () => {
    expect(parsePromptOutput("Just a plain paragraph with no labels at all.")).toBeNull();
  });
});
