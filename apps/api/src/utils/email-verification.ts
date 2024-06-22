import { sendMail } from "@/lib/nodemailer";
import { env } from "@/env";

export async function emailVerification(code: string, email: string) {
  const verificationLink = new URL(env.BASE_URL);
  verificationLink.pathname = "/auth/verify-email";
  verificationLink.searchParams.set("code", code);

  // Send e-mail with email verification link
  await sendMail({
    to: email,
    subject: "Email verification",
    html: `<a href="${verificationLink}">Verify e-mail</a>`,
  });
}
