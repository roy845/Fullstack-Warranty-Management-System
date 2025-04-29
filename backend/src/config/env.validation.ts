import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidationError,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  MONGO_INITDB_ROOT_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  MONGO_INITDB_ROOT_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  MONGO_DB_NAME: string;

  @IsNotEmpty()
  @IsNumber()
  MONGO_PORT: number;

  @IsNotEmpty()
  @IsString()
  MONGO_HOST: string;

  @IsNotEmpty()
  @IsString()
  MONGO_URI: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  MINDEE_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  ADMIN_USER_PASSWORD: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig: EnvironmentVariables = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );

  const errors: ValidationError[] = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment variables:\n${errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('\n')}`,
    );
  }

  return validatedConfig;
}
