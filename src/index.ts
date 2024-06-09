import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { env } from "@/env";
import { errorHandler } from "@/http/error-handler";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyCors);

app.get("/", () => {
  return { hello: "world" };
});

// eslint-disable-next-line promise/catch-or-return, unicorn/prefer-top-level-await
app.listen({ port: env.PORT }).then(() => {
  // eslint-disable-next-line no-console
  console.log(`HTTP server running on ${env.PORT}!`);
});
