import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/core/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SignUpEmailResult = Awaited<ReturnType<typeof authClient.signUp.email>>;

type RegisterMutation = UseMutationResult<
  SignUpEmailResult,
  Error,
  RegisterValues
>;

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  ssr: false,
});

const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterValues = z.infer<typeof RegisterSchema>;

function RegisterPage() {
  const registerMutation = useMutation<
    SignUpEmailResult,
    Error,
    RegisterValues
  >({
    mutationFn: async ({ email, password, name }: RegisterValues) => {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (res.error) {
        throw new Error(res.error.message ?? "Registration failed");
      }

      return res;
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onSubmit(values: RegisterValues) {
    registerMutation.mutate(values);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <RegisterForm
        form={form}
        registerMutation={registerMutation}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function RegisterForm({
  form,
  registerMutation,
  onSubmit,
}: {
  form: ReturnType<typeof useForm<RegisterValues>>;
  registerMutation: RegisterMutation;
  onSubmit: (values: RegisterValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Fill out the form to register a new admin account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input type="text" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </Field>

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
            </Field>

            {registerMutation.error && (
              <p className="text-sm text-red-500">
                {(registerMutation.error as Error).message}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            <FieldDescription className="text-center">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
