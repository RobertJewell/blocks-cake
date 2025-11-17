import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SLUG_SEGMENT_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlugPath(path: string): boolean {
  if (!path) return false;

  // No file-like segments
  if (path.includes(".")) return false;

  const segments = path.split("/");

  return segments.every((seg) => SLUG_SEGMENT_REGEX.test(seg));
}
