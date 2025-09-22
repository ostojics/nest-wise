import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {PrivateTransactionsService} from './private-transactions.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreatePrivateTransactionDTO,
  GetPrivateTransactionsQueryDTO,
  GetPrivateTransactionsResponseContract,
  createPrivateTransactionSchema,
  getPrivateTransactionsQuerySchema,
} from '@nest-wise/contracts';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';

@ApiTags('Private Transactions')
@Controller({
  version: '1',
  path: 'users/me/private-transactions',
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
  @UseGuards(AuthGuard, LicenseGuard)
  @UsePipes(new ZodValidationPipe(createPrivateTransactionSchema))
  @Post('')
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePrivateTransactionDTO) {
    return await this.privateTransactionsService.create(user.sub, dto);
  }

  @ApiOperation({
    summary: 'Get private transactions (only mine)',
    description: 'Retrieves private transactions for the current user with filtering, sorting, and pagination',
  })
  @ApiQuery({name: 'page', required: false, type: Number, example: 1})
  @ApiQuery({name: 'pageSize', required: false, type: Number, example: 15})
  @ApiQuery({name: 'sort', required: false, type: String, example: '-transactionDate'})
  @ApiQuery({name: 'type', required: false, type: String, example: 'expense'})
  @ApiQuery({name: 'accountId', required: false, type: String, format: 'uuid'})
  @ApiQuery({name: 'q', required: false, type: String, description: 'Search in description'})
  @ApiQuery({name: 'from', required: false, type: String, format: 'date'})
  @ApiQuery({name: 'to', required: false, type: String, format: 'date'})
  @ApiOkResponse({description: 'Private transactions retrieved successfully'})
  @ApiBadRequestResponse({description: 'Invalid query parameters'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard, LicenseGuard)
  @UsePipes(new ZodValidationPipe(getPrivateTransactionsQuerySchema))
  @Get('')
  async getMine(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetPrivateTransactionsQueryDTO,
  ): Promise<GetPrivateTransactionsResponseContract> {
    return await this.privateTransactionsService.find(user.sub, query);
  }

  @ApiOperation({
    summary: 'Delete a private transaction',
    description: 'Deletes a private transaction and reverses the account balance update',
  })
  @ApiParam({
    name: 'id',
    description: 'Private transaction ID',
    type: String,
    format: 'uuid',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({description: 'Private transaction deleted successfully'})
  @ApiBadRequestResponse({description: 'Not allowed to delete this private transaction'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard, LicenseGuard)
  @Delete(':id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id', ParseUUIDPipe) id: string) {
    await this.privateTransactionsService.delete(user.sub, id);
  }
}
