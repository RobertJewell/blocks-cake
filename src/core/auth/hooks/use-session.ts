import { useQuery } from "@tanstack/react-query";
import { authClient } from "../auth-client";
import { createAuthInstance } from "@/core/middleware/auth/auth";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export type AuthInstance = ReturnType<typeof createAuthInstance>;

export type AuthSession = Awaited<
  ReturnType<AuthInstance["api"]["getSession"]>
>;
