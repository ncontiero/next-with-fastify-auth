import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { compare } from "bcryptjs";
import { z } from "zod";

import { auth } from "@/http/middlewares/auth";
import { UnauthorizedError } from "@/http/routes/_errors/unauthorized-error";
import { BadRequestError } from "@/http/routes/_errors/bad-request-error";
import { updatePassword as updatePasswordUtil } from "@/utils/update-password";
import { prisma } from "@/lib/prisma";

export async function updatePassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/",
      {
        schema: {
          body: z.object({
            current_password: z.string(),
            new_password: z.string().min(6),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { current_password, new_password } = request.body;

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          throw new UnauthorizedError("User not found");
        }
        if (!user.verifiedEmail) {
          throw new UnauthorizedError("E-mail not verified");
        }

        const isPasswordValid = await compare(
          current_password,
          user.passwordHash,
        );
        if (!isPasswordValid) {
          throw new BadRequestError("Current password is incorrect");
        }

        await updatePasswordUtil(new_password, user);

        return reply.status(204).send();
      },
    );
}
