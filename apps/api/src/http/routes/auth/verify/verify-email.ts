import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { env } from "@/env";

export async function verifyEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/email",
    {
      schema: {
        querystring: z.object({
          code: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const redirectUrl = new URL(env.FRONTEND_BASE_URL);
      const { code } = request.query;

      const token = await prisma.token.findUnique({
        where: {
          id: code,
        },
        include: {
          user: true,
        },
      });

      if (!token) {
        redirectUrl.searchParams.set(
          "error_message",
          "Invalid verification code",
        );
        return reply.redirect(redirectUrl.toString());
      }

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: token.userId,
          },
          data: {
            verifiedEmail: true,
          },
        }),
        prisma.token.delete({
          where: {
            id: code,
          },
        }),
      ]);

      redirectUrl.searchParams.set(
        "success_message",
        "Email verified successfully",
      );
      return reply.redirect(redirectUrl.toString());
    },
  );
}
