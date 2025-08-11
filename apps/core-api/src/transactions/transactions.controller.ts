import {
  CreateTransactionAiDTO,
  CreateTransactionDTO,
  GetTransactionsQueryDTO,
  UpdateTransactionDTO,
  createTransactionAiSchema,
  createTransactionSchema,
  getTransactionsQuerySchema,
  updateTransactionSchema,
} from '@maya-vault/validation';
import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
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
  UpdateTransactionSwaggerDTO,
} from 'src/tools/swagger/transactions.swagger.dto';
import {TransactionsService} from './transactions.service';

@ApiTags('Transactions')
@Controller({
  version: '1',
  path: 'transactions',
})
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: 'Get transactions with filtering, sorting, and pagination',
    description: 'Retrieves transactions with comprehensive filtering, sorting, and pagination options',
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
    name: 'householdId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by household ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
    name: 'transactionDate_from',
    required: false,
    type: String,
    format: 'date',
    description: 'Filter transactions from this date onwards (YYYY-MM-DD format)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'transactionDate_to',
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
  async getTransactions(@Query(new ZodValidationPipe(getTransactionsQuerySchema)) query: GetTransactionsQueryDTO) {
    return await this.transactionsService.findTransactions(query);
  }

  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Creates a new transaction and updates the account balance automatically',
  })
  @ApiBody({
    type: CreateTransactionSwaggerDTO,
    description: 'Transaction creation data',
    examples: {
      expense: {
        summary: 'Expense Transaction',
        value: {
          householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
          householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          categoryId: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
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
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  @Post('')
  async createTransaction(@Body() dto: CreateTransactionDTO) {
    return await this.transactionsService.createTransaction(dto);
  }

  @ApiOperation({
    summary: 'Create a transaction using AI analysis',
    description:
      'Creates a transaction by analyzing a natural language description using AI to extract amount, type, and category',
  })
  @ApiBody({
    type: CreateTransactionAiSwaggerDTO,
    description: 'Transaction creation data with natural language description for AI analysis',
    examples: {
      expense: {
        summary: 'Expense Transaction',
        value: {
          householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          description: 'Paid $50 for groceries at Walmart',
          transactionDate: '2024-01-15',
        },
      },
      income: {
        summary: 'Income Transaction',
        value: {
          householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          description: 'Received $2500 salary deposit from company',
          transactionDate: '2024-01-15',
        },
      },
      restaurant: {
        summary: 'Restaurant Expense',
        value: {
          householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
  @UsePipes(new ZodValidationPipe(createTransactionAiSchema))
  @Post('/ai')
  async createTransactionAi(@Body() dto: CreateTransactionAiDTO) {
    return await this.transactionsService.createTransactionAi(dto);
  }

  @ApiOperation({
    summary: 'Update a transaction',
    description: 'Updates an existing transaction and adjusts the account balance automatically',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the transaction',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({
    type: UpdateTransactionSwaggerDTO,
    description: 'Transaction update data',
    examples: {
      updateAmount: {
        summary: 'Update Amount',
        value: {
          amount: 55.0,
          description: 'Coffee at Starbucks - updated amount',
        },
      },
      reconcile: {
        summary: 'Mark as Reconciled',
        value: {
          isReconciled: true,
        },
      },
    },
  })
  @ApiOkResponse({
    type: TransactionResponseSwaggerDTO,
    description: 'Transaction updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(updateTransactionSchema))
  @Put(':id')
  async updateTransaction(@Param('id') id: string, @Body() dto: UpdateTransactionDTO) {
    return await this.transactionsService.updateTransaction(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a transaction',
    description: 'Deletes a transaction and adjusts the account balance automatically',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the transaction',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiNoContentResponse({
    description: 'Transaction deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    return await this.transactionsService.deleteTransaction(id);
  }
}
