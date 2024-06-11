import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <form className="flex flex-col space-y-4">
      <div className="flex flex-col justify-center items-center space-y-1 mb-4 text-center">
        <h2 className="text-lg font-bold">Create your account</h2>
        <p className="text-foreground/60 font-medium text-sm">
          Welcome! Please fill in the details to get started.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input name="name" type="text" id="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
        />
      </div>
      <Button className="mt-2">Create account</Button>
      <div className="mt-2 flex justify-center">
        <Link className="w-fit" size="sm" href="/auth/sign-in">
          Already registered? Sign In
        </Link>
      </div>
    </form>
  );
}
