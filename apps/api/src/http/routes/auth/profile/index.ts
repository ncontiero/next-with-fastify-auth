import type { FastifyInstance } from "fastify";

import { getProfile } from "./get-profile";
import { updateProfile } from "./update-profile";
import { deleteProfile } from "./delete-profile";

const PROFILE_PREFIX = "/profile";

export async function profileRoutes(app: FastifyInstance) {
  const opts = {
    prefix: PROFILE_PREFIX,
  };

  app.register(getProfile, opts);
  app.register(updateProfile, opts);
  app.register(deleteProfile, opts);
}
