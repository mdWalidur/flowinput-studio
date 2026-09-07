import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/download";
import type { ContextChunk } from "./parse-ai-context";

export function ContextChunkCard({ chunk }: { chunk: ContextChunk }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(chunk.text);
    if (ok) {
      setCopied(true);
      toast.success(`Copied chunk C${chunk.id}`);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Copying was blocked. Select the text and copy it manually.");
    }
  };

  return (
    <div className="border-t border-border py-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">C{chunk.id}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={`Copy chunk C${chunk.id}`}
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
        </Button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{chunk.text}</p>
    </div>
  );
}
