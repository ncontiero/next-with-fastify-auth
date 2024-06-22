import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { auth } from "@/http/middlewares/auth";
import { BadRequestError } from "@/http/routes/_errors/bad-request-error";
import { prisma } from "@/lib/prisma";

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/",
      {
        schema: {
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string().email(),
              avatarUrl: z.string().url().nullable(),
              verifiedEmail: z.boolean(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            verifiedEmail: true,
          },
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new BadRequestError("User not found.");
        }

        return reply.status(200).send(user);
      },
    );
}
