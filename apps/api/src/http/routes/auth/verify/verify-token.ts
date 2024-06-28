import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { BadRequestError } from "@/http/routes/_errors/bad-request-error";
import { prisma } from "@/lib/prisma";

export async function verifyToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/token",
    {
      schema: {
        body: z.object({
          token: z.string().uuid(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { token } = request.body;

      const tokenExists = await prisma.token.findUnique({
        where: {
          id: token,
        },
      });

      if (!tokenExists) {
        throw new BadRequestError("Invalid token");
      } else if (tokenExists.expired) {
        throw new BadRequestError("Token expired");
      }

      return reply.status(204).send();
    },
  );
}
