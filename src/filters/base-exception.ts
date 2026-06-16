import { IBaseExceptionOptions } from "./ibase-exception-options";

export abstract class BaseException extends Error {
  errorCode: string;
  error: string;
  originalError: Error | undefined;
  protected constructor({ error, errorCode }: { error: string; errorCode: string }, options: IBaseExceptionOptions = {}) {
    super(error);
    Error.captureStackTrace(this, this.constructor);
    this.errorCode = errorCode;
    this.error = error;

    const { originalError = undefined } = options;
    this.originalError = originalError;
  }
  getOriginalError(): Error | undefined {
    return this.originalError;
  }
  getErrorCode(): string {
    return this.errorCode;
  }
  getError(): string {
    return this.error;
  }
}
