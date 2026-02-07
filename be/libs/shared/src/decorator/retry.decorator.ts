import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common"
import { RETRY_OPTIONS_KEY, RetryInterceptor, RetryOptions } from "../interceptor"

export const UseRetry = (options : RetryOptions) => {
  return applyDecorators(
    SetMetadata<string, RetryOptions>(RETRY_OPTIONS_KEY, options),
    UseInterceptors(RetryInterceptor)
  )
}
