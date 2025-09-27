import {ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException, HttpStatus} from '@nestjs/common';
import {Request, Response} from 'express';
import {ZodError} from 'zod';
import {getRequestTranslator} from '../utils/i18n.helper';
import {makeZodI18nMap} from 'zod-i18n-map';
import {z} from 'zod';

@Catch()
export class I18nExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const t = getRequestTranslator(request);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = t('api:errors.internalServerError');
    let details: string[] = [];

    // Handle different types of exceptions
    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Check if this is a ZodError wrapped in BadRequestException
      if (typeof exceptionResponse === 'object' && 'issues' in exceptionResponse) {
        const zodError = exceptionResponse as ZodError;
        message = t('api:errors.validationFailed');
        details = this.translateZodErrors(zodError, t);
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = (exceptionResponse as any).message || message;
        details = (exceptionResponse as any).details || [];
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = (exceptionResponse as any).message || message;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(details.length > 0 && {details}),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private translateZodErrors(zodError: ZodError, t: any): string[] {
    // Set up localized error map
    const zodI18nMap = makeZodI18nMap({
      t: t as any,
      ns: 'zod',
      handlePath: {
        keyPrefix: 'zod:errors',
      },
    });

    // Extended error map to handle domain-specific keys
    const extendedZodErrorMap: z.ZodErrorMap = (issue, ctx) => {
      // Check if the message is a translation key (starts with a letter, contains dots)
      const isTranslationKey = /^[a-z][\w.-]+(\.[\w-]+)*$/.test(issue.message || '');

      if (isTranslationKey && issue.message) {
        // Try to translate the domain-specific key
        const translatedMessage = t(issue.message, {defaultValue: issue.message});
        if (translatedMessage !== issue.message) {
          return {message: translatedMessage};
        }
      }

      // Fall back to the default zod-i18n-map
      return zodI18nMap(issue, ctx);
    };

    // Apply error map to each issue
    return zodError.issues.map((issue) => {
      const result = extendedZodErrorMap(issue, {data: undefined, defaultError: issue.message});
      return result.message;
    });
  }
}
