import type { TransformStrategy } from "../index";
import {
  deriveTitle,
  isBullet,
  lines,
  looksLikeHeading,
  metadataBlock,
  normalizeWhitespace,
  stripBullet,
  wordCount,
} from "../text-utils";

export const markdownStrategy: TransformStrategy = {
  id: "markdown",
  format: "md",
  run: ({ source, options }) => {
    const text = normalizeWhitespace(source.text);
    const all = lines(text);
    const title = deriveTitle(text, source.name);

    const body: string[] = [];
    let previousWasHeading = false;

    all.forEach((line, i) => {
      if (i === 0 && line.replace(/^#+\s*/, "").trim() === title) {
        previousWasHeading = true;
        return; // title is emitted separately
      }

      if (looksLikeHeading(line)) {
        const clean = line.replace(/^#{1,6}\s*/, "").replace(/:$/, "").trim();
        const level = clean.length <= 32 ? "##" : "###";
        if (body.length) body.push("");
        body.push(`${level} ${clean}`);
        previousWasHeading = true;
        return;
      }

      if (isBullet(line)) {
        if (previousWasHeading) body.push("");
        body.push(`- ${stripBullet(line).replace(/\s{2,}/g, " ").trim()}`);
        previousWasHeading = false;
        return;
      }

      if (previousWasHeading) body.push("");
      body.push(line.replace(/\s{2,}/g, " "));
      previousWasHeading = false;
    });

    const parts: string[] = [];
    if (options.includeMetadata) {
      parts.push(
        metadataBlock({
          title: `"${title.replace(/"/g, "'")}"`,
          source: source.name,
          words: wordCount(text),
          generated_by: "FlowInput",
        }),
      );
    }
    parts.push(`# ${title}`, "");
    parts.push(body.join("\n").replace(/\n{3,}/g, "\n\n").trim());

    if (options.instructions?.trim()) {
      parts.push("", "> **Author note:** " + options.instructions.trim());
    }

    return {
      output: parts.join("\n") + "\n",
      notes: [
        "Normalized line endings, trailing spaces and blank runs.",
        "Promoted heading-like lines to Markdown headings.",
        "Converted mixed bullet characters to consistent `-` lists.",
      ],
    };
  },
};
