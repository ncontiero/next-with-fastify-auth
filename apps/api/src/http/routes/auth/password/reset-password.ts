import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { hash } from "bcryptjs";
import { z } from "zod";

import { UnauthorizedError } from "@/http/routes/_errors/unauthorized-error";
import { prisma } from "@/lib/prisma";
import { updatePassword } from "@/utils/update-password";

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/reset",
    {
      schema: {
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body;

      const tokenFromCode = await prisma.token.findUnique({
        where: { id: code },
        include: {
          user: true,
        },
      });

      if (!tokenFromCode) {
        throw new UnauthorizedError();
      }
      if (!tokenFromCode.user.verifiedEmail) {
        throw new UnauthorizedError("E-mail not verified.");
      }

      await prisma.$transaction(async (tx) => {
        await updatePassword(password, tokenFromCode.user, tx);
        await tx.token.delete({
          where: {
            id: code,
          },
        });
      });

      return reply.status(204).send();
    },
  );
}
