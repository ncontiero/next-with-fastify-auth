import { type Job, Queue, QueueEvents, Worker } from "bullmq";

import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/nodemailer";
import { logger } from "../logger";
import { genericErrorHandler } from "../error-handler";
import { defaultQueueOpts, defaultWorkerOpts } from "./configs";

export const PASSWORD_RECOVER_NAME = "password-recover";

export const passwordRecoverQueue = new Queue(
  PASSWORD_RECOVER_NAME,
  defaultQueueOpts,
);

type PasswordRecoverJobProps = Job<
  { userId: string; email: string },
  any,
  string
>;
export const passwordRecoverWorker = new Worker(
  PASSWORD_RECOVER_NAME,
  async ({ data: { userId, email } }: PasswordRecoverJobProps) => {
    await prisma.$transaction(async (tx) => {
      const { id: code, type: tokenType } = await tx.token.create({
        data: {
          userId,
          type: "PASSWORD_RECOVER",
        },
      });

      const resetPasswordLink = new URL(env.FRONTEND_TOKEN_CALLBACK_URL);
      resetPasswordLink.searchParams.set("code", code);
      resetPasswordLink.searchParams.set("token_type", tokenType);

      // Send e-mail with password recover link
      await sendMail({
        to: email,
        subject: "Password recover",
        html: `<a href="${resetPasswordLink}">Reset password</a>`,
      });
    });
  },
  defaultWorkerOpts,
);

const queueEvents = new QueueEvents(PASSWORD_RECOVER_NAME, {
  connection: defaultQueueOpts.connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.warn(`Failed job ${jobId}: ${failedReason}`);
  const err = genericErrorHandler(new Error(failedReason), failedReason);
  logger.error(JSON.stringify(err));
});
