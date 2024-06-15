"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";
import { useFormState } from "@/hooks/useFormState";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

import { resetPasswordAction } from "./actions";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = z.string().uuid().safeParse(searchParams.get("code")).data;
  useEffect(() => {
    if (!code) {
      toast.error("Invalid reset password link.");
      router.push("/auth/sign-in");
    }
  }, [code, router]);

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    (data) => resetPasswordAction(data, code),
    () => {
      router.push("/auth/sign-in");
      toast.success("Password changed successfully! You can now sign in.");
    },
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Password reset failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-4 flex flex-col items-center justify-center space-y-1 text-center">
        <h2 className="text-lg font-bold">Reset Password</h2>
        <p className="text-sm font-medium text-foreground/60">
          Please enter your new password.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input name="password" type="password" id="password" />

        {errors?.password ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirm your new password</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
        />

        {errors?.password_confirmation ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password_confirmation[0]}
          </p>
        ) : null}
      </div>

      <Button className="mt-2">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Reset password"
        )}
      </Button>

      <div className="mt-2 flex justify-center">
        <Link className="w-fit" size="sm" href="/auth/sign-in">
          Sign in instead
        </Link>
      </div>
    </form>
  );
}
