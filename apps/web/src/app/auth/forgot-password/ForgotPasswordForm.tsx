"use client";

import { toast } from "react-toastify";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";
import { useFormState } from "@/hooks/useFormState";

import { recoverPasswordAction } from "./actions";

export function ForgotPasswordForm() {
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    recoverPasswordAction,
    (message) => {
      toast.success(message);
    },
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Password recovery failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-4 flex flex-col items-center justify-center space-y-1 text-center">
        <h2 className="text-lg font-bold">Forgot Password</h2>
        <p className="text-sm font-medium text-foreground/60">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />

        {errors?.email ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        ) : null}
      </div>

      <Button className="mt-2" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Recover password"
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
