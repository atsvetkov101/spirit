import { HttpStatus } from '@nestjs/common';
export interface ICustomHttpExceptionOptions {
  statusCode?: HttpStatus;
  originalError?: Error;
}
