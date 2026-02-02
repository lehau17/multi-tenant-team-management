import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODE, ERROR_MESSAGE_TRANSLATIONS } from "./error-code";

// 1. Tạo BaseException kế thừa từ HttpException của NestJS
export class BaseException extends HttpException {
  public readonly errorCode: ERROR_CODE;
  public readonly details: any[] | null;
  public readonly message_translations: Record<string, string>;

  constructor(
    status: HttpStatus,
    errorCode: ERROR_CODE,
    message: string = "Error",
    details: any[] | null = null
  ) {
    // Gọi super để NestJS xử lý luồng Exception mặc định
    // Cấu trúc object này sẽ được Exception Filter bắt lại
    super(
      {
        message,
        errorCode,
        details,
        translations: ERROR_MESSAGE_TRANSLATIONS[errorCode]
      },
      status
    );


  }
}

// 2. Các class con cụ thể
export class BadRequestException extends BaseException {
  constructor(errorCode: ERROR_CODE, message = "Bad Request") {
    super(HttpStatus.BAD_REQUEST, errorCode, message);
  }
}

export class UnauthorizedException extends BaseException { // Sửa tên Unauthorize -> Unauthorized
  constructor(errorCode: ERROR_CODE, message = "Unauthorized") {
    super(HttpStatus.UNAUTHORIZED, errorCode, message);
  }
}

export class UnprocessableEntityException extends BaseException { // Sửa chính tả
  constructor(errorCode: ERROR_CODE, details: any[] | null = null, message = "Unprocessable Entity") {
    super(HttpStatus.UNPROCESSABLE_ENTITY, errorCode, message, details);
  }
}



export class DomainException extends BaseException {
  constructor(errorCode: ERROR_CODE, message = "Domain Exception") {
    super(HttpStatus.BAD_REQUEST, errorCode, message);
  }
}
