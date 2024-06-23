import type {
  ConnectionOptions,
  DefaultJobOptions,
  QueueOptions,
  WorkerOptions,
} from "bullmq";

import { env } from "@/env";

export const connection: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USER,
  password: env.REDIS_PASSWORD,
};

export const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};

export const defaultQueueOpts: QueueOptions = {
  connection,
  defaultJobOptions,
};
export const defaultWorkerOpts: WorkerOptions = {
  connection,
  concurrency: 10,
};
