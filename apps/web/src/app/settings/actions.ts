"use server";

import type { User } from "@/utils/types";
import { z } from "zod";
import { api } from "@/utils/api";

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .email({ message: "Please, provide a valid e-mail address." }),
  avatarUrl: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (v) => v === undefined || z.string().url().safeParse(v).success,
      "Please, provide a valid URL.",
    )
    .optional(),
});

const updatePasswordSchema = z.object({
  current_password: z.string(),
  new_password: z
    .string()
    .min(6, { message: "Password should have at least 6 characters." }),
});

export async function updateProfileAction(data: FormData, user: User) {
  const result = updateProfileSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const isSameEmail = result.data.email === user.email;
  if (
    isSameEmail &&
    result.data.name === user.name &&
    result.data.avatarUrl === (user.avatarUrl ?? undefined)
  ) {
    return { success: true, message: "Nothing to update.", errors: null };
  }

  try {
    await api.patch("updateProfile", {
      body: JSON.stringify(result.data),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message, errors: null };
    }

    console.error(error);

    return {
      success: false,
      message: "Unexpected error, try again in a few minutes.",
      errors: null,
    };
  }

  return {
    success: true,
    message: `Profile updated successfully.${isSameEmail ? "" : " Verify your new email address."}`,
    errors: null,
  };
}

export async function updatePasswordAction(data: FormData) {
  const result = updatePasswordSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  try {
    await api.patch("updatePassword", {
      body: JSON.stringify(result.data),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message, errors: null };
    }

    console.error(error);

    return {
      success: false,
      message: "Unexpected error, try again in a few minutes.",
      errors: null,
    };
  }

  return {
    success: true,
    message: "Password updated successfully!",
    errors: null,
  };
}
