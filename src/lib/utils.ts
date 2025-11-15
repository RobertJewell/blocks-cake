import { createAuthInstance } from "@/core/middleware/auth/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AuthInstance = ReturnType<typeof createAuthInstance>;

export type AuthSession = Awaited<
  ReturnType<AuthInstance["api"]["getSession"]>
>;
