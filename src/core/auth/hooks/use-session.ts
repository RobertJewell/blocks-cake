import { useQuery } from "@tanstack/react-query";
import { authClient } from "../auth-client";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
