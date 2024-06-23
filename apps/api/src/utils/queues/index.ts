import {
  emailVerificationQueue,
  emailVerificationWorker,
} from "./email-verification";
import {
  passwordRecoverQueue,
  passwordRecoverWorker,
} from "./password-recover";

const gracefulShutdown = async (signal: string) => {
  console.warn(`Received ${signal}, closing server...`);
  await emailVerificationWorker.close();
  await passwordRecoverWorker.close();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export {
  emailVerificationQueue,
  emailVerificationWorker,
  passwordRecoverQueue,
  passwordRecoverWorker,
};
