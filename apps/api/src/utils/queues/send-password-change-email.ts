import type { User } from "@prisma/client";
import { type Job, Queue, QueueEvents, Worker } from "bullmq";

import { logger } from "../logger";
import { genericErrorHandler } from "../error-handler";
import { sendPasswordChangeEmail } from "../emails";
import { defaultQueueOpts, defaultWorkerOpts } from "./configs";

export const SEND_PASSWORD_CHANGE_EMAIL_NAME = "send-password-change-email";

export const sendPasswordChangeEmailQueue = new Queue(
  SEND_PASSWORD_CHANGE_EMAIL_NAME,
  defaultQueueOpts,
);

type SendPasswordChangeEmailJobProps = Job<{ user: User }, any, string>;
export const sendPasswordChangeEmailWorker = new Worker(
  SEND_PASSWORD_CHANGE_EMAIL_NAME,
  async ({ data: { user } }: SendPasswordChangeEmailJobProps) => {
    await sendPasswordChangeEmail(user);
  },
  defaultWorkerOpts,
);

const queueEvents = new QueueEvents(SEND_PASSWORD_CHANGE_EMAIL_NAME, {
  connection: defaultQueueOpts.connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  const msg = `Job ${jobId} on queue ${SEND_PASSWORD_CHANGE_EMAIL_NAME} failed. Reason: ${failedReason}`;
  logger.warn(msg);
  const err = genericErrorHandler(new Error(msg), msg);
  logger.error(JSON.stringify(err));
});
