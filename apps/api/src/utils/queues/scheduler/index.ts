import {
  addHandleTokensJob,
  handleTokensQueue,
  handleTokensWorker,
} from "./handleTokens";

export async function scheduleJobs() {
  await addHandleTokensJob();
}

export { handleTokensQueue, handleTokensWorker };
