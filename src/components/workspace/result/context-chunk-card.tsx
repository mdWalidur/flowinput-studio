import { useState } from "react";
import { toast } from "sonner";

import { copyToClipboard } from "@/lib/download";
import type { ContextChunk } from "./parse-ai-context";

/** One context block. Copyable on its own, because that is how briefs get used. */
export function ContextChunkCard({ chunk }: { chunk: ContextChunk }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(chunk.text);

    if (!ok) {
      toast.error("Copying was blocked. Select the text and copy it manually.");
      return;
    }

    setCopied(true);
    toast.success(`Copied block C${chunk.id}`);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="label">C{chunk.id}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-sm text-muted-foreground underline decoration-rule decoration-1 underline-offset-4 hover:text-foreground"
        >
          {copied ? "Copied" : "Copy block"}
        </button>
      </div>
      <p className="mt-2 border-l border-rule pl-4 text-base leading-7 text-muted-foreground">
        {chunk.text}
      </p>
    </div>
  );
}
