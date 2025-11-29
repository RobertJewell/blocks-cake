import { Variants } from "motion/react";

type BlurUpConfig = {
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  exitDuration?: number;
};

// animation variants
export const blurUpVariants: Variants = {
  hidden: ({ y = 5, blur = 10, exitDuration = 0.2 }: BlurUpConfig = {}) => ({
    opacity: 0,
    y,
    filter: `blur(${blur}px)`,
    transition: {
      duration: exitDuration,
      ease: "easeOut",
    },
  }),
  visible: ({ delay = 0, duration = 0.4 }: BlurUpConfig = {}) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration,
      ease: "easeOut",
      delay,
    },
  }),
};

export type AnimationMode = "push" | "pop" | "fade";

export const editorVariants: Variants = {
  enter: (mode: AnimationMode) => {
    if (mode === "fade") {
      return { opacity: 0, scale: 0.98, x: 0, filter: "blur(3px)" };
    }
    // Push: Enter from Right (50). Pop: Enter from Left (-50)
    return {
      x: mode === "push" ? 50 : -50,
      opacity: 0,
      filter: "blur(3px)",
    };
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  },
  exit: (mode: AnimationMode) => {
    if (mode === "fade") {
      return { opacity: 0, scale: 0.98, x: 0, filter: "blur(3px)" };
    }
    // Push: Exit to Left (-50). Pop: Exit to Right (50)
    return {
      x: mode === "push" ? -50 : 50,
      opacity: 0,
      filter: "blur(3px)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    };
  },
};
