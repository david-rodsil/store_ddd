import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const msg =
      exception instanceof HttpException ? exception.getResponse() : exception;
   
        response.status(200).json({
          status: status,
          success: false,
          entity: null,
          message: msg,
          timestamp: new Date().toISOString(),
        });
    
  }
}