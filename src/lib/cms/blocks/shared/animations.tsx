import { Variants } from "motion/react";

type BlurUpConfig = {
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
};

// animation variants
export const blurUpVariants: Variants = {
  hidden: ({ y = 5, blur = 15 }: BlurUpConfig = {}) => ({
    opacity: 0,
    y,
    filter: `blur(${blur}px)`,
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
