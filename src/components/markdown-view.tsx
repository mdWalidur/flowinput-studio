import { Fragment, type ReactNode } from "react";

/**
 * Minimal, safe Markdown preview.
 *
 * It builds React elements only — no dangerouslySetInnerHTML, no HTML parsing —
 * so anything inside a user's document is rendered as text, never as markup or
 * script. Unknown syntax degrades to plain text.
 */
export function MarkdownView({ markdown }: { markdown: string }) {
  return <div className="prose-flow">{renderBlocks(markdown)}</div>;
}

function renderBlocks(markdown: string): ReactNode[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (!line.trim()) {
      index++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const body: string[] = [];
      index++;
      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        body.push(lines[index] ?? "");
        index++;
      }
      index++;
      out.push(
        <pre key={key++} className="overflow-x-auto rounded-lg bg-surface-2 p-3 text-[13px]">
          <code className="font-mono">{body.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      out.push(<hr key={key++} className="my-6 border-border" />);
      index++;
      continue;
    }

    // Heading
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      const content = inline(heading[2] ?? "");
      const cls =
        level === 1
          ? "mt-6 font-display text-xl font-semibold first:mt-0 sm:text-2xl"
          : level === 2
            ? "mt-6 font-display text-lg font-semibold first:mt-0"
            : "mt-5 font-display text-base font-semibold first:mt-0";
      const Tag = (`h${Math.min(level + 1, 6)}` as unknown) as "h2";
      out.push(
        <Tag key={key++} className={cls}>
          {content}
        </Tag>,
      );
      index++;
      continue;
    }

    // Blockquote
    if (line.trimStart().startsWith(">")) {
      const body: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trimStart().startsWith(">")) {
        body.push((lines[index] ?? "").replace(/^\s*>\s?/, ""));
        index++;
      }
      out.push(
        <blockquote
          key={key++}
          className="my-4 border-l-2 border-primary/50 pl-4 text-muted-foreground"
        >
          {body.map((b, i) => (
            <p key={i}>{inline(b)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Lists (ordered / unordered, one nesting level)
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: Array<{ depth: number; text: string }> = [];
      while (index < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[index] ?? "")) {
        const raw = lines[index] ?? "";
        const depth = Math.min(Math.floor((raw.match(/^\s*/)?.[0].length ?? 0) / 2), 2);
        items.push({ depth, text: raw.replace(/^\s*([-*+]|\d+[.)])\s+/, "") });
        index++;
      }
      const ListTag = ordered ? "ol" : "ul";
      out.push(
        <ListTag
          key={key++}
          className={
            ordered
              ? "my-3 list-decimal space-y-1.5 pl-5"
              : "my-3 list-disc space-y-1.5 pl-5 marker:text-primary/60"
          }
        >
          {items.map((item, i) => (
            <li key={i} style={{ marginInlineStart: `${item.depth * 1}rem` }}>
              {inline(item.text)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    // Paragraph
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      (lines[index] ?? "").trim() &&
      !/^(#{1,6}\s|\s*([-*+]|\d+[.)])\s|>|```)/.test(lines[index] ?? "")
    ) {
      paragraph.push(lines[index] ?? "");
      index++;
    }
    out.push(
      <p key={key++} className="my-3 leading-relaxed">
        {inline(paragraph.join(" "))}
      </p>,
    );
  }

  return out;
}

/** Inline emphasis, code and links — all rendered as elements, never HTML. */
function inline(text: string): ReactNode {
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)\s]+\))/g;
  const parts = text.split(pattern).filter((p) => p !== "");

  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (
      (part.startsWith("**") && part.endsWith("**")) ||
      (part.startsWith("__") && part.endsWith("__"))
    ) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    ) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const href = link[2] ?? "";
      // Only allow safe schemes; anything else stays plain text.
      if (/^(https?:\/\/|mailto:|\/)/i.test(href)) {
        return (
          <a
            key={i}
            href={href}
            rel="noopener noreferrer nofollow"
            target="_blank"
            className="text-primary underline underline-offset-2"
          >
            {link[1]}
          </a>
        );
      }
      return <Fragment key={i}>{link[1]}</Fragment>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
