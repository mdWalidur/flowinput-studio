import { useId } from "react";
import type { GoalDefinition } from "@/domain/goals";
import type { TransformOptions } from "@/domain/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const DETAIL_WORDS: Record<TransformOptions["detail"], string> = {
  concise: "Short",
  standard: "Balanced",
  detailed: "Thorough",
};

/** Shows only the choices that matter for the selected goal. */
export function OptionsPanel({
  goal,
  options,
  onChange,
}: {
  goal: GoalDefinition;
  options: TransformOptions;
  onChange: (next: TransformOptions) => void;
}) {
  const notesId = useId();
  const metaId = useId();
  const shows = (key: string) => goal.options.includes(key as never);

  if (goal.options.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing to set up for this one — go straight ahead.
      </p>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="space-y-4">
        {shows("detail") && (
          <div className="space-y-2">
            <Label>{goal.detailLabel ?? "How much detail?"}</Label>
            <ToggleGroup
              type="single"
              value={options.detail}
              onValueChange={(v) =>
                v && onChange({ ...options, detail: v as TransformOptions["detail"] })
              }
              variant="outline"
              className="w-full"
            >
              {(Object.keys(DETAIL_WORDS) as Array<TransformOptions["detail"]>).map((key) => (
                <ToggleGroupItem key={key} value={key} className="flex-1">
                  {DETAIL_WORDS[key]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        {shows("metadata") && (
          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <Label htmlFor={metaId} className="text-sm">
                Add a short header
              </Label>
              <p className="text-xs text-muted-foreground">Title, where it came from, length.</p>
            </div>
            <Switch
              id={metaId}
              checked={options.includeMetadata}
              onCheckedChange={(checked) => onChange({ ...options, includeMetadata: checked })}
            />
          </div>
        )}
      </div>

      {shows("instructions") && (
        <div className="space-y-2">
          <Label htmlFor={notesId}>Anything else we should know? (optional)</Label>
          <Textarea
            id={notesId}
            value={options.instructions ?? ""}
            maxLength={500}
            onChange={(e) => onChange({ ...options, instructions: e.target.value })}
            placeholder={goal.instructionsHint}
            className="min-h-28 resize-y rounded-none border-x-0 border-t-0 px-0 text-sm shadow-none focus-visible:ring-0"
          />
          <p className="text-xs text-muted-foreground">
            {(options.instructions ?? "").length}/500 characters.
          </p>
        </div>
      )}
    </div>
  );
}
