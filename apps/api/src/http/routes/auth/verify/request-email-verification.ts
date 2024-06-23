import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { UnauthorizedError } from "@/http/routes/_errors/unauthorized-error";
import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { sendEmailVerificationQueue } from "@/utils/queues";

export async function requestEmailVerification(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/email",
      {
        schema: {
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new UnauthorizedError("User not found");
        } else if (user.verifiedEmail) {
          throw new UnauthorizedError("Email already verified");
        }

        await sendEmailVerificationQueue.add("email-verification", {
          user,
        });

        return reply.status(204).send();
      },
    );
}
