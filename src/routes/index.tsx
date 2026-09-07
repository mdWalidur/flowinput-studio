import { useState } from "react";
import { ArrowDown, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

import { BrandMark } from "@/components/brand-mark";
import { GoalIcon } from "@/components/goal-icon";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { GOALS } from "@/domain/goals";
import {
  organizationJsonLd,
  publicRouteMeta,
  webApplicationJsonLd,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    publicRouteMeta({
      path: "/",
      title: "FlowPoint — turn what you have into what’s next",
      description:
        "FlowPoint turns notes, documents and ideas into useful next outputs: Markdown, study material, AI context, product plans and clearer prompts.",
    }),
  component: LandingPage,
});

const FLOW_STEPS = [
  ["01", "Start", "Bring the source"],
  ["02", "Understand", "Read the material"],
  ["03", "Direct", "Choose the purpose"],
  ["04", "Transform", "Shape the output"],
  ["05", "Validate", "Review the result"],
  ["06", "Result", "Take it forward"],
] as const;

const ARTIFACT_OUTPUTS = [
  {
    id: "spec",
    label: "Product plan",
    title: "A clear product direction",
    detail: "Problem · users · screens · first release",
    goal: "spec" as const,
  },
  {
    id: "study",
    label: "Study pack",
    title: "Material ready to learn",
    detail: "Outline · key terms · recall questions",
    goal: "study" as const,
  },
  {
    id: "context",
    label: "AI context",
    title: "Context with clear boundaries",
    detail: "Instructions · source blocks · constraints",
    goal: "ai-context" as const,
  },
] as const;

type ArtifactOutputId = (typeof ARTIFACT_OUTPUTS)[number]["id"];

function LandingPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd()) }}
      />

      <Hero />
      <FlowSequence />
      <Directions />
      <BranchingSource />
      <Foundation />
      <FinalCall />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 flow-grid opacity-40 lg:block" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <motion.div
          initial={false}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(34rem,1.05fr)] lg:items-center"
        >
          <div>
            <motion.div
              variants={reveal}
              className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-signal" />
              Where the flow begins.
            </motion.div>

            <motion.h1
              variants={reveal}
              className="mt-7 max-w-3xl text-balance font-display text-6xl leading-[0.94] tracking-normal sm:text-7xl lg:text-[5.8rem]"
            >
              Turn what you have into what’s next.
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mt-8 max-w-lg text-lg leading-8 text-muted-foreground"
            >
              FlowPoint gives messy source material a deliberate direction—so notes,
              documents and ideas become something useful, reviewable and ready to move.
            </motion.p>

            <motion.div variants={reveal} className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-6 shadow-none">
                <Link to="/workspace">
                  Open FlowPoint
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 rounded-full px-5"
              >
                <a href="#how-it-works">
                  See how it works
                  <ArrowDown aria-hidden="true" />
                </a>
              </Button>
            </motion.div>

            <motion.p
              variants={reveal}
              className="mt-7 flex items-center gap-2 text-xs text-muted-foreground"
            >
              <LockKeyhole className="size-3.5" aria-hidden="true" />
              Runs in your browser · No account required
            </motion.p>
          </div>

          <motion.div variants={reveal}>
            <FlowArtifact />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FlowArtifact() {
  const [activeId, setActiveId] = useState<ArtifactOutputId>("spec");
  const active =
    ARTIFACT_OUTPUTS.find((output) => output.id === activeId) ?? ARTIFACT_OUTPUTS[0];

  return (
    <div className="relative border-y border-border bg-background py-5 sm:py-7">
      <div className="flex items-center justify-between px-5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted-foreground sm:px-7">
        <span>Flow instrument / 01</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success" />
          Ready
        </span>
      </div>

      <div className="relative mt-7 min-h-[31rem] overflow-hidden border-y border-border bg-secondary/20 sm:min-h-[33rem]">
        <div className="absolute inset-0 flow-grid opacity-55" />
        <svg
          viewBox="0 0 640 470"
          className="pointer-events-none absolute inset-0 size-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M42 235 H268"
            stroke="currentColor"
            className="text-border"
            strokeWidth="1.5"
            initial={false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          <motion.path
            d="M286 235 C355 235 350 94 430 94 H610"
            stroke="currentColor"
            className="text-border"
            fill="none"
            strokeWidth="1.5"
            initial={false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.65, delay: 0.65 }}
          />
          <motion.path
            d="M286 235 H610"
            stroke="currentColor"
            className="text-border"
            fill="none"
            strokeWidth="1.5"
            initial={false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          />
          <motion.path
            d="M286 235 C355 235 350 376 430 376 H610"
            stroke="currentColor"
            className="text-border"
            fill="none"
            strokeWidth="1.5"
            initial={false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.65, delay: 0.85 }}
          />
        </svg>

        <div className="absolute left-5 top-1/2 w-44 -translate-y-1/2 border border-border bg-background p-4 sm:left-7 sm:w-52">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
            Source / rough brief
          </p>
          <p className="mt-4 text-sm leading-6">
            “A simple booking tool for small clinics. No-shows cost time…”
          </p>
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            <span className="h-px w-12 bg-border" />
            <span className="h-px w-6 bg-border" />
            <span className="h-px w-9 bg-border" />
          </div>
        </div>

        <motion.div
          className="absolute left-[44%] top-1/2 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-signal bg-background sm:left-[45%] sm:size-16"
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.35 }}
        >
          <span className="size-3 rounded-full bg-signal" />
          <span className="absolute -bottom-7 whitespace-nowrap font-mono text-[0.58rem] uppercase tracking-[0.12em] text-signal">
            Direct
          </span>
        </motion.div>

        <div className="absolute right-4 top-10 flex w-[43%] flex-col gap-14 sm:right-6 sm:w-[42%] sm:gap-[4.4rem]">
          {ARTIFACT_OUTPUTS.map((output) => {
            const isActive = output.id === activeId;
            return (
              <Button
                key={output.id}
                type="button"
                variant="ghost"
                aria-pressed={isActive}
                onClick={() => setActiveId(output.id)}
                className="group h-auto min-h-20 justify-start rounded-none border-0 bg-transparent p-0 text-left shadow-none hover:bg-transparent"
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isActive
                      ? "border-signal bg-signal text-signal-foreground"
                      : "border-border bg-background"
                  }`}
                >
                  <span className="size-1 rounded-full bg-current" />
                </span>
                <span>
                  <span className="block font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {output.label}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground">
                    {output.title}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pt-5 sm:px-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-xl tracking-normal">{active.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{active.detail}</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="justify-start rounded-full px-0 hover:bg-transparent sm:px-3">
              <Link to="/workspace" search={{ goal: active.goal }}>
                Open this direction
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FlowSequence() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          index="01"
          eyebrow="Control every flow"
          title="A clear path from source to result."
          body="FlowPoint keeps the material visible, the choice explicit and the result open to review."
        />

        <div className="relative mt-16 overflow-x-auto pb-3">
          <div className="absolute left-0 right-0 top-[1.12rem] h-px bg-border" />
          <ol className="relative grid min-w-[54rem] grid-cols-6">
            {FLOW_STEPS.map(([number, name, detail], index) => (
              <motion.li
                key={name}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ delay: index * 0.055, duration: 0.35 }}
                className="pr-5"
              >
                <div className="flex items-center">
                  <span className="z-10 flex size-9 items-center justify-center rounded-full border border-border bg-background font-mono text-[0.62rem] text-muted-foreground">
                    {number}
                  </span>
                </div>
                <p className="mt-6 font-mono text-[0.64rem] uppercase tracking-[0.13em] text-signal">
                  {name}
                </p>
                <p className="mt-2 max-w-28 text-sm leading-5 text-muted-foreground">
                  {detail}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Directions() {
  const [activeGoal, setActiveGoal] = useState(GOALS[0]?.id ?? "markdown");

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          index="02"
          eyebrow="What can you do here?"
          title="Choose a useful direction."
          body="The same material can serve a different purpose. Select the outcome; FlowPoint keeps the path clear."
        />

        <div className="mt-16 border-y border-border">
          {GOALS.map((goal, index) => {
            const active = goal.id === activeGoal;
            return (
              <motion.div
                key={goal.id}
                onHoverStart={() => setActiveGoal(goal.id)}
                className="group border-b border-border last:border-b-0"
              >
                <Link
                  to="/workspace"
                  search={{ goal: goal.id }}
                  onFocus={() => setActiveGoal(goal.id)}
                  className="grid gap-4 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_minmax(15rem,0.8fr)_auto] sm:items-center sm:py-7"
                >
                  <span className="font-mono text-[0.65rem] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-4">
                    <GoalIcon
                      icon={goal.icon}
                      className={`size-5 transition-colors ${active ? "text-signal" : "text-muted-foreground"}`}
                    />
                    <span className="font-display text-2xl tracking-normal sm:text-3xl">
                      {goal.label}
                    </span>
                  </span>
                  <span className="text-sm leading-6 text-muted-foreground">
                    {goal.tagline}
                  </span>
                  <motion.span
                    animate={{ x: active ? 5 : 0 }}
                    className="hidden text-signal sm:block"
                  >
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BranchingSource() {
  return (
    <section className="overflow-hidden border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-primary-foreground/65">
              03 / One source
            </p>
            <h2 className="mt-6 text-balance font-display text-5xl leading-none tracking-normal sm:text-6xl">
              Many useful directions.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/70">
              A lecture can become a study pack, clean Markdown or bounded context for
              another tool. The source stays the source. Only the purpose changes.
            </p>
          </div>

          <div className="relative min-h-[28rem] border-y border-primary-foreground/20 py-8">
            <div className="absolute bottom-0 left-[38%] top-0 w-px bg-primary-foreground/20" />
            <div className="grid h-full grid-cols-[38%_62%]">
              <div className="flex items-center pr-7">
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.13em] text-primary-foreground/55">
                    Lecture notes
                  </p>
                  <p className="mt-4 font-display text-2xl leading-tight tracking-normal">
                    Cell membrane transport
                  </p>
                  <p className="mt-4 text-xs leading-6 text-primary-foreground/60">
                    Diffusion, osmosis, concentration gradients, active transport…
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col justify-center gap-6 pl-14 sm:pl-20">
                <span className="absolute left-0 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal ring-8 ring-primary" />
                {[
                  ["Study", "Summary + recall questions"],
                  ["Markdown", "Clean, portable notes"],
                  ["AI context", "Structured source package"],
                ].map(([label, result], index) => (
                  <motion.div
                    key={label}
                    initial={false}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="relative border-t border-primary-foreground/20 pt-4"
                  >
                    <span className="absolute -left-14 top-0 h-px w-14 bg-primary-foreground/20 sm:-left-20 sm:w-20" />
                    <p className="font-mono text-[0.61rem] uppercase tracking-[0.13em] text-signal">
                      {label}
                    </p>
                    <p className="mt-2 text-sm">{result}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Foundation() {
  const truths = [
    ["Source-faithful", "Your material remains visible so you can compare source and result."],
    ["Local-first MVP", "Current transformations and saved work stay in your browser."],
    ["Honestly deterministic", "No hidden claim of live AI: today’s results use clear, fixed rules."],
  ] as const;

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          index="04"
          eyebrow="The foundation"
          title="Useful by design. Honest by default."
          body="FlowPoint is built to help you direct your own material—not to hide it behind a black box."
        />
        <div className="mt-16 grid border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
          {truths.map(([title, body], index) => (
            <div key={title} className="border-b border-border py-7 last:border-b-0 sm:border-b-0 sm:px-7 sm:first:pl-0 sm:last:pr-0">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-signal" aria-hidden="true" />
                <h3 className="font-display text-xl tracking-normal">{title}</h3>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{body}</p>
              <p className="mt-6 font-mono text-[0.6rem] text-muted-foreground">0{index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCall() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 flow-grid opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <BrandMark className="mx-auto size-12 text-signal" />
          <p className="mt-7 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
            Where the flow begins.
          </p>
          <h2 className="mt-6 text-balance font-display text-5xl leading-none tracking-normal sm:text-7xl">
            Give the next step a direction.
          </h2>
          <div className="mt-9 flex justify-center">
            <Button asChild size="lg" className="h-12 rounded-full px-7 shadow-none">
              <Link to="/workspace">
                Open FlowPoint
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  body,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
      <div className="flex items-start gap-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="text-signal">{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div className="border-t border-border pt-7">
        <h2 className="max-w-3xl text-balance font-display text-4xl leading-tight tracking-normal sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};
