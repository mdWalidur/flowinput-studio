import type { Transition } from "motion/react";

/** One easing and one duration for the whole product. */
export const EASE = [0.2, 0, 0, 1] as const;
export const DURATION = 0.18;

export const transition: Transition = {
  duration: DURATION,
  ease: EASE,
};

/** Height/opacity reveal used by every disclosure and result entrance. */
export const reveal = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" as const },
  exit: { opacity: 0, height: 0 },
  transition,
};

export const enter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition,
};
