import { z } from "zod";
import { Link } from "@/components/ui/Link";
import { api } from "@/utils/api";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "Reset Password",
};

type ResetPasswordPageProps = {
  readonly searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  let tokenIsExpired = false;
  const code = (
    await z
      .string()
      .uuid()
      .refine(async (v) => {
        const { ok, errorMsg } = await api.post("verifyToken", {
          body: JSON.stringify({ token: v }),
          headers: { "Content-Type": "application/json" },
          throwError: false,
        });
        tokenIsExpired = errorMsg === "Token expired";
        return ok ? v : undefined;
      })
      .safeParseAsync((await searchParams).code)
  ).data;

  if (!code) {
    return (
      <div className="flex size-full flex-col items-center justify-center">
        <h1 className="text-xl font-bold">
          {tokenIsExpired ? "Expired" : "Invalid"} reset password link
        </h1>
        <p className="mt-2 text-sm font-medium text-foreground/60">
          Please request a new password reset link{" "}
          <Link href="/auth/forgot-password">here</Link>.
        </p>
        <p className="mt-2 text-sm font-medium text-foreground/60">
          Or, you can{" "}
          <Link className="w-fit" size="sm" href="/auth/sign-in">
            sign in instead
          </Link>
          .
        </p>
      </div>
    );
  }

  return <ResetPasswordForm code={code} />;
}
