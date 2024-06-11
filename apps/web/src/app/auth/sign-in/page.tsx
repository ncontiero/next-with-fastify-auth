import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";

export const metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <form className="flex flex-col space-y-4">
      <div className="flex flex-col justify-center items-center space-y-1 mb-4 text-center">
        <h2 className="text-lg font-bold">Sign In</h2>
        <p className="text-foreground/60 font-medium text-sm">
          Welcome back! Please sign in to continue
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
      <Button className="mt-2">Sign In</Button>
      <div className="mt-2 flex justify-center">
        <Link className="w-fit" size="sm" href="/auth/sign-up">
          Create new account
        </Link>
      </div>
    </form>
  );
}
