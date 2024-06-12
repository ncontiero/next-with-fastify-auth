import type { User } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import { ProfileButton } from "./ProfileButton";

export async function Header() {
  const { data: user } = await fetcher<User>("auth/profile", {
    throwError: false,
  });

  return (
    <header className="fixed inset-x-0 z-[999] h-[72px] border-b bg-secondary/60 backdrop-blur-md">
      <nav className="m-auto flex size-full max-w-[1600px] items-center justify-between gap-2 px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full ring-ring duration-200 hover:brightness-150 focus:outline-none focus:ring-2"
          >
            <Image
              src="/icon"
              alt="icon"
              width={42}
              height={42}
              className="rounded-full"
            />
          </Link>
        </div>

        {user ? (
          <ProfileButton user={user} />
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="rounded-md p-2 font-bold ring-ring duration-200 hover:text-foreground/60 focus:outline-none focus:ring-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-md p-2 font-bold ring-ring duration-200 hover:text-foreground/60 focus:outline-none focus:ring-2"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
