import { HttpStatus } from "@nestjs/common";
import { BaseException } from "./base-exception";
import { ICustomHttpExceptionOptions } from "./icustom-http-exception-options";

export class CustomHttpException extends BaseException {
  statusCode: HttpStatus;
  constructor({ error, errorCode }: { error: string, errorCode: string }, options: ICustomHttpExceptionOptions = {}) {
    const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR, originalError = undefined  } = options;
    super({ error, errorCode }, { originalError });
    this.statusCode = statusCode;
  }

  getStatus(): HttpStatus {
    return this.statusCode;
  }
}
