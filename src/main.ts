import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'interceptors/response.interceptor';
import { RequestInterceptor } from 'interceptors/request.interceptor';
import { config } from 'dotenv';
import { EnvironmentConfigService } from './config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { LogLevel, Logger } from '@nestjs/common';

config();
const configService = new EnvironmentConfigService(new ConfigService());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new RequestInterceptor(),
  );

  if (configService.getAppLogs()) {
    if (!configService.getLogLevel() && configService.getLogLevel() === '') {
      Logger.overrideLogger(['error']);
    } else {
      const logLevels = configService
        .getLogLevel()
        .split(',')
        .map((level) => level.trim());
      Logger.overrideLogger(logLevels as LogLevel[]);
    }
    const logger = new Logger();
    app.useLogger(logger);
  }

  const config = new DocumentBuilder()
    .setTitle('Easy Generator')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
