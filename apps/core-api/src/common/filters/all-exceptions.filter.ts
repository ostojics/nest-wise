import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import {Request, Response} from 'express';
import {Logger} from 'pino-nestjs';
import {PosthogService} from '../../lib/posthog/posthog.service';

/**
 * Global exception filter that handles all unhandled exceptions
 * Logs errors and captures them in PostHog for monitoring
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly posthogService: PosthogService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';
    const errorResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const distinctId = 'backend-core';

    this.logger.error('Unhandled exception', {
      error: exception,
      path: request.url,
      method: request.method,
      status,
      message,
      distinctId,
    });

    if (exception instanceof Error) {
      this.posthogService.captureException(exception, distinctId, {
        path: request.url,
        method: request.method,
        status,
      });
    } else {
      this.posthogService.captureException(
        new Error(typeof exception === 'string' ? exception : 'Unknown exception'),
        distinctId,
        {
          path: request.url,
          method: request.method,
          status,
        },
      );
    }

    response.status(status).json(
      errorResponse ?? {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      },
    );
  }
}
