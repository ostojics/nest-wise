import {ApiProperty} from '@nestjs/swagger';

export class ErrorResponseSwaggerDTO {
  @ApiProperty({
    description: 'Error message',
    example: 'Resource not found',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'NOT_FOUND',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;
}

export class ValidationErrorResponseSwaggerDTO {
  @ApiProperty({
    description: 'Validation error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'BAD_REQUEST',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Validation error details',
    example: ['email must be a valid email', 'password must be at least 8 characters'],
    type: [String],
  })
  details: string[];
}

export class UnauthorizedResponseSwaggerDTO {
  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'UNAUTHORIZED',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;
}
