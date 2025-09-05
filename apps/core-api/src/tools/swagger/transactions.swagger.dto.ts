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
    description: 'Date when the transaction occurred',
    example: '2024-01-15',
    format: 'date',
  })
  transactionDate: Date;

  @ApiProperty({
    description: 'Whether the transaction has been reconciled with bank statement',
    example: false,
    default: false,
    required: false,
  })
  isReconciled?: boolean;
}

export class CreateTransactionAiSwaggerDTO {
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
    description:
      'Natural language description of the transaction that AI will analyze to extract amount, type, and category',
    example: 'Paid $50 for groceries at Walmart',
    minLength: 1,
    maxLength: 1000,
  })
  description: string;

  @ApiProperty({
    description: 'Date when the transaction occurred',
    example: '2024-01-15',
    format: 'date',
  })
  transactionDate: Date;
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
    description: 'Date when the transaction occurred',
    example: '2024-01-15',
    format: 'date',
    required: false,
  })
  transactionDate?: Date;

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
    description: 'Date when the transaction occurred',
    example: '2024-01-15',
    format: 'date',
  })
  transactionDate: Date;

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

export class PaginationMetaSwaggerDTO {
  @ApiProperty({
    description: 'Total number of items matching the query',
    example: 150,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
  })
  totalPages: number;
}

export class GetTransactionsResponseSwaggerDTO {
  @ApiProperty({
    description: 'Array of transactions',
    type: [TransactionResponseSwaggerDTO],
  })
  data: TransactionResponseSwaggerDTO[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaSwaggerDTO,
  })
  meta: PaginationMetaSwaggerDTO;
}

export class NetWorthTrendPointSwaggerDTO {
  @ApiProperty({
    description: 'Full month name',
    example: 'January',
  })
  month: string;

  @ApiProperty({
    description: 'Short month name',
    example: 'Jan',
  })
  monthShort: string;

  @ApiProperty({
    description: 'Net worth amount at month end (null if no transactions in that month)',
    example: 13420.85,
    nullable: true,
  })
  amount: number | null;

  @ApiProperty({
    description: 'Indicates whether the month has any transactions',
    example: true,
  })
  hasData: boolean;
}

export const NetWorthTrendArraySwagger = [NetWorthTrendPointSwaggerDTO];

export class AccountSpendingPointSwaggerDTO {
  @ApiProperty({
    description: 'UUID of the account',
    example: '2b7d1c22-3a4b-4a76-8b52-9e5d1b1d4f1a',
    format: 'uuid',
  })
  accountId: string;

  @ApiProperty({
    description: 'Display name of the account',
    example: 'Checking',
  })
  name: string;

  @ApiProperty({
    description: 'Total EXPENSE spending amount for this account in the selected window',
    example: 1250.5,
  })
  amount: number;
}
