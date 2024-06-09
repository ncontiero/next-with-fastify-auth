import type { FastifyInstance } from "fastify";

import { signIn } from "./sign-in";
import { signUp } from "./sign-up";
import { getProfile } from "./get-profile";
import { passwordRoute } from "./password";

const AUTH_PREFIX = "/auth";

export async function authRoute(app: FastifyInstance) {
  const opts = {
    prefix: AUTH_PREFIX,
  };

  app.register(signIn, opts);
  app.register(signUp, opts);
  app.register(getProfile, opts);
  app.register(passwordRoute, opts);
}
