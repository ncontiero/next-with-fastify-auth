import type { FastifyInstance } from "fastify";

import { verifyToken } from "./verify-token";
import { verifyEmail } from "./verify-email";

const VERIFY_PREFIX = "/verify";

export async function verifyRoutes(app: FastifyInstance) {
  const opts = {
    prefix: VERIFY_PREFIX,
  };

  app.register(verifyToken, opts);
  app.register(verifyEmail, opts);
}
