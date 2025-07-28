import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {TransactionsService} from './transactions.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {
  CreateTransactionAiDTO,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  createTransactionAiSchema,
  createTransactionSchema,
  updateTransactionSchema,
} from '@maya-vault/validation';
import {
  CreateTransactionSwaggerDTO,
  UpdateTransactionSwaggerDTO,
  TransactionResponseSwaggerDTO,
} from 'src/tools/swagger/transactions.swagger.dto';

@ApiTags('Transactions')
@Controller({
  version: '1',
  path: 'transactions',
})
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

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

  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createTransactionAiSchema))
  @Post('/ai')
  async createTransactionAi(@Body() dto: CreateTransactionAiDTO) {}

  @ApiOperation({
    summary: 'Get transactions by account ID',
    description: 'Retrieves all transactions for a specific account, ordered by creation date (newest first)',
  })
  @ApiParam({
    name: 'accountId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the account',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiOkResponse({
    type: [TransactionResponseSwaggerDTO],
    description: 'Transactions retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('account/:accountId')
  async getTransactionsByAccountId(@Param('accountId') accountId: string) {
    return await this.transactionsService.findTransactionsByAccountId(accountId);
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
