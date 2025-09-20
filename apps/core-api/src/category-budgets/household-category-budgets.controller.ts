import {
  CategoryBudgetWithCurrentAmountContract,
  GetCategoryBudgetsQueryParams,
  getCategoryBudgetsQueryParamsSchema,
} from '@nest-wise/contracts';
import {Controller, ForbiddenException, Get, Param, ParseUUIDPipe, Query, UseGuards} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import {CategoryBudgetWithCurrentAmountResponseSwaggerDTO} from 'src/tools/swagger/category-budgets.swagger.dto';
import {CategoryBudgetsService} from './category-budgets.service';
import {PoliciesService} from 'src/policies/policies.service';

@ApiTags('Household Category Budgets')
@Controller({version: '1', path: 'households/:householdId/category-budgets'})
export class HouseholdCategoryBudgetsController {
  constructor(
    private readonly categoryBudgetsService: CategoryBudgetsService,
    private readonly policiesService: PoliciesService,
  ) {}

  @ApiOperation({
    summary: 'Get category budgets for a household and month',
    description: 'Returns category budget records for the specified household and month',
  })
  @ApiParam({
    name: 'householdId',
    description: 'Household ID',
    type: String,
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({name: 'month', required: true, type: String, description: "Month in format 'YYYY-MM'", example: '2025-09'})
  @ApiOkResponse({
    description: 'Budgets retrieved successfully',
    type: [CategoryBudgetWithCurrentAmountResponseSwaggerDTO],
  })
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('')
  async getCategoryBudgetsByHousehold(
    @CurrentUser() user: JwtPayload,
    @Param('householdId', ParseUUIDPipe) householdId: string,
    @Query(new ZodValidationPipe(getCategoryBudgetsQueryParamsSchema)) query: GetCategoryBudgetsQueryParams,
  ): Promise<CategoryBudgetWithCurrentAmountContract[]> {
    // Check if user has access to this household
    const canAccess = await this.policiesService.canUserAccessHousehold(user.sub, householdId);
    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this household');
    }

    return await this.categoryBudgetsService.getCategoryBudgetsForHousehold(householdId, query.month);
  }
}
