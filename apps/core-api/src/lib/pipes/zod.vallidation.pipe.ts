import {ZodSchema} from 'zod';
import {Injectable, BadRequestException, PipeTransform, ArgumentMetadata} from '@nestjs/common';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: Record<string, unknown>, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return result.data as Record<string, unknown>;
  }
}
