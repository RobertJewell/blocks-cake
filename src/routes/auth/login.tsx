import { LoginForm } from "@/components/auth/login-form";
import { UserConfirmationCard } from "@/components/auth/user-confirmation-card";
import { authClient } from "@/core/auth/auth-client";
import { authRequestMiddleware } from "@/core/middleware/auth/auth-request-middleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  ssr: true,
  server: { middleware: [authRequestMiddleware] },
  loader: async ({ serverContext }) => {
    if (!serverContext) return { session: null };
    const { auth, request } = serverContext;
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return { session };
  },
  component: LoginPage,
});

function LoginPage() {
  const { session: ssrSession } = Route.useLoaderData();
  const { data: clientSession, isPending } = authClient.useSession();

  // use server info if possible
  if (ssrSession) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <UserConfirmationCard session={ssrSession} />
      </div>
    );
  }

  if (isPending) {
    return null;
  }

  if (clientSession) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <UserConfirmationCard session={clientSession} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
