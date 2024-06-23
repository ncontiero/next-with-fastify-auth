import type { FastifyInstance } from "fastify";
import { genericErrorHandler } from "@/utils/error-handler";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  const err = genericErrorHandler(error, error.message);

  reply.status(err.status).send(err);
};
