import { ArrowDown, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";

import { FlowField } from "@/components/landing/flow-field";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
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
        "Direct notes, documents and ideas into useful Markdown, study material, AI context, product plans and clearer prompts.",
    }),
  component: LandingPage,
});

const SYSTEM_STATES = ["Start", "Understand", "Direct", "Transform", "Validate", "Result"] as const;

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

      <div className="flow-landing">
        <OpeningField />
        <SystemRail />
        <TransformationStage />
        <VerificationStage />
        <TerminalPoint />
      </div>
    </PageShell>
  );
}

function OpeningField() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 flow-grid opacity-40" />
      <div className="relative mx-auto max-w-[90rem] px-5 pb-10 pt-8 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16 lg:pt-10">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.55fr)]">
          <div className="min-w-0">
            <p className="flow-label flex items-center gap-3 text-foreground">
              <span className="h-px w-8 bg-border" />
              Where the flow begins
            </p>
            <h1 className="mt-5 max-w-5xl font-sans text-5xl font-semibold leading-[0.94] tracking-normal sm:text-7xl lg:text-[6.4rem]">
              Turn what you have
              <span className="block text-muted-foreground">into what’s next.</span>
            </h1>
          </div>

          <div className="grid gap-5 border-l border-border pl-5 lg:mb-2 lg:pl-8">
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              A controlled transformation field for directing source material into a
              useful, reviewable result.
            </p>
            <div className="flex items-center gap-5">
              <Button asChild className="h-11 rounded-full px-5 shadow-none">
                <Link to="/workspace">
                  Open FlowPoint
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <a href="#field-system" className="story-link text-sm font-medium">
                Follow the flow <ArrowDown className="ml-1 inline size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <FlowField />
        </div>
      </div>
    </section>
  );
}

function SystemRail() {
  return (
    <section id="field-system" className="scroll-mt-24 border-b border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="border-b border-background/20 px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-8">
          <span className="flow-label text-background/55">SYSTEM STATE</span>
          <p className="mt-3 max-w-52 text-sm leading-6 text-background/75">
            One continuous process. The material stays visible as its structure changes.
          </p>
        </div>
        <ol className="grid grid-cols-3 sm:grid-cols-6">
          {SYSTEM_STATES.map((state, index) => (
            <li
              key={state}
              className="relative border-r border-background/20 px-4 py-6 last:border-r-0 lg:py-8"
            >
              <span className="flow-label text-background/45">0{index + 1}</span>
              <span className="mt-2 block text-xs font-medium uppercase text-background sm:text-sm">
                {state}
              </span>
              <span
                className={`absolute bottom-0 left-0 h-0.5 ${index === 2 ? "w-full bg-signal" : "w-1/3 bg-background/20"}`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function TransformationStage() {
  const { scrollYProgress } = useScroll();
  const pointY = useTransform(scrollYProgress, [0.2, 0.58], [0, 310]);

  return (
    <section className="relative overflow-hidden border-b border-border py-20 sm:py-28 lg:py-36">
      <div className="absolute bottom-0 left-[calc(50%-1px)] top-0 hidden w-px bg-border lg:block" />
      <motion.div
        style={{ y: pointY }}
        className="absolute left-1/2 top-24 z-10 hidden size-4 -translate-x-1/2 rounded-full bg-signal ring-8 ring-background lg:block"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-0">
          <div className="min-w-0 lg:pr-20">
            <span className="flow-label">START / UNDERSTAND</span>
            <h2 className="mt-5 max-w-2xl font-sans text-4xl font-semibold leading-none tracking-normal sm:text-6xl">
              Keep the source.<br />Find its structure.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              FlowPoint begins with the material you provide. It does not hide the source;
              it arranges the useful facts so you can see what the result is built from.
            </p>

            <div className="mt-14 max-w-xl border-y border-border bg-surface">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-border px-5 py-4">
                <span className="flow-label">SOURCE EXCERPT</span>
                <span className="flow-label text-success">PRESERVED</span>
              </div>
              <div className="p-5 sm:p-7">
                <p className="font-display text-xl leading-8">
                  A simple booking tool for small clinics. No-shows cost staff time. The
                  first release should stay focused.
                </p>
                <div className="mt-8 space-y-3">
                  <SourceSignal label="Need" value="Reduce time lost to missed appointments" delay={0} />
                  <SourceSignal label="Audience" value="Small-clinic staff" delay={0.08} />
                  <SourceSignal label="Constraint" value="Focused first release" delay={0.16} />
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:pl-20 lg:pt-44">
            <span className="flow-label">DIRECT / TRANSFORM</span>
            <div className="mt-5 flex items-start gap-5">
              <span className="mt-1 size-4 shrink-0 rounded-full bg-signal ring-8 ring-accent" />
              <div>
                <h2 className="font-sans text-4xl font-semibold leading-none tracking-normal sm:text-6xl">
                  Purpose changes<br />the shape.
                </h2>
                <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
                  The same facts can become a study aid, clean Markdown, bounded context,
                  a product plan or a clearer prompt. Direction is explicit; nothing is
                  presented as live AI generation.
                </p>
              </div>
            </div>

            <div className="mt-14 divide-y divide-border border-y border-border">
              {[
                ["01", "Select a purpose", "The destination defines the output structure."],
                ["02", "Apply local rules", "The current MVP transforms in your browser."],
                ["03", "Resolve a result", "The output remains editable and reviewable."],
              ].map(([index, title, body]) => (
                <div key={index} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-5">
                  <span className="flow-label pt-1">{index}</span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SourceSignal({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={false}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay, duration: 0.35 }}
      className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-t border-border pt-3"
    >
      <span className="flow-label text-signal">{label}</span>
      <span className="text-sm">{value}</span>
    </motion.div>
  );
}

function VerificationStage() {
  return (
    <section className="bg-primary py-20 text-primary-foreground sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(15rem,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
          <div>
            <span className="flow-label text-primary-foreground/55">VALIDATE / RESULT</span>
            <h2 className="mt-5 font-sans text-4xl font-semibold leading-none tracking-normal sm:text-6xl">
              See the basis.<br />Check the result.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/70">
              Transparency is part of the workflow. Compare the material with the shaped
              output, then copy, download or save it in the workspace.
            </p>
          </div>

          <div className="border-y border-primary-foreground/20">
            <div className="grid sm:grid-cols-2">
              <div className="border-b border-primary-foreground/20 p-5 sm:border-b-0 sm:border-r sm:p-7">
                <span className="flow-label text-primary-foreground/50">SOURCE / 42 WORDS</span>
                <p className="mt-8 font-display text-xl leading-8 text-primary-foreground/75">
                  “A simple booking tool for small clinics. No-shows cost staff time…”
                </p>
                <span className="mt-12 block border-t border-primary-foreground/20 pt-3 text-xs text-primary-foreground/50">
                  Original remains available for review
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                  <span className="flow-label text-primary-foreground/50">RESULT / PRODUCT PLAN</span>
                  <Check className="size-4 text-signal" aria-hidden="true" />
                </div>
                <div className="mt-8 space-y-6">
                  <ResultLine label="Requirement" value="Reduce scheduling gaps from missed appointments." />
                  <ResultLine label="Primary user" value="Staff at a small clinic." />
                  <ResultLine label="Open question" value="Which reminder channel should be used?" />
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 border-t border-primary-foreground/20 sm:grid-cols-4">
              {[
                ["Processing", "Local"],
                ["Method", "Deterministic"],
                ["Source", "Preserved"],
                ["Account", "Not required"],
              ].map(([term, detail]) => (
                <div key={term} className="border-r border-primary-foreground/20 p-4 last:border-r-0 sm:p-5">
                  <dt className="flow-label text-primary-foreground/45">{term}</dt>
                  <dd className="mt-2 text-sm font-medium">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-primary-foreground/20 pt-3">
      <span className="flow-label text-signal">{label}</span>
      <p className="mt-2 font-display text-base leading-6">{value}</p>
    </div>
  );
}

function TerminalPoint() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24 sm:py-32 lg:py-40">
      <div className="pointer-events-none absolute inset-0 flow-grid opacity-45" />
      <svg viewBox="0 0 1200 520" preserveAspectRatio="none" className="absolute inset-0 size-full text-border" aria-hidden="true">
        <path d="M0 70 C350 70 390 250 590 260" className="flow-path" />
        <path d="M0 190 C330 190 420 255 590 260" className="flow-path" />
        <path d="M0 330 C330 330 420 265 590 260" className="flow-path" />
        <path d="M0 450 C350 450 390 270 590 260" className="flow-path" />
        <motion.path
          d="M610 260 H1200"
          className="flow-path flow-path--active"
          initial={false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7 }}
        />
      </svg>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
        <motion.div
          initial={false}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          className="flex size-20 items-center justify-center rounded-full border border-signal bg-background ring-[14px] ring-background"
        >
          <span className="size-4 rounded-full bg-signal" />
        </motion.div>
        <span className="flow-label mt-7 text-signal">BEGIN / WHERE THE FLOW BEGINS</span>
        <h2 className="mt-5 font-sans text-5xl font-semibold leading-none tracking-normal sm:text-7xl">
          Give the next thing<br />a direction.
        </h2>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <LockKeyhole className="size-4" aria-hidden="true" />
          Runs in your browser · No account required
        </p>
        <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7 shadow-none">
          <Link to="/workspace">
            Begin in FlowPoint
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}