import type { TransformStrategy } from "../index";
import {
  deriveTitle,
  isBullet,
  keywords,
  lines,
  normalizeWhitespace,
  stripBullet,
  summarize,
  titleCase,
} from "../text-utils";

const ROLE_HINTS = [
  "admin",
  "owner",
  "manager",
  "student",
  "teacher",
  "patient",
  "customer",
  "client",
  "user",
  "therapist",
  "receptionist",
  "creator",
  "guest",
];

const PAGE_HINTS: Array<[RegExp, string]> = [
  [/book|appointment|schedul|calendar/i, "Booking / Calendar"],
  [/dashboard|report|analytic|figure|revenue/i, "Dashboard & Reports"],
  [/login|sign.?up|auth|account/i, "Authentication"],
  [/profile|setting|preference/i, "Profile & Settings"],
  [/upload|file|document|pdf/i, "Uploads / Library"],
  [/notif|remind|sms|email/i, "Notifications"],
  [/payment|invoice|billing|price|insurance/i, "Billing"],
  [/search|filter|browse|list/i, "Search & Browse"],
  [/chat|message|comment/i, "Messaging"],
  [/admin|permission|role/i, "Admin"],
];

export const specStrategy: TransformStrategy = {
  id: "spec",
  format: "md",
  run: ({ source, options }) => {
    const text = normalizeWhitespace(source.text);
    const title = deriveTitle(text, source.name).replace(/^idea:\s*/i, "");
    const all = lines(text);
    const bullets = all.filter(isBullet).map(stripBullet);
    const problem = summarize(text, options.detail === "detailed" ? 4 : 2);

    const roles = ROLE_HINTS.filter((r) => new RegExp(`\\b${r}s?\\b`, "i").test(text)).map(
      titleCase,
    );
    const pages = PAGE_HINTS.filter(([re]) => re.test(text)).map(([, name]) => name);
    const entities = keywords(text, 8).map(titleCase);

    const requirements = (bullets.length ? bullets : problem).slice(
      0,
      options.detail === "concise" ? 6 : 14,
    );

    const out: string[] = [
      `# Product specification — ${title}`,
      "",
      "> Draft generated from your notes by FlowPoint. Anything marked `ASSUMPTION`",
      "> was inferred and should be confirmed before build.",
      "",
      "## 1. Problem statement",
      "",
      ...problem.map((p) => `- ${p}`),
      "",
      "## 2. Users and roles",
      "",
      ...(roles.length
        ? roles.map((r) => `- **${r}** — permissions to be defined.`)
        : ["- `ASSUMPTION` Single end-user role plus an administrator."]),
      "",
      "## 3. Scope — MVP requirements",
      "",
      ...requirements.map((r, i) => `${i + 1}. ${r}`),
      "",
      "## 4. Out of scope for v1",
      "",
      "- Anything listed as “nice to have” in the source notes",
      "- Native mobile apps (responsive web first)",
      "- Third-party integrations not required for the core loop",
      "",
      "## 5. Proposed screens",
      "",
      ...(pages.length ? pages : ["Home", "Main workspace", "Settings"]).map((p) => `- ${p}`),
      "",
      "## 6. Candidate data model",
      "",
      "| Entity | Purpose | Notes |",
      "| --- | --- | --- |",
      ...entities.map(
        (e) => `| ${e} | Derived from source terminology | \`ASSUMPTION\` fields TBD |`,
      ),
      "",
      "## 7. Non-functional requirements",
      "",
      "- Responsive from 360px upward; keyboard accessible; WCAG AA contrast",
      "- Authentication with least-privilege authorization on every read/write",
      "- Sensitive data encrypted at rest and in transit; audit log for admin actions",
      "- Rate limiting on public endpoints; validated input on both client and server",
      "",
      "## 8. Milestones",
      "",
      "1. **M1 — Foundations:** schema, auth, empty shell of each screen",
      "2. **M2 — Core loop:** the primary end-to-end user journey works",
      "3. **M3 — Polish:** empty/loading/error states, mobile pass, accessibility pass",
      "4. **M4 — Launch:** analytics, backups, monitoring, onboarding copy",
      "",
      "## 9. Open questions",
      "",
      "- Who owns the data and what are the retention rules?",
      "- What is the single success metric for v1?",
      "- Which requirement could be cut without breaking the core loop?",
      "",
    ];

    if (options.instructions?.trim()) {
      out.push("## 10. Extra direction", "", options.instructions.trim(), "");
    }

    return {
      output: out.join("\n"),
      notes: [
        `Inferred ${roles.length || 0} roles and ${pages.length || 3} screens from the notes.`,
        `Turned ${requirements.length} lines into numbered MVP requirements.`,
        "Added non-functional, milestone and open-question sections.",
      ],
    };
  },
};
