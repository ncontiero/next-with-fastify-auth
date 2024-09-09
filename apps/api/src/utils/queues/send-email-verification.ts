import type { User } from "@prisma/client";
import { type Job, Queue, QueueEvents, Worker } from "bullmq";

import { prisma } from "@/lib/prisma";
import { sendEmailVerification } from "../emails";
import { genericErrorHandler } from "../error-handler";
import { logger } from "../logger";
import { defaultQueueOpts, defaultWorkerOpts } from "./configs";

export const SEND_EMAIL_VERIFICATION_NAME = "email-verification";

export const sendEmailVerificationQueue = new Queue(
  SEND_EMAIL_VERIFICATION_NAME,
  defaultQueueOpts,
);

type SendEmailVerificationJobProps = Job<{ user: User }, any, string>;
export const sendEmailVerificationWorker = new Worker(
  SEND_EMAIL_VERIFICATION_NAME,
  async ({ data: { user } }: SendEmailVerificationJobProps) => {
    await prisma.$transaction(async (tx) => {
      const token = await tx.token.create({
        data: {
          userId: user.id,
          type: "EMAIL_CONFIRMATION",
        },
      });
      await sendEmailVerification(token.id, user);
    });
  },
  defaultWorkerOpts,
);

const queueEvents = new QueueEvents(SEND_EMAIL_VERIFICATION_NAME, {
  connection: defaultQueueOpts.connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  const msg = `Job ${jobId} on queue ${SEND_EMAIL_VERIFICATION_NAME} failed. Reason: ${failedReason}`;
  logger.warn(msg);
  const err = genericErrorHandler(new Error(msg), msg);
  logger.error(JSON.stringify(err));
});
