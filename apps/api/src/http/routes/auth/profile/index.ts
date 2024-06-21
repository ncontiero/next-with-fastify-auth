import type { FastifyInstance } from "fastify";
import { getProfile } from "./get-profile";
import { updateProfile } from "./update-profile";

const PASSWORD_PREFIX = "/profile";

export async function profileRoutes(app: FastifyInstance) {
  const opts = {
    prefix: PASSWORD_PREFIX,
  };

  app.register(getProfile, opts);
  app.register(updateProfile, opts);
}
