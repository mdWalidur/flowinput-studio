import { useMemo } from "react";

import { MarkdownView } from "@/components/markdown-view";
import type { TransformResult } from "@/domain/types";
import { renderInline } from "@/lib/inline-markdown";
import { parseSpecOutput, type SpecSection } from "./parse-spec";

/**
 * A numbered specification ledger. Items derived rather than stated in the
 * source stay marked as assumptions — nothing is silently invented.
 */
export function SpecResult({ result }: { result: TransformResult }) {
  const sections = useMemo(() => parseSpecOutput(result.output), [result.output]);
  if (!sections) return <MarkdownView markdown={result.output} />;

  return (
    <div>
      {sections.map((section, index) => (
        <SpecSectionBlock key={section.number} section={section} first={index === 0} />
      ))}
    </div>
  );
}

function SpecSectionBlock({ section, first }: { section: SpecSection; first: boolean }) {
  const ListTag = section.kind === "numbered" ? "ol" : "ul";

  return (
    <section
      id={`spec-section-${section.number}`}
      aria-labelledby={`spec-heading-${section.number}`}
      className={first ? "" : "mt-8 border-t border-border pt-5"}
    >
      <div className="flex items-baseline gap-3">
        <span className="label tabular-nums">{String(section.number).padStart(2, "0")}</span>
        <h3 id={`spec-heading-${section.number}`} className="text-lg">
          {section.title}
        </h3>
      </div>

      {section.kind === "raw" ? (
        <div className="mt-4">
          <MarkdownView markdown={section.raw} />
        </div>
      ) : (
        <ListTag
          className={
            section.kind === "numbered"
              ? "mt-4 list-decimal space-y-2 pl-5 text-base"
              : "mt-4 list-disc space-y-2 pl-5 text-base"
          }
        >
          {section.items.map((item, i) => (
            <li key={i}>
              {item.assumption && <span className="label mr-2">Assumption</span>}
              {renderInline(item.text)}
            </li>
          ))}
        </ListTag>
      )}
    </section>
  );
}
