"use server";

import { z } from "zod";
import { api } from "@/utils/api";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password should have at least 6 characters." }),
    password_confirmation: z.string(),
    code: z.string().uuid(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation does not match.",
    path: ["password_confirmation"],
  });

export async function resetPasswordAction(data: FormData, code: string) {
  const result = resetPasswordSchema.safeParse({
    code,
    ...Object.fromEntries(data),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  try {
    await api.post("resetPassword", {
      body: JSON.stringify({ password: result.data.password, code }),
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
    message: "Password changed successfully! You can now sign in.",
    errors: null,
  };
}
