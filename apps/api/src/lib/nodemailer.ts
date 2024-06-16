import { type SendMailOptions, createTransport } from "nodemailer";
import { env } from "@/env";

export const transporter = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendMail = (mailOptions: SendMailOptions) => {
  return transporter.sendMail({
    from: env.DEFAULT_FROM_EMAIL,
    ...mailOptions,
  });
};
