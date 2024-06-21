"use client";

import type { User } from "@/utils/types";

import { toast } from "react-toastify";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormState } from "@/hooks/useFormState";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

import { updateProfileAction } from "./actions";

interface ProfileFormProps {
  readonly user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    (data) => updateProfileAction(data, user),
    () => {
      toast.success("Profile updated successfully!");
      router.refresh();
    },
  );

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Profile update failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          type="text"
          defaultValue={user.name || ""}
        />

        {errors?.name ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" type="email" defaultValue={user.email} />

        {errors?.email ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input
          name="avatarUrl"
          id="avatarUrl"
          type="url"
          defaultValue={user.avatarUrl || ""}
        />

        {errors?.avatarUrl ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.avatarUrl[0]}
          </p>
        ) : null}
      </div>

      <div className="mt-2">
        <Button type="submit">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}
