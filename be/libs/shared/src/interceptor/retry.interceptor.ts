import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { mergeMap, Observable, retryWhen, scan, timer } from "rxjs";

export const RETRY_OPTIONS_KEY = "RetryInterceptor"

export type RetryOptions = {
  attempts?: number
  delay?: number   // ms
  retryOn?: Function[]
}

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RetryInterceptor.name);

  constructor(
    private readonly reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const options = this.reflector.get<RetryOptions>(RETRY_OPTIONS_KEY, context.getHandler())

    if (!options) {
      return next.handle()
    }

    const maxAttempts = options.attempts ?? 3
    const baseDelay = options.delay ?? 2000

    return next.handle().pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((attemptCount, error) => {
            if (options.retryOn && !options.retryOn.some((cls) => error instanceof cls)) {
              throw error
            }

            if (attemptCount >= maxAttempts) {
              this.logger.error(`❌ Hết lượt retry (${maxAttempts}). Bỏ cuộc.`)
              throw error
            }

            const nextAttempt = attemptCount + 1;

            this.logger.warn(`⚠️ Lỗi: ${error.message}. Đang thử lại lần ${nextAttempt}/${maxAttempts}...`)

            return nextAttempt;
          }, 0),

          mergeMap((attemptCount) => {
            const delayTime = baseDelay * Math.pow(2, attemptCount - 1)
            return timer(delayTime)
          })
        )
      )
    )
  }
}
