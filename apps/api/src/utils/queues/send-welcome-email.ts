import type { User } from "@prisma/client";
import { type Job, Queue, QueueEvents, Worker } from "bullmq";

import { prisma } from "@/lib/prisma";
import { logger } from "../logger";
import { sendWelcomeEmail } from "../emails";
import { genericErrorHandler } from "../error-handler";
import { defaultQueueOpts, defaultWorkerOpts } from "./configs";

export const SEND_WELCOME_EMAIL_NAME = "send-welcome-email";

export const sendWelcomeEmailQueue = new Queue(
  SEND_WELCOME_EMAIL_NAME,
  defaultQueueOpts,
);

type SendWelcomeEmailJobProps = Job<{ user: User }, any, string>;
export const sendWelcomeEmailWorker = new Worker(
  SEND_WELCOME_EMAIL_NAME,
  async ({ data: { user } }: SendWelcomeEmailJobProps) => {
    await prisma.$transaction(async (tx) => {
      const token = await tx.token.create({
        data: {
          userId: user.id,
          type: "EMAIL_CONFIRMATION",
        },
      });
      await sendWelcomeEmail(token.id, user);
    });
  },
  defaultWorkerOpts,
);

const queueEvents = new QueueEvents(SEND_WELCOME_EMAIL_NAME, {
  connection: defaultQueueOpts.connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.warn(`Failed job ${jobId}: ${failedReason}`);
  const err = genericErrorHandler(new Error(failedReason), failedReason);
  logger.error(JSON.stringify(err));
});
