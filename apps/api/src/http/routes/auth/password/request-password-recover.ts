import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { env } from "@/env";

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

      const { id: code, type: tokenType } = await prisma.token.create({
        data: {
          type: "PASSWORD_RECOVER",
          userId: userFromEmail.id,
        },
      });

      // Send e-mail with password recover link
      const url = new URL(env.FRONTEND_TOKEN_CALLBACK_URL);
      url.searchParams.set("code", code);
      url.searchParams.set("token_type", tokenType);
      console.log("Password reset url:", url);

      // eslint-disable-next-line no-console
      console.log("Password recover token:", code);

      return reply.status(201).send();
    },
  );
}
