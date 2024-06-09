import type { FastifyInstance } from "fastify";

import { requestPasswordRecover } from "./request-password-recover";
import { resetPassword } from "./reset-password";

const PASSWORD_PREFIX = "/password";

export async function passwordRoute(app: FastifyInstance) {
  const opts = {
    prefix: PASSWORD_PREFIX,
  };

  app.register(requestPasswordRecover, opts);
  app.register(resetPassword, opts);
}
