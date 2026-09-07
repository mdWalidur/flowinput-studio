import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import type { GoalId } from "@/domain/types";

type FlowState = "idle" | "hover" | "selected" | "transforming" | "result";

interface Direction {
  id: GoalId;
  shortLabel: string;
  code: string;
  title: string;
  summary: string;
  output: Array<{ label: string; value: string }>;
  path: string;
  position: string;
}

const PRODUCT_PLAN_DIRECTION: Direction = {
  id: "spec",
  shortLabel: "Product Plan",
  code: "PLAN",
  title: "Source-faithful plan",
  summary: "Requirements and open questions without invented product claims.",
  output: [
    { label: "Need", value: "Reduce time lost to missed clinic appointments." },
    { label: "User", value: "Small-clinic staff managing a daily schedule." },
    { label: "Open question", value: "Which reminder channel should the first release use?" },
  ],
  path: "M365 310 H900",
  position: "left-[78%] top-[45%]",
};

const DIRECTIONS: Direction[] = [
  {
    id: "study",
    shortLabel: "Study",
    code: "STDY",
    title: "Study pack",
    summary: "Concepts, definitions and questions, organized for review.",
    output: [
      { label: "Concept", value: "Missed appointments create avoidable scheduling gaps." },
      { label: "Definition", value: "Reminder window — the interval before an appointment when a prompt is sent." },
      { label: "Recall", value: "Which two constraints shape the first release?" },
    ],
    path: "M365 310 C470 310 475 92 640 92 H900",
    position: "left-[71%] top-[9%]",
  },
  {
    id: "ai-context",
    shortLabel: "AI Context",
    code: "CNTX",
    title: "Bounded context",
    summary: "Source, instructions and constraints kept visibly separate.",
    output: [
      { label: "Context", value: "Small clinics lose time when patients miss appointments." },
      { label: "Instruction", value: "Propose a focused first-release workflow." },
      { label: "Constraint", value: "Use only facts present in the source." },
    ],
    path: "M365 310 C480 310 520 202 665 202 H900",
    position: "left-[75%] top-[27%]",
  },
  PRODUCT_PLAN_DIRECTION,
  {
    id: "markdown",
    shortLabel: "Markdown",
    code: "MD",
    title: "Normalized document",
    summary: "A clean hierarchy that stays portable and easy to edit.",
    output: [
      { label: "# Product brief", value: "Clinic appointment reminders" },
      { label: "## Problem", value: "Missed appointments create gaps and cost staff time." },
      { label: "## First release", value: "Simple reminders for small-clinic schedules." },
    ],
    path: "M365 310 C480 310 520 418 665 418 H900",
    position: "left-[75%] top-[63%]",
  },
  {
    id: "prompt",
    shortLabel: "Prompt",
    code: "PRMT",
    title: "Improved prompt",
    summary: "A clearer task with explicit context, limits and output shape.",
    output: [
      { label: "Role", value: "Act as a product planner for a small clinic." },
      { label: "Task", value: "Turn the source into a focused first-release plan." },
      { label: "Limit", value: "Mark missing information as an open question." },
    ],
    path: "M365 310 C470 310 475 528 640 528 H900",
    position: "left-[71%] top-[81%]",
  },
];

export function FlowField() {
  const [selectedId, setSelectedId] = useState<GoalId>("spec");
  const [hoveredId, setHoveredId] = useState<GoalId | null>(null);
  const [state, setState] = useState<FlowState>("result");
  const timerRef = useRef<number | null>(null);
  const displayId = hoveredId ?? selectedId;
  const selected = DIRECTIONS.find((item) => item.id === selectedId) ?? PRODUCT_PLAN_DIRECTION;

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const chooseDirection = (id: GoalId) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setSelectedId(id);
    setHoveredId(null);
    setState("selected");
    timerRef.current = window.setTimeout(() => {
      setState("transforming");
      timerRef.current = window.setTimeout(() => setState("result"), 520);
    }, 180);
  };

  const visibleState = hoveredId ? "hover" : state;

  return (
    <div className="flow-field" aria-label="Interactive FlowPoint transformation demonstration">
      <div className="flow-field__topline">
        <span>FIELD / 00—01</span>
        <span className="flex items-center gap-2">
          <motion.span
            className="size-1.5 rounded-full bg-signal"
            animate={{ scale: visibleState === "transforming" ? [1, 1.8, 1] : 1 }}
            transition={{ duration: 0.55 }}
          />
          {visibleState === "transforming" ? "Transforming" : visibleState === "hover" ? "Direction preview" : "Local system ready"}
        </span>
      </div>

      <div className="flow-field__stage">
        <div className="flow-field__source" aria-label="Representative source material">
          <span className="flow-label">SOURCE / ROUGH REQUIREMENT</span>
          <p>“A simple booking tool for small clinics. No-shows cost staff time. The first release should stay focused.”</p>
          <div className="mt-4 space-y-2" aria-hidden="true">
            {["w-full", "w-4/5", "w-2/3"].map((width, index) => (
              <motion.span
                key={width}
                className={`block h-px bg-border ${width}`}
                animate={{ x: visibleState === "transforming" ? [0, 8 - index * 2, 0] : 0 }}
              />
            ))}
          </div>
        </div>

        <svg className="flow-field__paths" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
          <path d="M30 310 H319" className="flow-path flow-path--source" />
          {DIRECTIONS.map((direction) => (
            <motion.path
              key={direction.id}
              d={direction.path}
              className={direction.id === displayId ? "flow-path flow-path--active" : "flow-path"}
              initial={false}
              animate={{ opacity: direction.id === displayId ? 1 : 0.3, pathLength: direction.id === displayId ? 1 : 0.96 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            />
          ))}
        </svg>

        <div className="flow-field__point-wrap">
          <motion.div
            className="flow-field__point"
            data-state={visibleState}
            animate={{
              scale: visibleState === "transforming" ? [1, 1.16, 0.94, 1] : visibleState === "hover" ? 1.08 : 1,
            }}
            transition={{ duration: visibleState === "transforming" ? 0.52 : 0.18 }}
          >
            <span />
          </motion.div>
          <span className="flow-label mt-3 text-signal">{visibleState.toUpperCase()}</span>
        </div>

        <div className="flow-field__directions" aria-label="Choose an output direction">
          {DIRECTIONS.map((direction) => {
            const active = direction.id === displayId;
            return (
              <Button
                key={direction.id}
                type="button"
                variant="ghost"
                aria-pressed={direction.id === selectedId}
                onPointerEnter={() => {
                  setHoveredId(direction.id);
                  setState("hover");
                }}
                onPointerLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(direction.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => chooseDirection(direction.id)}
                className={`flow-destination ${direction.position} ${active ? "flow-destination--active" : ""}`}
              >
                <span className="flow-destination__node" />
                <span className="min-w-0">
                  <span className="flow-label block">{direction.code}</span>
                  <span className="block truncate text-sm font-medium sm:text-base">{direction.shortLabel}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flow-field__result">
        <div className="min-w-0">
          <span className="flow-label">RESULT / {selected.code}</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selected.id}-${state}`}
              initial={{ opacity: 0, x: state === "transforming" ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <h2 className="font-sans text-xl font-semibold sm:text-2xl">{selected.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.summary}</p>
                </div>
                {state === "transforming" ? (
                  <LoaderCircle className="mt-1 size-5 shrink-0 animate-spin text-signal" aria-label="Transforming" />
                ) : (
                  <Check className="mt-1 size-5 shrink-0 text-success" aria-label="Result ready" />
                )}
              </div>
              <div className="mt-5 divide-y divide-border border-y border-border">
                {selected.output.map((row) => (
                  <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
                    <span className="flow-label pt-0.5">{row.label}</span>
                    <span className="font-display text-sm leading-6 sm:text-base">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flow-field__action">
          <Button asChild className="h-11 rounded-full px-5 shadow-none">
            <Link to="/workspace" search={{ goal: selected.id }}>
              Open this direction
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <span className="text-xs text-muted-foreground">Illustrative local result</span>
        </div>
      </div>
    </div>
  );
}