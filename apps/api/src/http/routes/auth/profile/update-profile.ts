import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { auth } from "@/http/middlewares/auth";
import { BadRequestError } from "@/http/routes/_errors/bad-request-error";
import { UnauthorizedError } from "@/http/routes/_errors/unauthorized-error";
import { prisma } from "@/lib/prisma";

export async function updateProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/",
      {
        schema: {
          body: z.object({
            name: z.string().nullable(),
            email: z.string().email(),
            avatarUrl: z.string().url().nullable(),
          }),
          response: {
            204: z.object({}).nullable(),
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
          },
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new UnauthorizedError("User not found.");
        }

        const userFromEmail = await prisma.user.findUnique({
          where: {
            email: request.body.email,
            NOT: { id: userId },
          },
        });
        if (userFromEmail) {
          throw new BadRequestError("Email already in use.");
        }

        await prisma.user.update({
          data: {
            ...request.body,
          },
          where: {
            id: userId,
          },
        });

        return reply.status(204).send(null);
      },
    );
}
