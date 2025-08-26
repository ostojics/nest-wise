import {ApiProperty} from '@nestjs/swagger';

export class CategoryBudgetResponseSwaggerDTO {
  @ApiProperty({
    description: 'Unique identifier for the category budget row',
    example: 'd1c2b3a4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'UUID of the household this budget belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  householdId: string;

  @ApiProperty({
    description: 'UUID of the category this planned amount applies to',
    example: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
    format: 'uuid',
  })
  categoryId: string;

  @ApiProperty({
    description: "Month identifier in the format 'YYYY-MM'",
    example: '2025-09',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])$',
  })
  month: string;

  @ApiProperty({
    description: 'Planned allocation for the given category and month',
    example: 250.0,
  })
  plannedAmount: number;

  @ApiProperty({
    description: 'Timestamp when the budget row was created',
    example: '2025-08-01T00:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the budget row was last updated',
    example: '2025-08-15T12:34:56.000Z',
    format: 'date-time',
  })
  updatedAt: Date;
}
