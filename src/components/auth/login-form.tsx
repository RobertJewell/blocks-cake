import { authClient } from "@/core/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type SignInEmailResult = Awaited<ReturnType<typeof authClient.signIn.email>>;
type LoginValues = z.infer<typeof LoginSchema>;

const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const LoginForm = () => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation<SignInEmailResult, Error, LoginValues>({
    mutationFn: async ({ email, password }) => {
      const res = await authClient.signIn.email({ email, password });
      if (res.error)
        throw new Error(res.error.message ?? "Invalid credentials");
      return res;
    },
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  function onSubmit(values: LoginValues) {
    loginMutation.mutate(values);
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              {loginMutation.error && (
                <p className="text-sm text-red-500">
                  {(loginMutation.error as Error).message}
                </p>
              )}
            </Field>

            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <Button variant="outline" type="button">
                Login with Google
              </Button>
            </div>

            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/register"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
