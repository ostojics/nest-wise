import {ApiProperty} from '@nestjs/swagger';

export class CreateTransactionSwaggerDTO {
  @ApiProperty({
    description: 'UUID of the household this transaction belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  householdId: string;

  @ApiProperty({
    description: 'UUID of the account this transaction belongs to',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    format: 'uuid',
  })
  accountId: string;

  @ApiProperty({
    description: 'UUID of the category for this transaction (optional)',
    example: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
    format: 'uuid',
    required: false,
    nullable: true,
  })
  categoryId?: string | null;

  @ApiProperty({
    description: 'Transaction amount',
    example: 50.75,
    minimum: 0.01,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: ['income', 'expense', 'transfer'],
    example: 'expense',
  })
  type: string;

  @ApiProperty({
    description: 'Description of the transaction (optional)',
    example: 'Coffee at Starbucks',
    maxLength: 1000,
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Whether the transaction has been reconciled with bank statement',
    example: false,
    default: false,
    required: false,
  })
  isReconciled?: boolean;
}

export class UpdateTransactionSwaggerDTO {
  @ApiProperty({
    description: 'UUID of the category for this transaction (optional)',
    example: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
    format: 'uuid',
    required: false,
    nullable: true,
  })
  categoryId?: string | null;

  @ApiProperty({
    description: 'Transaction amount',
    example: 52.0,
    minimum: 0.01,
    required: false,
  })
  amount?: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: ['income', 'expense', 'transfer'],
    example: 'expense',
    required: false,
  })
  type?: string;

  @ApiProperty({
    description: 'Description of the transaction (optional)',
    example: 'Coffee at Starbucks - updated',
    maxLength: 1000,
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Whether the transaction has been reconciled with bank statement',
    example: true,
    required: false,
  })
  isReconciled?: boolean;
}

export class TransactionResponseSwaggerDTO {
  @ApiProperty({
    description: 'Unique identifier for the transaction',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'UUID of the household this transaction belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  householdId: string;

  @ApiProperty({
    description: 'UUID of the account this transaction belongs to',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    format: 'uuid',
  })
  accountId: string;

  @ApiProperty({
    description: 'UUID of the category for this transaction',
    example: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
    format: 'uuid',
    nullable: true,
  })
  categoryId: string | null;

  @ApiProperty({
    description: 'Transaction amount',
    example: 50.75,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: ['income', 'expense', 'transfer'],
    example: 'expense',
  })
  type: string;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Coffee at Starbucks',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Whether the transaction has been reconciled with bank statement',
    example: false,
  })
  isReconciled: boolean;

  @ApiProperty({
    description: 'Timestamp when the transaction was created',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the transaction was last updated',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  updatedAt: Date;
}
