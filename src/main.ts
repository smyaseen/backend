import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'interceptors/response.interceptor';
import { RequestInterceptor } from 'interceptors/request.interceptor';
import { config } from 'dotenv';
import { EnvironmentConfigService } from './config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { LogLevel, Logger } from '@nestjs/common';
import helmet from 'helmet';

config();
const configService = new EnvironmentConfigService(new ConfigService());

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors({
    origin: [configService.getCorsOrigin()],
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'access-control-allow-origin',
    ],
  });

  app.use(helmet());

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

  await app.listen(port, '0.0.0.0');
}
bootstrap();
