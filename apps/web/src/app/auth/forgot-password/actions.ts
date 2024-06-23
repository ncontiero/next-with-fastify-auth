"use server";

import { z } from "zod";
import { api } from "@/utils/api";

const recoverPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Please, provide a valid e-mail address." }),
});

export async function recoverPasswordAction(data: FormData) {
  const result = recoverPasswordSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  try {
    await api.post("recoverPassword", {
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
    message: "Check your email for further instructions.",
    errors: null,
  };
}
