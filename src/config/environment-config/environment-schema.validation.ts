import * as Joi from 'joi';
import { Logger } from '@nestjs/common';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
})
  .unknown()
  .required();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateEnv(envVar: Record<string, any>): Record<string, any> {
  const { error, value: validatedEnv } = envValidationSchema.validate(envVar, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join('\n');
    Logger.error(`Invalid environment variables: ${errorMessage}`);
    process.exit(1);
  }
  return validatedEnv;
}
