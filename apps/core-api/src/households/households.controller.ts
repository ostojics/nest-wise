import {
  HouseholdContract,
  AccountContract,
  createCategorySchema,
  CreateCategoryDTO,
  CategoryContract,
  updateHouseholdSchema,
  UpdateHouseholdDTO,
  transferFundsSchema,
  TransferFundsDTO,
  UserContract,
  inviteUserSchema,
  InviteUserDTO,
  createAccountHouseholdScopedSchema,
  CreateAccountHouseholdScopedDTO,
} from '@nest-wise/contracts';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Query,
  UsePipes,
  Post,
  Body,
  Put,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {Logger} from 'pino-nestjs';
import {AccountsService} from 'src/accounts/accounts.service';
import {Category} from 'src/categories/categories.entity';
import {CategoriesService} from 'src/categories/categories.service';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {PoliciesService} from 'src/policies/policies.service';
import {
  AccountResponseSwaggerDTO,
  CreateAccountHouseholdScopedSwaggerDTO,
  TransferFundsSwaggerDTO,
  TransferFundsResponseSwaggerDTO,
} from 'src/tools/swagger/accounts.swagger.dto';
import {UserResponseSwaggerDTO} from 'src/tools/swagger/auth.swagger.dto';
import {CategoryResponseSwaggerDTO, CreateCategorySwaggerDTO} from 'src/tools/swagger/categories.swagger.dto';
import {HouseholdResponseSwaggerDTO, UpdateHouseholdSwaggerDTO} from 'src/tools/swagger/households.swagger.dto';
import {InviteUserSwaggerDTO} from 'src/tools/swagger/users.swagger.dto';
import {UsersService} from 'src/users/users.service';
import {HouseholdsService} from './households.service';

@ApiTags('Households')
@Controller({
  version: '1',
  path: 'households',
})
export class HouseholdsController {
  constructor(
    private readonly householdsService: HouseholdsService,
    private readonly categoriesService: CategoriesService,
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
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
  @UseGuards(AuthGuard, LicenseGuard)
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
  @ApiQuery({
    name: 'active',
    required: false,
    type: 'boolean',
    description: 'Filter accounts by active status (true=active, false=inactive). If omitted, returns all accounts.',
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
  @UseGuards(AuthGuard, LicenseGuard)
  @Get(':id/accounts')
  async getAccountsByHouseholdId(
    @Param('id') id: string,
    @Query('active') active?: string,
  ): Promise<AccountContract[]> {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return (await this.householdsService.findAccountsByHouseholdId(id, {isActive})) as AccountContract[];
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
  @UseGuards(AuthGuard, LicenseGuard)
  @Get(':id/categories')
  async getCategoriesByHouseholdId(@Param('id') id: string): Promise<Category[]> {
    return await this.householdsService.findCategoriesByHouseholdId(id);
  }

  @ApiOperation({
    summary: 'Create a new category for household',
    description: 'Creates a new transaction category for a specific household',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({
    type: CreateCategorySwaggerDTO,
    description: 'Category creation data',
    examples: {
      groceries: {
        summary: 'Groceries Category',
        value: {
          name: 'Groceries',
        },
      },
      utilities: {
        summary: 'Utilities Category',
        value: {
          name: 'Utilities',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: CategoryResponseSwaggerDTO,
    description: 'Category created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiConflictResponse({
    description: 'Category name already exists for this household',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, LicenseGuard)
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  @Post(':id/categories')
  async createCategoryForHousehold(@Param('id') id: string, @Body() dto: CreateCategoryDTO): Promise<CategoryContract> {
    return (await this.categoriesService.createCategoryForHousehold(id, dto)) as CategoryContract;
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
  @UseGuards(AuthGuard, LicenseGuard)
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
  @UseGuards(AuthGuard, LicenseGuard)
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
  @UseGuards(AuthGuard, LicenseGuard)
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
      throw new ForbiddenException('Ne možete prebacivati sredstva između ovih računa');
    }

    await this.accountsService.transferFundsForHousehold(householdId, dto);
    return {message: 'Transfer completed successfully'};
  }

  @ApiOperation({
    summary: 'Get users in household',
    description: 'Retrieves all users that belong to the specified household',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiOkResponse({
    type: [UserResponseSwaggerDTO],
    description: 'Users retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Household not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, LicenseGuard)
  @Get(':id/users')
  async getUsersByHouseholdId(
    @Param('id') householdId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<UserContract[]> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nije dozvoljen pristup korisnicima iz drugog domaćinstva');
    }

    return (await this.usersService.findUsersByHouseholdId(householdId)) as UserContract[];
  }

  @ApiOperation({
    summary: 'Invite user to household',
    description: 'Invites a user to the specified household',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiBody({
    type: InviteUserSwaggerDTO,
    description: 'Email address of the user to invite',
  })
  @ApiNoContentResponse({
    description: 'Invite sent successfully',
  })
  @ApiNotFoundResponse({
    description: 'Household not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, LicenseGuard)
  @UsePipes(new ZodValidationPipe(inviteUserSchema))
  @HttpCode(204)
  @Post(':id/invites')
  async inviteUserToHousehold(
    @Param('id') householdId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: InviteUserDTO,
  ): Promise<void> {
    try {
      const canInvite = await this.policiesService.canUserInviteToHousehold(user.sub, householdId);
      if (!canInvite) {
        throw new ForbiddenException('Nije dozvoljeno pozivanje korisnika u drugo domaćinstvo');
      }

      await this.usersService.inviteUser(householdId, body.email);

      const currentUser = await this.usersService.findUserById(user.sub);
      this.logger.log(`User invitation sent to ${body.email} for household ${householdId} by ${currentUser.email}`);
    } catch (error) {
      this.logger.error('Failed to invite user to household', error);
      throw error;
    }
  }
}
