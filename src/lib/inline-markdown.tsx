import { Fragment, type ReactNode } from "react";

/** Inline emphasis, code and links — all rendered as elements, never HTML. */
export function renderInline(text: string): ReactNode {
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)\s]+\))/g;
  const parts = text.split(pattern).filter((p) => p !== "");

  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="border-b border-rule font-mono text-[0.9em]">
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
