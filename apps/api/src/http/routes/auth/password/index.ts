import type { FastifyInstance } from "fastify";

import { requestPasswordRecover } from "./request-password-recover";
import { resetPassword } from "./reset-password";
import { updatePassword } from "./update-password";

const PASSWORD_PREFIX = "/password";

export async function passwordRoutes(app: FastifyInstance) {
  const opts = {
    prefix: PASSWORD_PREFIX,
  };

  app.register(requestPasswordRecover, opts);
  app.register(resetPassword, opts);
  app.register(updatePassword, opts);
}
