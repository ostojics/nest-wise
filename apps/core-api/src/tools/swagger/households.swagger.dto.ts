import {ApiProperty} from '@nestjs/swagger';

export class UpdateHouseholdSwaggerDTO {
  @ApiProperty({
    description: 'Household name',
    example: 'Smith Family',
    maxLength: 255,
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Currency code used by the household',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
    pattern: '^[A-Z]{3}$',
    required: false,
  })
  currencyCode?: string;

  @ApiProperty({
    description: 'Monthly budget for the household',
    example: 6000,
    type: 'number',
    format: 'decimal',
    minimum: 0,
    required: false,
  })
  monthlyBudget?: number;
}

export class HouseholdResponseSwaggerDTO {
  @ApiProperty({
    description: 'Household ID',
    format: 'uuid',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  id: string;

  @ApiProperty({
    description: 'Household name',
    example: 'Smith Family',
  })
  name: string;

  @ApiProperty({
    description: 'Currency code used by the household',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  currencyCode: string;

  @ApiProperty({
    description: 'Monthly budget for the household',
    example: 5000,
    type: 'number',
    format: 'decimal',
  })
  monthlyBudget: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;
}
