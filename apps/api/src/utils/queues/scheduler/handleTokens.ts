import { type RepeatOptions, Queue, QueueEvents, Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { genericErrorHandler } from "@/utils/error-handler";
import { logger } from "@/utils/logger";
import { connection } from "../configs";

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const MILLISECONDS_IN_TWO_HOURS = 1000 * 60 * 60 * 2;
export const HANDLE_TOKENS_NAME = "handle-tokens";

const repeat: RepeatOptions = {
  pattern: "0 0 * * *",
};

export const handleTokensQueue = new Queue(HANDLE_TOKENS_NAME, {
  connection,
});

export async function addHandleTokensJob() {
  await handleTokensQueue.add(HANDLE_TOKENS_NAME, {}, { repeat });
}

export const handleTokensWorker = new Worker(
  HANDLE_TOKENS_NAME,
  async () => {
    logger.info("Running handle tokens worker");
    const now = new Date();
    const tokens = await prisma.token.findMany();

    for (const token of tokens) {
      const diff = Number(now) - Number(token.createdAt);
      const removed = Math.floor(diff / MILLISECONDS_IN_A_DAY);
      if (removed) {
        await prisma.token.delete({ where: { id: token.id } });
      }
      if (!removed && Math.floor(diff / MILLISECONDS_IN_TWO_HOURS)) {
        await prisma.token.update({
          where: { id: token.id },
          data: { expired: true },
        });
      }
    }
  },
  { connection },
);

const queueEvents = new QueueEvents(HANDLE_TOKENS_NAME, {
  connection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  const msg = `Job ${jobId} on queue ${HANDLE_TOKENS_NAME} failed. Reason: ${failedReason}`;
  logger.warn(msg);
  const err = genericErrorHandler(new Error(msg), msg);
  logger.error(JSON.stringify(err));
});

queueEvents.on("completed", ({ jobId }) => {
  logger.success(`Job ${jobId} on queue ${HANDLE_TOKENS_NAME} completed.`);
});
