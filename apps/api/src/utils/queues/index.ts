import {
  sendEmailVerificationQueue,
  sendEmailVerificationWorker,
} from "./send-email-verification";
import {
  sendPasswordRecoverYEmailWorker,
  sendPasswordRecoveryEmailQueue,
} from "./send-password-recovery-email";
import {
  sendWelcomeEmailQueue,
  sendWelcomeEmailWorker,
} from "./send-welcome-email";

const gracefulShutdown = async (signal: string) => {
  console.warn(`Received ${signal}, closing server...`);
  await sendEmailVerificationWorker.close();
  await sendPasswordRecoverYEmailWorker.close();
  await sendWelcomeEmailWorker.close();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export {
  sendEmailVerificationQueue,
  sendEmailVerificationWorker,
  sendPasswordRecoveryEmailQueue,
  sendPasswordRecoverYEmailWorker,
  sendWelcomeEmailQueue,
  sendWelcomeEmailWorker,
};
