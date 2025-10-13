import {UpdateTransactionDTO, updateTransactionSchema} from '@nest-wise/contracts';
import {Body, Controller, Delete, Get, Param, Put, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {TransactionResponseSwaggerDTO, UpdateTransactionSwaggerDTO} from 'src/tools/swagger/transactions.swagger.dto';
import {TransactionsService} from './transactions.service';

@ApiTags('Transactions')
@Controller({
  version: '1',
  path: 'transactions',
})
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: 'Get a transaction by ID',
    description: 'Retrieves a single transaction by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the transaction',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    type: TransactionResponseSwaggerDTO,
    description: 'Transaction found successfully',
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, LicenseGuard)
  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return await this.transactionsService.findTransactionById(id);
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
      changeAccount: {
        summary: 'Move to Another Account',
        value: {
          accountId: 'd4e5f6g7-h8i9-0123-defg-h45678901234',
        },
      },
      changeTypeToIncome: {
        summary: 'Change Type to Income (clears category)',
        value: {
          type: 'income',
          categoryId: null,
        },
      },
      changeTypeToExpense: {
        summary: 'Change Type to Expense (requires category)',
        value: {
          type: 'expense',
          categoryId: 'c3d4e5f6-g7h8-9012-cdef-g34567890123',
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
  @UseGuards(AuthGuard, LicenseGuard)
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
  @UseGuards(AuthGuard, LicenseGuard)
  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    return await this.transactionsService.deleteTransaction(id);
  }
}
