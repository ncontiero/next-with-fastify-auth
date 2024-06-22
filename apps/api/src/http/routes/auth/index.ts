import type { FastifyInstance } from "fastify";

import { signIn } from "./sign-in";
import { signUp } from "./sign-up";
import { profileRoutes } from "./profile";
import { passwordRoutes } from "./password";
import { verifyRoutes } from "./verify";

const AUTH_PREFIX = "/auth";

export async function authRoutes(app: FastifyInstance) {
  const opts = {
    prefix: AUTH_PREFIX,
  };

  app.register(signIn, opts);
  app.register(signUp, opts);
  app.register(profileRoutes, opts);
  app.register(passwordRoutes, opts);
  app.register(verifyRoutes, opts);
}
