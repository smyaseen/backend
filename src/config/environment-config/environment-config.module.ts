import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './environment-schema.validation';
import { EnvironmentConfigService } from './environment-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: false,
      isGlobal: true,
      validate: (env) => validateEnv(env),
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
