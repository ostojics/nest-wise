import {
  BudgetAllocationWithCalculationsContract,
  CreateBudgetAllocationDTO,
  createBudgetAllocationSchema,
  GetBudgetAllocationQueryParams,
  getBudgetAllocationQueryParamsSchema,
  UpdateBudgetAllocationDTO,
  updateBudgetAllocationSchema,
} from '@nest-wise/contracts';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {BudgetAllocationService} from './budget-allocation.service';
import {PoliciesService} from 'src/policies/policies.service';

@ApiTags('Household Budget Allocation')
@Controller({version: '1', path: 'households/:householdId/budget-allocation'})
export class HouseholdBudgetAllocationController {
  constructor(
    private readonly budgetAllocationService: BudgetAllocationService,
    private readonly policiesService: PoliciesService,
  ) {}

  @ApiOperation({
    summary: 'Get budget allocation for a household and month',
    description: 'Returns budget allocation record for the specified household and month (defaults to current month)',
  })
  @ApiParam({
    name: 'householdId',
    description: 'Household ID',
    type: String,
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: String,
    description: "Month in format 'YYYY-MM' (defaults to current month)",
    example: '2024-11',
  })
  @ApiOkResponse({
    description: 'Budget allocation retrieved successfully',
  })
  @ApiNotFoundResponse({description: 'Budget allocation not found'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('')
  async getBudgetAllocation(
    @CurrentUser() user: JwtPayload,
    @Param('householdId', ParseUUIDPipe) householdId: string,
    @Query(new ZodValidationPipe(getBudgetAllocationQueryParamsSchema)) query: GetBudgetAllocationQueryParams,
  ): Promise<BudgetAllocationWithCalculationsContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    const allocation = await this.budgetAllocationService.getByHouseholdAndMonth(householdId, query.month);
    if (!allocation) {
      throw new NotFoundException('Alokacija budžeta nije pronađena');
    }

    return allocation;
  }

  @ApiOperation({
    summary: 'Create new budget allocation',
    description: 'Creates a new budget allocation for the specified household and month',
  })
  @ApiParam({
    name: 'householdId',
    description: 'Household ID',
    type: String,
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiCreatedResponse({
    description: 'Budget allocation created successfully',
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('')
  async createBudgetAllocation(
    @CurrentUser() user: JwtPayload,
    @Param('householdId', ParseUUIDPipe) householdId: string,
    @Body(new ZodValidationPipe(createBudgetAllocationSchema)) dto: CreateBudgetAllocationDTO,
  ): Promise<BudgetAllocationWithCalculationsContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    return await this.budgetAllocationService.create(householdId, dto);
  }

  @ApiOperation({
    summary: 'Update existing budget allocation',
    description: 'Updates an existing budget allocation',
  })
  @ApiParam({
    name: 'householdId',
    description: 'Household ID',
    type: String,
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget allocation ID',
    type: String,
    format: 'uuid',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  })
  @ApiOkResponse({
    description: 'Budget allocation updated successfully',
  })
  @ApiNotFoundResponse({description: 'Budget allocation not found'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateBudgetAllocation(
    @CurrentUser() user: JwtPayload,
    @Param('householdId', ParseUUIDPipe) householdId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateBudgetAllocationSchema)) dto: UpdateBudgetAllocationDTO,
  ): Promise<BudgetAllocationWithCalculationsContract> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    // Verify the allocation belongs to the household
    const existing = await this.budgetAllocationService.findById(id);
    if (existing.householdId !== householdId) {
      throw new ForbiddenException('Nemate pristup ovoj alokaciji budžeta');
    }

    return await this.budgetAllocationService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete budget allocation',
    description: 'Deletes an existing budget allocation',
  })
  @ApiParam({
    name: 'householdId',
    description: 'Household ID',
    type: String,
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiParam({
    name: 'id',
    description: 'Budget allocation ID',
    type: String,
    format: 'uuid',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  })
  @ApiNoContentResponse({
    description: 'Budget allocation deleted successfully',
  })
  @ApiNotFoundResponse({description: 'Budget allocation not found'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBudgetAllocation(
    @CurrentUser() user: JwtPayload,
    @Param('householdId', ParseUUIDPipe) householdId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('Nemate pristup ovom domaćinstvu');
    }

    // Verify the allocation belongs to the household
    const existing = await this.budgetAllocationService.findById(id);
    if (existing.householdId !== householdId) {
      throw new ForbiddenException('Nemate pristup ovoj alokaciji budžeta');
    }

    await this.budgetAllocationService.delete(id);
  }
}
