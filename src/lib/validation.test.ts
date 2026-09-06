import { describe, expect, it } from "vitest";
import {
  MAX_FILE_BYTES,
  validateFile,
  validateFileSignature,
  pastedTextSchema,
} from "@/lib/validation";

describe("validateFile", () => {
  it("accepts supported markdown files", () => {
    const file = new File(["# Hello"], "notes.md", { type: "text/markdown" });
    expect(validateFile(file)).toEqual({ ok: true, extension: "md" });
  });

  it("rejects unsupported file extensions", () => {
    const file = new File(["{}"], "data.json", { type: "application/json" });
    const result = validateFile(file);
    expect(result.ok).toBe(false);
  });

  it("rejects oversized files", () => {
    const file = new File(["a".repeat(MAX_FILE_BYTES + 1)], "big.txt", { type: "text/plain" });
    const result = validateFile(file);
    expect(result.ok).toBe(false);
  });
});

describe("validateFileSignature", () => {
  it("accepts a PDF signature", async () => {
    const file = new File(["%PDF-1.7 body"], "a.pdf", { type: "application/pdf" });
    await expect(validateFileSignature(file, "pdf")).resolves.toEqual({
      ok: true,
      extension: "pdf",
    });
  });

  it("rejects a DOCX file with invalid signature", async () => {
    const file = new File(["not-a-zip"], "a.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const result = await validateFileSignature(file, "docx");
    expect(result.ok).toBe(false);
  });

  it("accepts a DOCX zip signature", async () => {
    const file = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x10])], "ok.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    await expect(validateFileSignature(file, "docx")).resolves.toEqual({
      ok: true,
      extension: "docx",
    });
  });
});

describe("pastedTextSchema", () => {
  it("requires enough content", () => {
    expect(pastedTextSchema.safeParse("tiny").success).toBe(false);
    expect(pastedTextSchema.safeParse("x".repeat(120)).success).toBe(true);
  });
});
