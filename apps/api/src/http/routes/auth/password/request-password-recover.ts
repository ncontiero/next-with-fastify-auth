import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

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

      const { id: code } = await prisma.token.create({
        data: {
          type: "PASSWORD_RECOVER",
          userId: userFromEmail.id,
        },
      });

      // Send e-mail with password recover link

      // eslint-disable-next-line no-console
      console.log("Password recover token:", code);

      return reply.status(201).send();
    },
  );
}
