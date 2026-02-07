import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {

  constructor(private readonly reflector : Reflector){}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const timeoutTimes = this.reflector.get("TIMEOUT", context.getHandler()) ?? 5000
    return next.handle().pipe(
      timeout(timeoutTimes), // 5 giây
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('Request timed out'));
        }
        return throwError(() => err);
      }),
    );
  }
}
