import {
  handleTokensQueue,
  handleTokensWorker,
  scheduleJobs,
} from "./scheduler";
import {
  sendEmailVerificationQueue,
  sendEmailVerificationWorker,
} from "./send-email-verification";
import {
  sendPasswordChangeEmailQueue,
  sendPasswordChangeEmailWorker,
} from "./send-password-change-email";
import {
  sendPasswordRecoveryEmailQueue,
  sendPasswordRecoveryEmailWorker,
} from "./send-password-recovery-email";
import {
  sendWelcomeEmailQueue,
  sendWelcomeEmailWorker,
} from "./send-welcome-email";

const gracefulShutdown = async (signal: string) => {
  console.warn(`Received ${signal}, closing server...`);
  await sendEmailVerificationWorker.close();
  await sendPasswordRecoveryEmailWorker.close();
  await sendWelcomeEmailWorker.close();
  await sendPasswordChangeEmailWorker.close();
  await handleTokensWorker.close();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export {
  handleTokensQueue,
  handleTokensWorker,
  scheduleJobs,
  sendEmailVerificationQueue,
  sendEmailVerificationWorker,
  sendPasswordChangeEmailQueue,
  sendPasswordChangeEmailWorker,
  sendPasswordRecoveryEmailQueue,
  sendPasswordRecoveryEmailWorker,
  sendWelcomeEmailQueue,
  sendWelcomeEmailWorker,
};
