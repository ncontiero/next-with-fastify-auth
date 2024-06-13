import type { User as UserProps } from "@/utils/types";
import { ChevronDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

interface ProfileButtonProps {
  readonly user: UserProps;
}

function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return initials;
}

export function ProfileButton({ user }: ProfileButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-md border border-transparent p-1 outline-none ring-ring ring-offset-2 ring-offset-black duration-200 hover:border-foreground/20 hover:bg-black focus:ring-2">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <Avatar className="size-8">
          {user.avatarUrl ? <AvatarImage src={user.avatarUrl} /> : null}
          {user.name ? (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          ) : null}
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="p-2">
          <a href="/profile">
            <User className="mr-2 size-4" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="p-2">
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" />
            Sign Out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
