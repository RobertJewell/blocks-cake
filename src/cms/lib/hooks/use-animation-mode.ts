import { useEffect, useRef } from "react";
import { AnimationMode } from "../../blocks/shared/animations";

export function useAnimationMode(selectedId?: string | null) {
  const prevIdRef = useRef<string | null>(null);

  let mode: AnimationMode = "fade";

  const isEditMode = !!selectedId;
  const wasEditMode = !!prevIdRef.current;

  if (isEditMode && !wasEditMode) {
    mode = "push";
  } else if (!isEditMode && wasEditMode) {
    mode = "pop";
  } else if (isEditMode && wasEditMode && selectedId !== prevIdRef.current) {
    mode = "fade";
  }

  // Update history for next render
  useEffect(() => {
    prevIdRef.current = selectedId ?? null;
  }, [selectedId]);

  return mode;
}
