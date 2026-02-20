import { useEffect } from "react";
import { MotionGlobalConfig } from "motion/react";

/**
 * Disables Framer Motion animations when in screenshot capture mode.
 * Called during screenshot processing to ensure all animations complete instantly.
 */
export function useDisableAnimationsForScreenshot() {
  useEffect(() => {
    if ((window as any).SCREENSHOT_MODE) {
      MotionGlobalConfig.skipAnimations = true;
    }
  }, []);
}
