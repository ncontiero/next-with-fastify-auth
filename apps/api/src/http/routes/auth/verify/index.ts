import type { FastifyInstance } from "fastify";

import { requestEmailVerification } from "./request-email-verification";
import { verifyEmail } from "./verify-email";
import { verifyToken } from "./verify-token";

const VERIFY_PREFIX = "/verify";

export async function verifyRoutes(app: FastifyInstance) {
  const opts = {
    prefix: VERIFY_PREFIX,
  };

  app.register(verifyToken, opts);
  app.register(verifyEmail, opts);
  app.register(requestEmailVerification, opts);
}
