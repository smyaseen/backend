import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map } from 'rxjs';

import { responseMessageKey } from '../decorators/response-message.decorator';
import { keyIgnoreResponseInterceptor } from '../decorators/ignore-res-interceptor.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  private readonly reflector = new Reflector();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const responseMessage =
      this.reflector.get<string>(responseMessageKey, context.getHandler()) ||
      '';
    const ignoreMetaProperty: boolean =
      this.reflector.get<boolean>(
        keyIgnoreResponseInterceptor,
        context.getHandler(),
      ) || false;
    if (!ignoreMetaProperty) {
      return next
        .handle()
        .pipe(this.onSuccess(responseMessage), this.errorHandler());
    } else {
      return next.handle();
    }
  }

  private onSuccess(responseMessage: string) {
    return map((data) => ({
      success: true,
      message: responseMessage,
      data: data,
    }));
  }

  private errorHandler() {
    return catchError((error) => {
      this.logger.error('ERROR: ', JSON.stringify(error.message));
      if (error instanceof HttpException) {
        this.logger.error('ERROR: ', error.message, 'STACK: ', error.stack);

        const status = error.getStatus();
        const message = error.getResponse()['message'];
        let errorMessage = message;
        if (Array.isArray(message)) {
          errorMessage = message[0];
        }
        return this.errorObservable(status, errorMessage);
      } else if (error.message.includes('duplicate')) {
        return this.errorObservable(409, error.detail);
      } else if (error.message.includes('Cannot remove')) {
        return this.errorObservable(404, error.detail);
      } else {
        return this.errorObservable(
          500,
          error.message || 'Internal Server Error',
        );
      }
    });
  }

  private httpExection(status: number, message: string) {
    throw new HttpException({ success: false, status, message }, status);
  }

  private errorObservable(status: number, message: string) {
    return new Observable((observer) => {
      observer.error(this.httpExection(status, message));
    });
  }
}
