import {
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Body,
  Post,
  HttpCode,
  UsePipes,
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
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {HouseholdsService} from './households.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {AccountResponseSwaggerDTO} from 'src/tools/swagger/accounts.swagger.dto';
import {HouseholdResponseSwaggerDTO, UpdateHouseholdSwaggerDTO} from 'src/tools/swagger/households.swagger.dto';
import {AccountContract, HouseholdContract, UserContract, InviteUserDTO, inviteUserSchema} from '@nest-wise/contracts';
import {Category} from 'src/categories/categories.entity';
import {CategoryResponseSwaggerDTO} from 'src/tools/swagger/categories.swagger.dto';
import {UpdateHouseholdDTO, updateHouseholdSchema} from '@nest-wise/contracts';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {UsersService} from 'src/users/users.service';
import {UserResponseSwaggerDTO, InviteUserSwaggerDTO} from 'src/tools/swagger/users.swagger.dto';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {Logger} from 'pino-nestjs';

@ApiTags('Households')
@Controller({
  version: '1',
  path: 'households',
})
export class HouseholdsController {
  constructor(
    private readonly householdsService: HouseholdsService,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
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
  @UseGuards(AuthGuard)
  @Get(':id/users')
  async getUsersByHouseholdId(
    @Param('id') householdId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<UserContract[]> {
    // Ensure user belongs to the household they're trying to access
    const currentUser = await this.usersService.findUserById(user.sub);
    if (currentUser.householdId !== householdId) {
      throw new ForbiddenException('Cannot access users from different household');
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
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(inviteUserSchema))
  @HttpCode(204)
  @Post(':id/invites')
  async inviteUserToHousehold(
    @Param('id') householdId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: InviteUserDTO,
  ): Promise<void> {
    try {
      // Ensure user belongs to the household they're trying to invite to
      const currentUser = await this.usersService.findUserById(user.sub);
      if (currentUser.householdId !== householdId) {
        throw new ForbiddenException('Cannot invite users to different household');
      }

      await this.usersService.inviteUser(householdId, body.email);
      this.logger.log(`User invitation sent to ${body.email} for household ${householdId} by ${currentUser.email}`);
    } catch (error) {
      this.logger.error('Failed to invite user to household', error);
      throw error;
    }
  }
}
