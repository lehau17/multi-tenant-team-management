// src/shared/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../error/error-exception';

@Catch() // Để trống để bắt tất cả các loại lỗi
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Xác định Status Code
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 3. Khởi tạo cấu trúc Response mặc định
    let responseBody = {
      statusCode: status,
      success: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: (exception as any)?.message || 'Internal server error',
      details: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // 4. Nếu là Exception do mình tự định nghĩa (BaseException)
    if (exception instanceof BaseException) {
      response.status(status).json(exception.getResponse());
      return
    }

    // 5. Trả về cho Client
    response.status(status).json(responseBody);
  }
}
