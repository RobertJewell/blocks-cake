import { LoginForm } from "@/cms/editor/dashboard/auth/login-form";
import { UserConfirmationCard } from "@/cms/editor/dashboard/auth/user-confirmation-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/login")({
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const { user } = Route.useRouteContext();

  if (user) {
    return (
      <div className="flex bg-background min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <UserConfirmationCard user={user} />
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
