import type { User } from "@prisma/client";
import { type Job, Queue, QueueEvents, Worker } from "bullmq";

import { prisma } from "@/lib/prisma";
import { logger } from "../logger";
import { genericErrorHandler } from "../error-handler";
import { sendPasswordRecoveryEmail } from "../emails";
import { defaultQueueOpts, defaultWorkerOpts } from "./configs";

export const PASSWORD_RECOVER_NAME = "password-recover";

export const passwordRecoverQueue = new Queue(
  PASSWORD_RECOVER_NAME,
  defaultQueueOpts,
);

type PasswordRecoverJobProps = Job<{ user: User }, any, string>;
export const passwordRecoverWorker = new Worker(
  PASSWORD_RECOVER_NAME,
  async ({ data: { user } }: PasswordRecoverJobProps) => {
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

const queueEvents = new QueueEvents(PASSWORD_RECOVER_NAME, {
  connection: defaultQueueOpts.connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.warn(`Failed job ${jobId}: ${failedReason}`);
  const err = genericErrorHandler(new Error(failedReason), failedReason);
  logger.error(JSON.stringify(err));
});
