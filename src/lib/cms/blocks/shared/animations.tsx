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
  hidden: ({ y = 5, blur = 15, exitDuration = 0.2 }: BlurUpConfig = {}) => ({
    opacity: 0,
    y,
    filter: `blur(${blur}px)`,
    transition: {
      duration: exitDuration,
      ease: "easeOut",
    },
  }),
  visible: ({ delay = 0, duration = 0.5 }: BlurUpConfig = {}) => ({
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

export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50, // Enter from Right (1) or Left (-1)
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50, // Exit to Right (-1) or Left (1)
    opacity: 0,
    filter: "blur(3px)",
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

// Generic slide variants generator
// Supports x/y axis and dynamic direction (1 or -1)
export const getSlideVariants = (
  axis: "x" | "y" = "x",
  distance = 50,
): Variants => {
  // We define the transition settings with 'as const' to fix the "string is not assignable to 'spring'" error
  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  };

  return {
    enter: (direction: number) => ({
      [axis]: direction > 0 ? distance : -distance,
      opacity: 0,
      filter: "blur(4px)",
      position: "absolute",
      width: "100%",
      height: "100%",
    }),
    center: {
      [axis]: 0,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 1,
      position: "relative",
      // We cast to 'any' here because dynamic keys ([axis]) often conflict with
      // Framer Motion's strict Transition type definitions in TypeScript.
      transition: {
        [axis]: springTransition,
        opacity: { duration: 0.2 },
      } as any,
    },
    exit: (direction: number) => ({
      [axis]: direction < 0 ? distance : -distance,
      opacity: 0,
      filter: "blur(4px)",
      zIndex: 0,
      position: "absolute",
      width: "100%",
      height: "100%",
      transition: {
        [axis]: springTransition,
        opacity: { duration: 0.2 },
      } as any,
    }),
  };
};

// Pre-defined instances for convenience
export const slideVariantsX = getSlideVariants("x");
export const slideVariantsY = getSlideVariants("y");
