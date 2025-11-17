import { authClient } from "@/core/auth/auth-client";

import { AuthQueryResult } from "@/core/auth/queries";
import { useNavigate } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const UserConfirmationCard = ({ user }: { user: AuthQueryResult }) => {
  const navigate = useNavigate();
  if (!user)
    return (
      <Card className="w-full min-h-96 min-w-sm max-w-md">
        <CardContent className="flex flex-col items-center justify-center gap-8 text-sm">
          <Loader />
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Hi {user.name}!</CardTitle>
        <CardDescription>You're already logged in.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-8 text-sm">
        <div>
          <p className="text-muted-foreground"> Logged in with email:</p>
          <p>{user.email}</p>
        </div>
        <Button
          onClick={async () => {
            await authClient.signOut();
            navigate({ to: "/" });
          }}
        >
          Sign out
        </Button>
      </CardContent>
    </Card>
  );
};
