import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { CustomHttpException } from './custom-http-exception';

interface IErrorResponse {
	message?: string | string[];
}

@Catch()
export class WebServerExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = 404;
		let exceptionResponse: IErrorResponse;
    const customHttpException = exception as unknown as CustomHttpException;

		exceptionResponse = {
			message: 'Ресурс не найден',
		};

		const errorResponse = {
			data: null,
			success: false,
			...exceptionResponse,
		};

		response.status(status).json(errorResponse);
	}
}
