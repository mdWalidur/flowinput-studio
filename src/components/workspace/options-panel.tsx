import { useId } from "react";
import type { TransformOptions } from "@/domain/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function OptionsPanel({
  options,
  onChange,
}: {
  options: TransformOptions;
  onChange: (next: TransformOptions) => void;
}) {
  const notesId = useId();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <Label>Level of detail</Label>
        <ToggleGroup
          type="single"
          value={options.detail}
          onValueChange={(v) =>
            v && onChange({ ...options, detail: v as TransformOptions["detail"] })
          }
          variant="outline"
          className="w-full"
        >
          <ToggleGroupItem value="concise" className="flex-1">
            Concise
          </ToggleGroupItem>
          <ToggleGroupItem value="standard" className="flex-1">
            Standard
          </ToggleGroupItem>
          <ToggleGroupItem value="detailed" className="flex-1">
            Detailed
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2.5">
          <div className="pr-4">
            <Label htmlFor="metadata-switch" className="text-sm">
              Include a metadata header
            </Label>
            <p className="text-xs text-muted-foreground">Title, source and word count.</p>
          </div>
          <Switch
            id="metadata-switch"
            checked={options.includeMetadata}
            onCheckedChange={(checked) => onChange({ ...options, includeMetadata: checked })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={notesId}>Extra direction (optional)</Label>
        <Textarea
          id={notesId}
          value={options.instructions ?? ""}
          maxLength={500}
          onChange={(e) => onChange({ ...options, instructions: e.target.value })}
          placeholder="e.g. focus on the exam-relevant parts, keep it under one page…"
          className="min-h-28 resize-y text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {(options.instructions ?? "").length}/500 characters.
        </p>
      </div>
    </div>
  );
}
