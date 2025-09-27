import {ZodSchema, ZodError, z} from 'zod';
import {Injectable, BadRequestException, PipeTransform, ArgumentMetadata} from '@nestjs/common';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: Record<string, unknown>, _metadata: ArgumentMetadata) {
    if (_metadata.type !== 'body' && _metadata.type !== 'query') {
      return value;
    }

    const result = this.schema.safeParse(value);
    if (!result.success) {
      // For now, we'll keep the original behavior
      // The localization will be handled in the error response interceptor
      throw new BadRequestException(result.error);
    }

    return result.data as Record<string, unknown>;
  }
}
