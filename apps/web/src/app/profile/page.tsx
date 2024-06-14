import type { Metadata } from "next";
import type { User } from "@/utils/types";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import { api } from "@/utils/api";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  if (!isAuthenticated()) {
    redirect("/auth/sign-in");
  }
  const { data: user } = await api.get<User>("profile");
  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 flex flex-col justify-center px-4">
      <div className="flex flex-col p-6 border rounded-md">
        <h1 className="text-4xl font-bold">Profile</h1>
        {user.name ? (
          <p className="mt-4 text-xl flex items-center gap-2">
            <Label htmlFor="name">Name: </Label>
            <Input id="name" type="text" value={user.name} />
          </p>
        ) : null}
        <p className="mt-4 text-xl flex items-center gap-2">
          <Label htmlFor="email">Email: </Label>
          <Input id="email" type="email" value={user.email} />
        </p>
        <Button asChild className="flex mt-4 w-fit">
          <Link
            href="/account/update-password"
            className="text-foreground hover:no-underline"
          >
            Update Password
          </Link>
        </Button>
      </div>
    </div>
  );
}
