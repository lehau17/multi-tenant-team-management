import {
  Injectable,
  ValidationError,
  ValidationPipe
} from "@nestjs/common";
import { ERROR_CODE } from "../error/error-code";
import { UnprocessableEntityException } from "../error/error-exception";

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {

  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,

      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(error => {
          return Object.values(error.constraints || {})[0];
        });

        return new UnprocessableEntityException(ERROR_CODE.INVALID_DATA_REQUEST, messages);
      }
    });
  }
}
