import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";

import { env } from "@/env";
import { errorHandler } from "@/http/error-handler";
import { authRoutes } from "@/http/routes/auth";
import { logger } from "@/utils/logger";
import { scheduleJobs } from "@/utils/queues";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(fastifyCors);

app.register(authRoutes);

app.listen({ port: env.PORT, host: "0.0.0.0" }, async (err, address) => {
  if (err) throw err;
  await scheduleJobs();
  logger.info(`Server listening on ${address}`);
});
