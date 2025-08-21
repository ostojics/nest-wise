import {ApiProperty} from '@nestjs/swagger';

export class AccountResponseSwaggerDTO {
  @ApiProperty({
    description: 'Account ID',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Account name',
    example: 'Main Checking',
  })
  name: string;

  @ApiProperty({
    description: 'Account type',
    example: 'checking',
  })
  type: string;

  @ApiProperty({
    description: 'Initial balance',
    example: 1000.0,
  })
  initialBalance: number;

  @ApiProperty({
    description: 'Current balance',
    example: 950.0,
  })
  currentBalance: number;

  @ApiProperty({
    description: 'Owner ID',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Household ID',
    format: 'uuid',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  householdId: string;

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

export class CreateAccountSwaggerDTO {
  @ApiProperty({
    description: 'Account name',
    example: 'Main Checking',
    maxLength: 255,
  })
  name: string;

  @ApiProperty({
    description: 'Account type',
    enum: ['checking', 'savings', 'credit_card', 'investment', 'cash'],
    example: 'checking',
  })
  type: string;

  @ApiProperty({
    description: 'Initial balance for the account',
    example: 1000.0,
    minimum: 0,
  })
  initialBalance: number;

  @ApiProperty({
    description: 'Owner ID (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Household ID (UUID)',
    format: 'uuid',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  householdId: string;
}

export class UpdateAccountSwaggerDTO {
  @ApiProperty({
    description: 'Account name',
    example: 'Updated Checking',
    maxLength: 255,
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Account type',
    enum: ['checking', 'savings', 'credit_card', 'investment', 'cash'],
    example: 'savings',
    required: false,
  })
  type?: string;

  @ApiProperty({
    description: 'New current balance',
    example: 1200.5,
    required: false,
  })
  currentBalance?: number;
}
