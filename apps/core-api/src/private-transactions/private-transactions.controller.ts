import {Body, Controller, Post, UseGuards, UsePipes} from '@nestjs/common';
import {PrivateTransactionsService} from './private-transactions.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {CreatePrivateTransactionDTO, createPrivateTransactionSchema} from '@maya-vault/contracts';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';

@ApiTags('Private Transactions')
@Controller({
  version: '1',
  path: 'private-transactions',
})
export class PrivateTransactionsController {
  constructor(private readonly privateTransactionsService: PrivateTransactionsService) {}

  @ApiOperation({
    summary: 'Create a private transaction',
    description: 'Creates a private transaction and updates the account balance accordingly',
  })
  @ApiBody({
    schema: {
      example: {
        householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        accountId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
        amount: 50.75,
        type: 'expense',
        description: 'Personal coffee',
        transactionDate: '2024-01-15',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Private transaction created successfully',
  })
  @ApiBadRequestResponse({description: 'Invalid input data'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPrivateTransactionSchema))
  @Post('')
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePrivateTransactionDTO) {
    return await this.privateTransactionsService.create(user.sub, dto);
  }
}
