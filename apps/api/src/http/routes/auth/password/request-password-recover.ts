import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/nodemailer";

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

      await prisma.$transaction(async (tx) => {
        const { id: code, type: tokenType } = await tx.token.create({
          data: {
            type: "PASSWORD_RECOVER",
            userId: userFromEmail.id,
          },
        });

        const resetPasswordLink = new URL(env.FRONTEND_TOKEN_CALLBACK_URL);
        resetPasswordLink.searchParams.set("code", code);
        resetPasswordLink.searchParams.set("token_type", tokenType);

        // Send e-mail with password recover link
        await sendMail({
          to: userFromEmail.email,
          subject: "Password recover",
          html: `<a href="${resetPasswordLink}">Reset password</a>`,
        });
      });

      return reply.status(201).send();
    },
  );
}
