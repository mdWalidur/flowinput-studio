import type { TransformStrategy } from "../index";
import {
  deriveTitle,
  isBullet,
  keywords,
  lines,
  looksLikeHeading,
  normalizeWhitespace,
  readingMinutes,
  stripBullet,
  summarize,
  titleCase,
} from "../text-utils";

const DETAIL_SUMMARY = { concise: 3, standard: 5, detailed: 8 } as const;

export const studyStrategy: TransformStrategy = {
  id: "study",
  format: "md",
  run: ({ source, options }) => {
    const text = normalizeWhitespace(source.text);
    const title = deriveTitle(text, source.name);
    const summaryPoints = summarize(text, DETAIL_SUMMARY[options.detail]);
    const terms = keywords(text, options.detail === "concise" ? 8 : 14);
    const all = lines(text);

    const outline = all
      .filter((l) => looksLikeHeading(l))
      .map((l) => titleCase(l.replace(/^#{1,6}\s*/, "").replace(/:$/, "")))
      .slice(0, 12);

    const facts = all
      .filter((l) => isBullet(l))
      .map((l) => stripBullet(l))
      .slice(0, options.detail === "detailed" ? 18 : 10);

    const questions = (outline.length ? outline : summaryPoints.slice(0, 5)).map((topic, i) => {
      const stem = topic.replace(/[.:]$/, "");
      const templates = [
        `Explain ${stem.toLowerCase()} in your own words.`,
        `What happens if ${stem.toLowerCase()} is disrupted or removed?`,
        `Give a concrete example of ${stem.toLowerCase()}.`,
        `How does ${stem.toLowerCase()} relate to the rest of this material?`,
      ];
      return templates[i % templates.length];
    });

    const out: string[] = [
      `# Study pack — ${title}`,
      "",
      `**Source:** ${source.name}  `,
      `**Estimated review time:** ${readingMinutes(text)} min  `,
      `**Depth:** ${options.detail}`,
      "",
      "## 1. Summary",
      "",
      ...summaryPoints.map((s) => `- ${s}`),
      "",
    ];

    if (outline.length) {
      out.push("## 2. Outline", "", ...outline.map((o, i) => `${i + 1}. ${o}`), "");
    }

    if (facts.length) {
      out.push("## 3. Key points to memorize", "", ...facts.map((f) => `- ${f}`), "");
    }

    out.push(
      "## 4. Key terms",
      "",
      ...terms.map((t) => `- **${t}** — define this from the source, then check yourself.`),
      "",
      "## 5. Active recall questions",
      "",
      ...questions.map((q, i) => `${i + 1}. ${q}`),
      "",
      "## 6. Spaced review plan",
      "",
      "- [ ] Day 1 — read the source once, then answer the recall questions from memory",
      "- [ ] Day 3 — redo the questions, mark only what you missed",
      "- [ ] Day 7 — explain the outline out loud without notes",
      "- [ ] Day 21 — final pass on missed items only",
      "",
    );

    if (options.instructions?.trim()) {
      out.push("## Focus requested", "", options.instructions.trim(), "");
    }

    return {
      output: out.join("\n"),
      notes: [
        `Extracted a ${summaryPoints.length}-point summary by keyword density.`,
        `Derived ${terms.length} key terms and ${questions.length} recall questions.`,
        "Added a spaced-repetition review checklist.",
      ],
    };
  },
};
