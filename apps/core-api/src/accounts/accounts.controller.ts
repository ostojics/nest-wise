import {
  CreateAccountDTO,
  EditAccountDTO,
  TransferFundsDTO,
  createAccountSchema,
  editAccountSchema,
  transferFundsSchema,
} from '@maya-vault/contracts';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {PoliciesService} from 'src/policies/policies.service';
import {
  AccountResponseSwaggerDTO,
  CreateAccountSwaggerDTO,
  UpdateAccountSwaggerDTO,
  TransferFundsSwaggerDTO,
  TransferFundsResponseSwaggerDTO,
} from 'src/tools/swagger/accounts.swagger.dto';
import {AccountsService} from './accounts.service';

@ApiTags('Accounts')
@Controller({
  version: '1',
  path: 'accounts',
})
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly policiesService: PoliciesService,
  ) {}

  @ApiOperation({
    summary: 'Create a new account',
    description: 'Creates a new financial account for a specific household and owner',
  })
  @ApiBody({
    type: CreateAccountSwaggerDTO,
    description: 'Account creation data',
    examples: {
      checking: {
        summary: 'Checking Account',
        value: {
          name: 'Main Checking',
          type: 'checking',
          variant: 'shared',
          initialBalance: 1000.0,
          ownerId: 'uuid-here',
          householdId: 'uuid-here',
        },
      },
      savings: {
        summary: 'Savings Account',
        value: {
          name: 'Emergency Fund',
          type: 'savings',
          variant: 'private',
          initialBalance: 5000.0,
          ownerId: 'uuid-here',
          householdId: 'uuid-here',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: AccountResponseSwaggerDTO,
    description: 'Account created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  @Post('')
  async createAccount(@Body() dto: CreateAccountDTO) {
    return await this.accountsService.createAccount(dto);
  }

  @ApiOperation({
    summary: 'Get account by ID',
    description: 'Retrieves a specific account by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the account',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    type: AccountResponseSwaggerDTO,
    description: 'Account found successfully',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return await this.accountsService.findAccountById(id);
  }

  @ApiOperation({
    summary: 'Update an account',
    description: 'Updates account name, type, or current balance. User must belong to the account household.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the account',
  })
  @ApiBody({
    type: UpdateAccountSwaggerDTO,
    description: 'Account update data',
  })
  @ApiOkResponse({
    type: AccountResponseSwaggerDTO,
    description: 'Account updated successfully',
  })
  @ApiBadRequestResponse({description: 'Invalid input data'})
  @ApiNotFoundResponse({description: 'Account not found'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(editAccountSchema))
  @Put(':id')
  async updateAccount(@Param('id') id: string, @Body() dto: EditAccountDTO, @CurrentUser() user: JwtPayload) {
    const canUpdate = await this.policiesService.canUserUpdateAccount(user.sub, id);
    if (!canUpdate) {
      throw new ForbiddenException('You cannot update this account');
    }

    return await this.accountsService.updateAccount(id, dto);
  }

  @ApiOperation({
    summary: 'Transfer funds between two accounts',
    description:
      "Transfers funds from one account to another. Requires authentication and membership in the accounts' household.",
  })
  @ApiBody({
    type: TransferFundsSwaggerDTO,
    description: 'Transfer details',
  })
  @ApiOkResponse({
    type: TransferFundsResponseSwaggerDTO,
    description: 'Transfer completed successfully',
  })
  @ApiBadRequestResponse({description: 'Invalid input data or insufficient funds'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(transferFundsSchema))
  @HttpCode(HttpStatus.OK)
  @Post('transfer')
  async transferFunds(@Body() dto: TransferFundsDTO, @CurrentUser() user: JwtPayload) {
    const allowed = await this.policiesService.canUserTransferBetweenAccounts(
      user.sub,
      dto.fromAccountId,
      dto.toAccountId,
    );
    if (!allowed) {
      throw new ForbiddenException('You cannot transfer between these accounts');
    }

    await this.accountsService.transferFunds(dto);
    return {message: 'Transfer completed successfully'};
  }
}
