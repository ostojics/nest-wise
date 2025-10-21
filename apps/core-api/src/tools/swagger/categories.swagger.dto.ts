import {ApiProperty} from '@nestjs/swagger';

export class CreateCategorySwaggerDTO {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Groceries',
    minLength: 1,
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'Optional description of the category (max 500 characters)',
    example: 'Food and household supplies from supermarkets',
    maxLength: 500,
    required: false,
  })
  description?: string;
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

  @ApiProperty({
    description: 'Optional description of the category (max 500 characters)',
    example: 'Restaurants, cafes, and dining out',
    maxLength: 500,
    required: false,
  })
  description?: string;
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
    description: 'Optional description of the category (nullable, max 500 characters)',
    example: 'Food and household supplies from supermarkets',
    nullable: true,
  })
  description: string | null;

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
