import {
  CreateTransactionHouseholdDTO,
  createTransactionHouseholdSchema,
  CreateTransactionAiHouseholdDTO,
  createTransactionAiHouseholdSchema,
  GetTransactionsQueryHouseholdDTO,
  getTransactionsQueryHouseholdSchema,
  GetAccountsSpendingQueryHouseholdDTO,
  getAccountsSpendingQueryHouseholdSchema,
  GetSpendingSummaryQueryHouseholdDTO,
  getSpendingSummaryQueryHouseholdSchema,
} from '@nest-wise/contracts';
import {Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {
  CreateTransactionAiSwaggerDTO,
  CreateTransactionSwaggerDTO,
  GetTransactionsResponseSwaggerDTO,
  TransactionResponseSwaggerDTO,
  NetWorthTrendPointSwaggerDTO,
  AccountSpendingPointSwaggerDTO,
} from 'src/tools/swagger/transactions.swagger.dto';
import {TransactionsService} from '../transactions/transactions.service';
import {
  AccountSpendingPointContract,
  NetWorthTrendPointContract,
  SpendingTotalContract,
  CategorySpendingPointContract,
} from '@nest-wise/contracts';

@ApiTags('Household Transactions')
@UseGuards(AuthGuard, LicenseGuard)
@Controller({
  version: '1',
  path: 'households/:householdId/transactions',
})
export class HouseholdTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: 'Get transactions for a household with filtering, sorting, and pagination',
    description:
      'Retrieves transactions for a specific household with comprehensive filtering, sorting, and pagination options',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
    example: 20,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description:
      'Sort field. Allowed: amount, -amount, type, -type, transactionDate, -transactionDate, createdAt, -createdAt',
    example: '-transactionDate',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by transaction type (expense or income)',
    example: 'expense',
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by account ID',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by category ID',
    example: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    format: 'date',
    description: 'Filter transactions from this date onwards (YYYY-MM-DD format)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    format: 'date',
    description: 'Filter transactions up to this date (YYYY-MM-DD format)',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search transactions by description (case-insensitive partial match)',
    example: 'groceries',
  })
  @ApiOkResponse({
    type: GetTransactionsResponseSwaggerDTO,
    description: 'Transactions retrieved successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @Get('')
  async getTransactions(
    @Param('householdId') householdId: string,
    @Query(new ZodValidationPipe(getTransactionsQueryHouseholdSchema)) query: GetTransactionsQueryHouseholdDTO,
  ) {
    return await this.transactionsService.findTransactionsForHousehold(householdId, query);
  }

  @ApiOperation({
    summary: 'Create a new transaction for a household',
    description: 'Creates a new transaction for the specified household and updates the account balance automatically',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({
    type: CreateTransactionSwaggerDTO,
    description: 'Transaction creation data',
    examples: {
      expense: {
        summary: 'Expense Transaction',
        value: {
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          categoryId: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
          amount: 50.75,
          type: 'expense',
          description: 'Coffee at Starbucks',
          transactionDate: '2024-01-15',
          isReconciled: false,
        },
      },
      income: {
        summary: 'Income Transaction',
        value: {
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          categoryId: null,
          amount: 2500.0,
          type: 'income',
          description: 'Salary deposit',
          transactionDate: '2024-01-15',
          isReconciled: false,
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: TransactionResponseSwaggerDTO,
    description: 'Transaction created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UsePipes(new ZodValidationPipe(createTransactionHouseholdSchema))
  @Post('')
  async createTransaction(@Param('householdId') householdId: string, @Body() dto: CreateTransactionHouseholdDTO) {
    return await this.transactionsService.createTransactionForHousehold(householdId, dto);
  }

  @ApiOperation({
    summary: 'Request AI transaction suggestion for a household (async)',
    description:
      'Enqueues a background job to generate a transaction suggestion by analyzing a natural language description using AI. Returns immediately with a job ID that can be used to poll for the suggestion. The suggestion is NOT saved to the database and must be confirmed by the user.',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({
    type: CreateTransactionAiSwaggerDTO,
    description: 'Transaction data with natural language description for AI analysis',
    examples: {
      expense: {
        summary: 'Expense Transaction',
        value: {
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          description: 'Paid $50 for groceries at Walmart',
          transactionDate: '2024-01-15',
        },
      },
      income: {
        summary: 'Income Transaction',
        value: {
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          description: 'Received $2500 salary deposit from company',
          transactionDate: '2024-01-15',
        },
      },
      restaurant: {
        summary: 'Restaurant Expense',
        value: {
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          description: 'Coffee and pastry at Starbucks for $12.50',
          transactionDate: '2024-01-15',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Job enqueued successfully, returns job ID for polling',
    schema: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'Unique identifier for the background job',
          example: '123456',
        },
        status: {
          type: 'string',
          enum: ['pending', 'processing', 'completed', 'failed'],
          description: 'Current status of the job',
          example: 'pending',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UsePipes(new ZodValidationPipe(createTransactionAiHouseholdSchema))
  @Post('/ai')
  async createTransactionAi(@Param('householdId') householdId: string, @Body() dto: CreateTransactionAiHouseholdDTO) {
    return await this.transactionsService.enqueueAiTransaction(householdId, dto);
  }

  @ApiOperation({
    summary: 'Get AI transaction suggestion job status',
    description:
      'Retrieves the current status of an AI transaction suggestion background job, including the suggestion if completed. The suggestion has NOT been saved to the database yet.',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiParam({
    name: 'jobId',
    type: 'string',
    description: 'The unique identifier of the job',
    example: '123456',
  })
  @ApiOkResponse({
    description: 'Job status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'Unique identifier for the background job',
          example: '123456',
        },
        status: {
          type: 'string',
          enum: ['pending', 'processing', 'completed', 'failed'],
          description: 'Current status of the job',
          example: 'completed',
        },
        suggestion: {
          type: 'object',
          description: 'The AI-generated transaction suggestion (only present when status is completed)',
          nullable: true,
        },
        error: {
          type: 'string',
          description: 'Error message (only present when status is failed)',
          nullable: true,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Job not found',
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @Get('ai/:jobId')
  async getAiTransactionJobStatus(@Param('householdId') householdId: string, @Param('jobId') jobId: string) {
    return await this.transactionsService.getAiTransactionJobStatus(jobId);
  }

  @ApiOperation({
    summary: 'Get household net worth trend (last 12 months)',
    description: 'Returns month-by-month household net worth for the last 12 months.',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: 'Net worth trend computed successfully',
    type: [NetWorthTrendPointSwaggerDTO],
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @Get('net-worth-trend')
  async getNetWorthTrend(@Param('householdId') householdId: string): Promise<NetWorthTrendPointContract[]> {
    return await this.transactionsService.getNetWorthTrend(householdId);
  }

  @ApiOperation({
    summary: 'Get household accounts spending distribution',
    description:
      'Aggregates total EXPENSE spending by account for the specified household, within an optional date range.',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    format: 'date-time',
    description: 'Start date as ISO 8601 timestamp (e.g., 2025-03-15T12:00:00.000Z)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    format: 'date-time',
    description: 'End date as ISO 8601 timestamp (e.g., 2025-03-31T12:00:00.000Z)',
  })
  @ApiOkResponse({
    description: 'Spending by account computed successfully',
    type: [AccountSpendingPointSwaggerDTO],
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @Get('accounts-spending')
  async getAccountsSpending(
    @Param('householdId') householdId: string,
    @Query(new ZodValidationPipe(getAccountsSpendingQueryHouseholdSchema)) query: GetAccountsSpendingQueryHouseholdDTO,
  ): Promise<AccountSpendingPointContract[]> {
    return await this.transactionsService.getAccountsSpendingForHousehold(householdId, query);
  }

  @ApiOperation({
    summary: 'Get household spending total',
    description:
      'Returns the total EXPENSE spending amount and count for the specified household, within an optional date range.',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    format: 'date-time',
    description: 'Start date as ISO 8601 timestamp (e.g., 2025-03-15T12:00:00.000Z)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    format: 'date-time',
    description: 'End date as ISO 8601 timestamp (e.g., 2025-03-31T12:00:00.000Z)',
  })
  @ApiOkResponse({
    description: 'Spending total computed successfully',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          description: 'Total spending amount',
          example: 1250.75,
        },
        count: {
          type: 'number',
          description: 'Number of expense transactions',
          example: 42,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @Get('spending-total')
  async getSpendingTotal(
    @Param('householdId') householdId: string,
    @Query(new ZodValidationPipe(getSpendingSummaryQueryHouseholdSchema)) query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<SpendingTotalContract> {
    return await this.transactionsService.getSpendingTotalForHousehold(householdId, query);
  }

  @ApiOperation({
    summary: 'Get household spending aggregated by category',
    description:
      'Returns EXPENSE spending aggregated by category for the specified household, within an optional date range.',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    format: 'date-time',
    description: 'Start date as ISO 8601 timestamp (e.g., 2025-03-15T12:00:00.000Z)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    format: 'date-time',
    description: 'End date as ISO 8601 timestamp (e.g., 2025-03-31T12:00:00.000Z)',
  })
  @ApiOkResponse({
    description: 'Categories spending computed successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Category ID (null for uncategorized)',
            example: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
          },
          categoryName: {
            type: 'string',
            description: 'Category name',
            example: 'Groceries',
          },
          amount: {
            type: 'number',
            description: 'Total spending amount for this category',
            example: 350.25,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @Get('categories-spending')
  async getCategoriesSpending(
    @Param('householdId') householdId: string,
    @Query(new ZodValidationPipe(getSpendingSummaryQueryHouseholdSchema)) query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<CategorySpendingPointContract[]> {
    return await this.transactionsService.getCategoriesSpendingForHousehold(householdId, query);
  }
}
