import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <form className="flex flex-col space-y-4">
      <div className="flex flex-col justify-center items-center space-y-1 mb-4 text-center">
        <h2 className="text-lg font-bold">Forgot Password</h2>
        <p className="text-foreground/60 font-medium text-sm">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>
      <Button className="mt-2">Recover password</Button>
      <div className="mt-2 flex justify-center">
        <Link className="w-fit" size="sm" href="/auth/sign-in">
          Sign in instead
        </Link>
      </div>
    </form>
  );
}
