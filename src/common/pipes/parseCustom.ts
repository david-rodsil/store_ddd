import {
    ValidationError,
    ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

export class ValidationPipe extends NestValidationPipe {
    public createExceptionFactory() {
        return (validationErrors: ValidationError[] = []) => {
            let response;
            let message: string[] = [];
            for (var i = 0; i < validationErrors.length; i++) {
                let messages = validationErrors[i].constraints;
                for (let m in messages) {
                    message.push(messages[m]);
                }
            }
            response = {
                "status": " Warning ",
                "message": message,
                "entity": null,
                "createdAt": new Date()
            }
            return  new HttpErrorByCode[this.errorHttpStatusCode](response);
        };
    }
}