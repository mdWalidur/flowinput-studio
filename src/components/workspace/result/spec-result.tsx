import { useMemo } from "react";
import type { TransformResult } from "@/domain/types";
import { MarkdownView } from "@/components/markdown-view";
import { renderInline } from "@/lib/inline-markdown";
import { parseSpecOutput, type SpecSection } from "./parse-spec";

/** A specification document: a jump-link index alongside numbered sections, real tables, badged assumptions. */
export function SpecResult({ result }: { result: TransformResult }) {
  const sections = useMemo(() => parseSpecOutput(result.output), [result.output]);
  if (!sections) return <MarkdownView markdown={result.output} />;

  return (
    <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:items-start lg:gap-6">
      <nav aria-label="Section index" className="mb-5 lg:sticky lg:top-0 lg:mb-0">
        <p className="eyebrow">Sections</p>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm lg:block lg:space-y-1">
          {sections.map((section) => (
            <li key={section.number}>
              <a
                href={`#spec-section-${section.number}`}
                className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {section.number}. {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-6">
        {sections.map((section) => (
          <SpecSectionBlock key={section.number} section={section} />
        ))}
      </div>
    </div>
  );
}

function SpecSectionBlock({ section }: { section: SpecSection }) {
  const ListTag = section.kind === "numbered" ? "ol" : "ul";

  return (
    <section
      id={`spec-section-${section.number}`}
      aria-labelledby={`spec-heading-${section.number}`}
    >
      <h3 id={`spec-heading-${section.number}`} className="font-display text-base font-semibold">
        {section.number}. {section.title}
      </h3>
      {section.kind === "raw" ? (
        <div className="mt-2">
          <MarkdownView markdown={section.raw} />
        </div>
      ) : (
        <ListTag
          className={
            section.kind === "numbered"
              ? "mt-2 list-decimal space-y-1.5 pl-5 text-sm"
              : "mt-2 list-disc space-y-1.5 pl-5 text-sm"
          }
        >
          {section.items.map((item, i) => (
            <li key={i}>
              {item.assumption && (
                <span className="mr-1.5 text-xs text-muted-foreground">Assumption:</span>
              )}
              {renderInline(item.text)}
            </li>
          ))}
        </ListTag>
      )}
    </section>
  );
}
