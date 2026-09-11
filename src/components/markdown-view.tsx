import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { renderInline as inline } from "@/lib/inline-markdown";

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

function isTableRow(line: string): boolean {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isTableSeparatorRow(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("-")) return false;
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(trimmed);
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
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
        <pre key={key++} className="my-4 overflow-x-auto border-l border-rule pl-4 py-1 text-sm">
          <code className="font-mono">{body.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // GFM pipe table
    if (isTableRow(line) && isTableSeparatorRow(lines[index + 1] ?? "")) {
      const header = splitTableRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && isTableRow(lines[index] ?? "")) {
        rows.push(splitTableRow(lines[index] ?? ""));
        index++;
      }
      out.push(
        <div key={key++} className="my-5 overflow-x-auto border-y border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {header.map((cell, i) => (
                  <TableHead key={i}>{inline(cell)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, ri) => (
                <TableRow key={ri}>
                  {row.map((cell, ci) => (
                    <TableCell key={ci} className="text-muted-foreground">
                      {inline(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>,
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
          ? "mt-8 text-xl first:mt-0"
          : level === 2
            ? "mt-7 text-lg first:mt-0"
            : "mt-6 text-base font-medium first:mt-0";
      const Tag = `h${Math.min(level + 1, 6)}` as unknown as "h2";
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
        <blockquote key={key++} className="my-4 border-l border-rule pl-4 text-muted-foreground">
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
            ordered ? "my-3 list-decimal space-y-1.5 pl-5" : "my-3 list-disc space-y-1.5 pl-5"
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
      <p key={key++} className="my-4 leading-7">
        {inline(paragraph.join(" "))}
      </p>,
    );
  }

  return out;
}
