import {Body, Controller, Get, Param, Post, UseGuards, UsePipes} from '@nestjs/common';
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
} from '@nestjs/swagger';
import {AccountsService} from './accounts.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {CreateAccountDTO, createAccountSchema} from '@maya-vault/validation';
import {AccountResponseSwaggerDTO, CreateAccountSwaggerDTO} from 'src/tools/swagger/accounts.swagger.dto';

@ApiTags('Accounts')
@Controller({
  version: '1',
  path: 'accounts',
})
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

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
}
