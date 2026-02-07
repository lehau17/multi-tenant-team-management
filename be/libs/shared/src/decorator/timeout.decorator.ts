import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common"
import { TimeoutInterceptor } from "../interceptor/timeout.interceptor"

export const UseTimeout = (timeout: number) => {
  return applyDecorators(
    SetMetadata("TIMEOUT", timeout),
    UseInterceptors(TimeoutInterceptor)
  )
}
