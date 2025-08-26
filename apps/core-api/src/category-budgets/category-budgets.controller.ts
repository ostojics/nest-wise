import {
  CategoryBudgetContract,
  GetCategoryBudgetsQueryParams,
  getCategoryBudgetsQueryParamsSchema,
} from '@maya-vault/contracts';
import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {CategoryBudgetResponseSwaggerDTO} from 'src/tools/swagger/category-budgets.swagger.dto';
import {CategoryBudgetsService} from './category-budgets.service';

@ApiTags('Category Budgets')
@Controller({version: '1', path: 'category-budgets'})
export class CategoryBudgetsController {
  constructor(private readonly categoryBudgetsService: CategoryBudgetsService) {}

  @ApiOperation({
    summary: 'Get category budgets for a month',
    description: 'Returns category budget records for the authenticated household and specified month',
  })
  @ApiQuery({name: 'month', required: true, type: String, description: "Month in format 'YYYY-MM'", example: '2025-09'})
  @ApiOkResponse({description: 'Budgets retrieved successfully', type: [CategoryBudgetResponseSwaggerDTO]})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('')
  async getCategoryBudgets(
    @CurrentUser() user: JwtPayload,
    @Query(new ZodValidationPipe(getCategoryBudgetsQueryParamsSchema)) query: GetCategoryBudgetsQueryParams,
  ): Promise<CategoryBudgetContract[]> {
    return await this.categoryBudgetsService.getCategoryBudgetsForMonth(user.sub, query.month);
  }
}
