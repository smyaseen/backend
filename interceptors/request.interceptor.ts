import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, ip, query } = req;
    const userAgent = req.get('user-agent') || '';

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} from ${ip} - ${userAgent}`,
    );

    if (req.body) {
      this.logger.log(`Request Payload: ${JSON.stringify(req.body)}`);
    }
    if (query) {
      this.logger.log(`Query Parameters: ${JSON.stringify(query)}`);
    }

    return next.handle();
  }
}
