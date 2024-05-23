import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) {}

  getJWT_ACCESS_SECRET(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  getJWT_REFRESH_SECRET(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  getAppLogs(): boolean {
    return this.configService.get<boolean>('APP_LOGS');
  }

  getLogLevel(): string {
    return this.configService.get<string>('LOG_LEVEL');
  }
}
