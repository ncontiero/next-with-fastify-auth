import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { UnauthorizedError } from "@/http/routes/_errors/unauthorized-error";
import { prisma } from "@/lib/prisma";
import { passwordRecoverQueue } from "@/utils/queues";

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/recover",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFromEmail) {
        // We don't want to people to know if the user really exists
        return reply.status(201).send();
      }
      if (!userFromEmail.verifiedEmail) {
        throw new UnauthorizedError("E-mail not verified.");
      }

      await passwordRecoverQueue.add("password-recover", {
        userId: userFromEmail.id,
        email,
      });

      return reply.status(201).send();
    },
  );
}
