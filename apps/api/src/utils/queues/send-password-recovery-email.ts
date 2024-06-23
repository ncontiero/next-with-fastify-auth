import type { User } from "@prisma/client";
import { type Job, Queue, QueueEvents, Worker } from "bullmq";

import { prisma } from "@/lib/prisma";
import { logger } from "../logger";
import { genericErrorHandler } from "../error-handler";
import { sendPasswordRecoveryEmail } from "../emails";
import { defaultQueueOpts, defaultWorkerOpts } from "./configs";

export const SEND_PASSWORD_RECOVERY_NAME = "password-recover";

export const sendPasswordRecoveryEmailQueue = new Queue(
  SEND_PASSWORD_RECOVERY_NAME,
  defaultQueueOpts,
);

type SendPasswordRecoveryEmailJobProps = Job<{ user: User }, any, string>;
export const sendPasswordRecoverYEmailWorker = new Worker(
  SEND_PASSWORD_RECOVERY_NAME,
  async ({ data: { user } }: SendPasswordRecoveryEmailJobProps) => {
    await prisma.$transaction(async (tx) => {
      const token = await tx.token.create({
        data: {
          userId: user.id,
          type: "PASSWORD_RECOVER",
        },
      });
      await sendPasswordRecoveryEmail(token, user);
    });
  },
  defaultWorkerOpts,
);

const queueEvents = new QueueEvents(SEND_PASSWORD_RECOVERY_NAME, {
  connection: defaultQueueOpts.connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.warn(`Failed job ${jobId}: ${failedReason}`);
  const err = genericErrorHandler(new Error(failedReason), failedReason);
  logger.error(JSON.stringify(err));
});
