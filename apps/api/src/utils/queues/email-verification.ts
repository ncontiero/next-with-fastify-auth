import { type Job, Queue, QueueEvents, Worker } from "bullmq";

import { prisma } from "@/lib/prisma";
import { logger } from "../logger";
import { emailVerification } from "../email-verification";
import { genericErrorHandler } from "../error-handler";
import { defaultQueueOpts, defaultWorkerOpts } from "./configs";

export const EMAIL_VERIFICATION_NAME = "password-recover";

export const emailVerificationQueue = new Queue(
  EMAIL_VERIFICATION_NAME,
  defaultQueueOpts,
);

type EmailVerificationJobProps = Job<
  { userId: string; email: string },
  any,
  string
>;
export const emailVerificationWorker = new Worker(
  EMAIL_VERIFICATION_NAME,
  async ({ data: { userId, email } }: EmailVerificationJobProps) => {
    await prisma.$transaction(async (tx) => {
      const token = await tx.token.create({
        data: {
          userId,
          type: "EMAIL_CONFIRMATION",
        },
      });
      await emailVerification(token.id, email);
    });
  },
  defaultWorkerOpts,
);

const queueEvents = new QueueEvents(EMAIL_VERIFICATION_NAME, {
  connection: defaultQueueOpts.connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.warn(`Failed job ${jobId}: ${failedReason}`);
  const err = genericErrorHandler(new Error(failedReason), failedReason);
  logger.error(JSON.stringify(err));
});
