import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { auth } from "@/http/middlewares/auth";
import { BadRequestError } from "@/http/routes/_errors/bad-request-error";
import { UnauthorizedError } from "@/http/routes/_errors/unauthorized-error";
import { prisma } from "@/lib/prisma";
import { sendEmailVerificationQueue } from "@/utils/queues";

export async function updateProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/",
      {
        schema: {
          body: z.object({
            name: z.string().optional(),
            email: z.string().email(),
            avatarUrl: z.string().url().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const newEmail = request.body.email;

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new UnauthorizedError("User not found.");
        }
        if (!user.verifiedEmail) {
          throw new UnauthorizedError("E-mail not verified.");
        }

        const userFromEmail = await prisma.user.findUnique({
          where: {
            email: newEmail,
            NOT: { id: userId },
          },
        });
        if (userFromEmail) {
          throw new BadRequestError("Email already in use.");
        }

        await prisma.user.update({
          data: {
            ...user,
            ...request.body,
            verifiedEmail: newEmail !== user.email ? false : user.verifiedEmail,
          },
          where: {
            id: userId,
          },
        });

        if (newEmail !== user.email) {
          await sendEmailVerificationQueue.add("email-verification", {
            user: {
              ...user,
              email: newEmail,
            },
          });
        }

        return reply.status(204).send();
      },
    );
}
