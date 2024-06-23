import { ZodError } from "zod";

import { BadRequestError } from "@/http/routes/_errors/bad-request-error";
import { UnauthorizedError } from "@/http/routes/_errors/unauthorized-error";
import { logger } from "./logger";

interface IGenericError {
  status: number;
  message: string;
  errors?: any;
}

export function genericErrorHandler(
  error: unknown,
  queueError?: string,
): IGenericError {
  if (error instanceof ZodError) {
    return {
      status: 400,
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    };
  }

  if (error instanceof BadRequestError) {
    return {
      status: 400,
      message: error.message,
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      status: 401,
      message: error.message,
    };
  }

  logger.error(error);

  // send error to some observability platform

  return {
    status: 500,
    message: "Internal server error",
    errors: queueError,
  };
}
