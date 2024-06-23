import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { hash } from "bcryptjs";
import { z } from "zod";

import { BadRequestError } from "@/http/routes/_errors/bad-request-error";
import { prisma } from "@/lib/prisma";
import { emailVerificationQueue } from "@/utils/queues";

export async function signUp(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sign-up",
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userWithSameEmail) {
        throw new BadRequestError("User with same e-mail already exists.");
      }

      const passwordHash = await hash(password, 6);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      await emailVerificationQueue.add("email-verification", {
        userId: user.id,
        email: user.email,
      });

      const token = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: "7d" } },
      );

      return reply.status(201).send({ token });
    },
  );
}
