import { Bot, FileText, GraduationCap, LayoutDashboard, Wand2 } from "lucide-react";
import type { GoalDefinition } from "@/domain/goals";

export function GoalIcon({
  icon,
  className,
}: {
  icon: GoalDefinition["icon"];
  className?: string;
}) {
  const Comp =
    icon === "file-text"
      ? FileText
      : icon === "graduation-cap"
        ? GraduationCap
        : icon === "bot"
          ? Bot
          : icon === "layout-dashboard"
            ? LayoutDashboard
            : Wand2;
  return <Comp className={className} aria-hidden="true" />;
}
