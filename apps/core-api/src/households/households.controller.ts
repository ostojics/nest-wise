import {
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Body,
  Post,
  UsePipes,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import {HouseholdsService} from './households.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {
  AccountResponseSwaggerDTO,
  CreateAccountHouseholdScopedSwaggerDTO,
  TransferFundsSwaggerDTO,
  TransferFundsResponseSwaggerDTO,
} from 'src/tools/swagger/accounts.swagger.dto';
import {HouseholdResponseSwaggerDTO, UpdateHouseholdSwaggerDTO} from 'src/tools/swagger/households.swagger.dto';
import {
  AccountContract,
  HouseholdContract,
  CreateAccountHouseholdScopedDTO,
  createAccountHouseholdScopedSchema,
  TransferFundsDTO,
  transferFundsSchema,
} from '@nest-wise/contracts';
import {Category} from 'src/categories/categories.entity';
import {CategoryResponseSwaggerDTO} from 'src/tools/swagger/categories.swagger.dto';
import {UpdateHouseholdDTO, updateHouseholdSchema} from '@nest-wise/contracts';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {AccountsService} from 'src/accounts/accounts.service';
import {PoliciesService} from 'src/policies/policies.service';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';

@ApiTags('Households')
@Controller({
  version: '1',
  path: 'households',
})
export class HouseholdsController {
  constructor(
    private readonly householdsService: HouseholdsService,
    private readonly accountsService: AccountsService,
    private readonly policiesService: PoliciesService,
  ) {}

  @ApiOperation({
    summary: 'Get household by ID',
    description: 'Retrieves a household by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiOkResponse({
    type: HouseholdResponseSwaggerDTO,
    description: 'Household found successfully',
  })
  @ApiNotFoundResponse({
    description: 'Household not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getHouseholdById(@Param('id') id: string): Promise<HouseholdContract> {
    return (await this.householdsService.findHouseholdById(id)) as HouseholdContract;
  }

  @ApiOperation({
    summary: 'Get accounts by household ID',
    description: 'Retrieves all accounts belonging to a specific household',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiOkResponse({
    type: [AccountResponseSwaggerDTO],
    description: 'Accounts found successfully',
  })
  @ApiNotFoundResponse({
    description: 'Household not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id/accounts')
  async getAccountsByHouseholdId(@Param('id') id: string): Promise<AccountContract[]> {
    return (await this.householdsService.findAccountsByHouseholdId(id)) as AccountContract[];
  }

  @ApiOperation({
    summary: 'Get categories by household ID',
    description: 'Retrieves all categories for a specific household',
  })
  @ApiParam({
    name: 'householdId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    type: [CategoryResponseSwaggerDTO],
    description: 'Categories retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id/categories')
  async getCategoriesByHouseholdId(@Param('id') id: string): Promise<Category[]> {
    return await this.householdsService.findCategoriesByHouseholdId(id);
  }

  @ApiOperation({
    summary: 'Update household',
    description: 'Updates an existing household with new information',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiBody({
    type: UpdateHouseholdSwaggerDTO,
    description: 'Household update data',
  })
  @ApiOkResponse({
    type: HouseholdResponseSwaggerDTO,
    description: 'Household updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Household not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateHousehold(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateHouseholdSchema)) updateData: UpdateHouseholdDTO,
  ): Promise<HouseholdContract> {
    return (await this.householdsService.updateHousehold(id, updateData)) as HouseholdContract;
  }

  @ApiOperation({
    summary: 'Create a new account for household',
    description: 'Creates a new financial account within a specific household',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiBody({
    type: CreateAccountHouseholdScopedSwaggerDTO,
    description: 'Account creation data',
    examples: {
      checking: {
        summary: 'Checking Account',
        value: {
          name: 'Main Checking',
          type: 'checking',
          initialBalance: 1000.0,
          ownerId: 'uuid-here',
        },
      },
      savings: {
        summary: 'Savings Account',
        value: {
          name: 'Emergency Fund',
          type: 'savings',
          initialBalance: 5000.0,
          ownerId: 'uuid-here',
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
  @UsePipes(new ZodValidationPipe(createAccountHouseholdScopedSchema))
  @Post(':id/accounts')
  async createAccountForHousehold(
    @Param('id') householdId: string,
    @Body() dto: CreateAccountHouseholdScopedDTO,
  ): Promise<AccountContract> {
    return (await this.accountsService.createAccountForHousehold(householdId, dto)) as AccountContract;
  }

  @ApiOperation({
    summary: 'Transfer funds between accounts in household',
    description:
      'Transfers funds from one account to another within the same household. Requires authentication and membership in the household.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
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
  @Post(':id/accounts/transfer')
  async transferFundsForHousehold(
    @Param('id') householdId: string,
    @Body() dto: TransferFundsDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    const allowed = await this.policiesService.canUserTransferBetweenAccounts(
      user.sub,
      dto.fromAccountId,
      dto.toAccountId,
    );
    if (!allowed) {
      throw new ForbiddenException('You cannot transfer between these accounts');
    }

    await this.accountsService.transferFundsForHousehold(householdId, dto);
    return {message: 'Transfer completed successfully'};
  }
}
