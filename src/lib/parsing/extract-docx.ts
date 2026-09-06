import { assertNotAborted, ExtractionError, type ExtractionResult } from "./types";

/**
 * Real DOCX extraction in the browser via mammoth, converted to Markdown so
 * headings, lists and emphasis survive. Loaded dynamically to keep it out of
 * the initial bundle.
 */
interface MammothResult {
  value: string;
  messages: Array<{ type: string; message: string }>;
}

export async function extractDocx(file: File, signal?: AbortSignal): Promise<ExtractionResult> {
  assertNotAborted(signal);
  const mammoth = (await import("mammoth")) as unknown as {
    convertToMarkdown?: (input: { arrayBuffer: ArrayBuffer }) => Promise<MammothResult>;
    extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<MammothResult>;
  };
  const arrayBuffer = await file.arrayBuffer();
  assertNotAborted(signal);

  try {
    const convert = mammoth.convertToMarkdown ?? mammoth.extractRawText;
    const result = await convert({ arrayBuffer });
    const text = cleanup(result.value);
    if (!text.trim()) {
      throw new ExtractionError(`“${file.name}” has no readable text in it.`);
    }
    const warnings = result.messages
      .filter((m) => m.type === "warning")
      .slice(0, 3)
      .map((m) => m.message);
    const imageCount = (result.value.match(/!\[/g) ?? []).length;
    if (imageCount > 0) {
      warnings.push(
        `${imageCount} image${imageCount === 1 ? "" : "s"} were left out — only text is read.`,
      );
    }
    return { text, engine: "docx", warnings };
  } catch (error) {
    if (error instanceof ExtractionError) throw error;
    throw new ExtractionError(
      "This Word file could not be read. It may be an older .doc file or damaged.",
    );
  }
}


function cleanup(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // drop embedded image data URLs
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
