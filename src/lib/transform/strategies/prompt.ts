import type { TransformStrategy } from "../index";
import { keywords, normalizeWhitespace, sentences, wordCount } from "../text-utils";

const MEDIUM_HINTS: Array<[RegExp, string]> = [
  [/video|reel|clip|footage|cinematic|drone/i, "video"],
  [/image|photo|poster|illustration|logo|render/i, "image"],
  [/code|function|component|api|script|bug/i, "code"],
  [/email|blog|article|copy|caption|essay/i, "writing"],
];

const MEDIUM_GUIDANCE: Record<string, string[]> = {
  video: [
    "Shot type, camera movement and lens feel",
    "Duration, aspect ratio and pacing",
    "Lighting, colour palette and mood",
    "Sound or music direction (if supported)",
  ],
  image: [
    "Subject, composition and framing",
    "Style reference and level of realism",
    "Lighting, palette and aspect ratio",
    "What must NOT appear",
  ],
  code: [
    "Language, framework and version",
    "Input/output contract and edge cases",
    "Performance and error-handling expectations",
    "Whether tests or comments are required",
  ],
  writing: [
    "Audience and reading level",
    "Tone of voice and length",
    "Structure (sections, bullets, CTA)",
    "Words or claims to avoid",
  ],
  general: [
    "Audience and purpose",
    "Length and format of the answer",
    "Constraints and things to avoid",
    "How success will be judged",
  ],
};

export const promptStrategy: TransformStrategy = {
  id: "prompt",
  format: "txt",
  run: ({ source, options }) => {
    const text = normalizeWhitespace(source.text);
    const medium = MEDIUM_HINTS.find(([re]) => re.test(text))?.[1] ?? "general";
    const details = keywords(text, 10);
    const asks = sentences(text);
    const task = (asks[0] ?? text).replace(/^(make|create|write|generate)\s+me\s+/i, "");

    const roles: Record<string, string> = {
      video: "an award-winning cinematographer and video prompt engineer",
      image: "a senior art director and visual prompt engineer",
      code: "a staff software engineer who writes production-ready code",
      writing: "a seasoned editor and copywriter",
      general: "an expert assistant who asks for nothing and assumes nothing",
    };

    const lengthGuide =
      options.detail === "concise"
        ? "Keep the answer tight — no preamble."
        : options.detail === "detailed"
          ? "Be thorough and explain your key choices briefly at the end."
          : "Be clear and complete without padding.";

    const out: string[] = [
      "ROLE",
      `You are ${roles[medium]}.`,
      "",
      "TASK",
      task.trim().replace(/\s+/g, " "),
      "",
      "CONTEXT (verbatim from the requester)",
      text,
      "",
      "REQUIRED DETAILS TO HONOUR",
      ...(MEDIUM_GUIDANCE[medium] ?? MEDIUM_GUIDANCE["general"] ?? []).map((g) => `- ${g}`),
      ...(details.length ? [`- Keep these specifics: ${details.join(", ")}`] : []),
      "",
      "CONSTRAINTS",
      `- ${lengthGuide}`,
      "- Do not invent facts; mark uncertainty explicitly.",
      "- Respect any stated platform, duration, ratio or word limits.",
      ...(options.instructions?.trim()
        ? [`- Extra requirement: ${options.instructions.trim()}`]
        : []),
      "",
      "OUTPUT FORMAT",
      medium === "video" || medium === "image"
        ? "1) One-paragraph final prompt, ready to paste.\n2) A short list of alternative variations.\n3) A negative prompt line."
        : "1) The deliverable itself.\n2) A short list of assumptions you made.\n3) One suggestion to improve the request.",
      "",
      "QUALITY BAR",
      "Before answering, silently check the output against every constraint above and fix anything that fails.",
      "",
      `-- optimized by FlowPoint from ${wordCount(text)} words of input --`,
    ];

    return {
      output: out.join("\n"),
      notes: [
        `Detected intent: ${medium}.`,
        "Structured into role, task, context, constraints and output contract.",
        "Preserved your original wording as verbatim context.",
      ],
    };
  },
};
