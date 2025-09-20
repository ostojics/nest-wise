import {ApiProperty} from '@nestjs/swagger';

export class CreateCategorySwaggerDTO {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Groceries',
    minLength: 1,
    maxLength: 100,
  })
  name: string;
}

export class UpdateCategorySwaggerDTO {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Food & Dining',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  name?: string;
}

export class CategoryResponseSwaggerDTO {
  @ApiProperty({
    description: 'Unique identifier for the category',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Groceries',
  })
  name: string;

  @ApiProperty({
    description: 'UUID of the household this category belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  householdId: string;

  @ApiProperty({
    description: 'Timestamp when the category was created',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the category was last updated',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  updatedAt: Date;
}
