"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { blurUpVariants } from "../shared/animations";

export type HeroProps = {
  heading: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  leftImage?: string;
  rightImage?: string;
};

export const Hero = ({
  heading,
  subheading,
  ctaText,
  ctaHref = "#",
  leftImage,
  rightImage,
}: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // transforms
  const leftImageXRaw = useTransform(scrollY, [0, 300], [-100, -150]);
  const rightImageXRaw = useTransform(scrollY, [0, 300], [100, 150]);
  const leftImageRotateRaw = useTransform(scrollY, [0, 300], [-5, -10]);
  const rightImageRotateRaw = useTransform(scrollY, [0, 300], [5, 10]);

  const leftImageX = useSpring(leftImageXRaw, { stiffness: 100, damping: 30 });
  const rightImageX = useSpring(rightImageXRaw, { stiffness: 100, damping: 30 });
  const leftImageRotate = useSpring(leftImageRotateRaw, {
    stiffness: 100,
    damping: 30,
  });
  const rightImageRotate = useSpring(rightImageRotateRaw, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div className="p-2">
      <div
        ref={containerRef}
        className="relative flex h-[calc(100svh-1rem)] max-h-224 min-h-152 w-full flex-col gap-2 overflow-hidden rounded-2xl bg-linear-to-t from-pink-200 to-pink-500 p-4 sm:items-center"
      >
        <motion.h1
          initial={{ filter: "blur(15px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 1 }}
          className="pt-16 font-serif text-7xl text-white sm:text-center sm:text-8xl md:pt-32"
        >
          {heading}
        </motion.h1>

        <div className="flex flex-col items-center gap-4 md:mt-4">
          {subheading && (
            <motion.p
              variants={blurUpVariants}
              initial="hidden"
              animate="visible"
              custom={{ delay: 0.5, y: 10 }}
              className="text-base text-white"
            >
              {subheading}
            </motion.p>
          )}

          {ctaText && (
            <motion.div
              variants={blurUpVariants}
              initial="hidden"
              animate="visible"
              custom={0.8}
            >
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-white text-base text-pink-700 hover:bg-pink-100 hover:text-pink-800"
              >
                <a href={ctaHref}>{ctaText}</a>
              </Button>
            </motion.div>
          )}
        </div>

        <div className="absolute bottom-0 mx-auto w-full max-w-4xl px-4">
          {/* Left Image */}
          {leftImage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
              style={{ x: leftImageX, rotate: leftImageRotate }}
              className="absolute top-1/2 left-1/2 z-10 size-56 -translate-x-1/2 -translate-y-full md:size-80 [@media(max-height:48rem)]:left-0 [@media(max-height:48rem)]:translate-x-0"
            >
              <img
                src={leftImage}
                alt="Left Image"
                className="rounded-2xl object-cover"
              />
            </motion.div>
          )}

          {/* Right Image */}
          {rightImage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{ x: rightImageX, rotate: rightImageRotate }}
              className="absolute top-1/2 left-1/2 size-56 -translate-x-1/2 -translate-y-full md:size-80 [@media(max-height:48rem)]:right-0 [@media(max-height:48rem)]:left-auto [@media(max-height:48rem)]:translate-x-0"
            >
              <img
                src={rightImage}
                alt="Right Image"
                className="rounded-2xl object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
