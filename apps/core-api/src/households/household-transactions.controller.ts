import {
  CreateTransactionHouseholdDTO,
  createTransactionHouseholdSchema,
  CreateTransactionAiHouseholdDTO,
  createTransactionAiHouseholdSchema,
  GetTransactionsQueryHouseholdDTO,
  getTransactionsQueryHouseholdSchema,
  GetAccountsSpendingQueryHouseholdDTO,
  getAccountsSpendingQueryHouseholdSchema,
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
import {AccountSpendingPointContract, NetWorthTrendPointContract} from '@nest-wise/contracts';

@ApiTags('Household Transactions')
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
    name: 'date_from',
    required: false,
    type: String,
    format: 'date',
    description: 'Filter transactions from this date onwards (YYYY-MM-DD format)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'date_to',
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createTransactionHouseholdSchema))
  @Post('')
  async createTransaction(@Param('householdId') householdId: string, @Body() dto: CreateTransactionHouseholdDTO) {
    return await this.transactionsService.createTransactionForHousehold(householdId, dto);
  }

  @ApiOperation({
    summary: 'Create a transaction using AI analysis for a household',
    description:
      'Creates a transaction for the specified household by analyzing a natural language description using AI to extract amount, type, and category',
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
    description: 'Transaction creation data with natural language description for AI analysis',
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
    type: TransactionResponseSwaggerDTO,
    description: 'Transaction created successfully using AI analysis',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or AI failed to parse transaction description',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createTransactionAiHouseholdSchema))
  @Post('/ai')
  async createTransactionAi(@Param('householdId') householdId: string, @Body() dto: CreateTransactionAiHouseholdDTO) {
    return await this.transactionsService.createTransactionAiForHousehold(householdId, dto);
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
  @UseGuards(AuthGuard)
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
    name: 'date_from',
    required: false,
    type: String,
    format: 'date',
    description: 'Start date inclusive (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'date_to',
    required: false,
    type: String,
    format: 'date',
    description: 'End date inclusive (YYYY-MM-DD)',
  })
  @ApiOkResponse({
    description: 'Spending by account computed successfully',
    type: [AccountSpendingPointSwaggerDTO],
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('accounts-spending')
  async getAccountsSpending(
    @Param('householdId') householdId: string,
    @Query(new ZodValidationPipe(getAccountsSpendingQueryHouseholdSchema)) query: GetAccountsSpendingQueryHouseholdDTO,
  ): Promise<AccountSpendingPointContract[]> {
    return await this.transactionsService.getAccountsSpendingForHousehold(householdId, query);
  }
}
