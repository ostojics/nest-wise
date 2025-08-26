import {
  CategoryBudgetContract,
  GetCategoryBudgetsQueryParams,
  getCategoryBudgetsQueryParamsSchema,
} from '@maya-vault/contracts';
import {Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
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
import {
  CategoryBudgetResponseSwaggerDTO,
  EditCategoryBudgetSwaggerDTO,
} from 'src/tools/swagger/category-budgets.swagger.dto';
import {CategoryBudgetsService} from './category-budgets.service';
import {EditCategoryBudgetDTO, editCategoryBudgetSchema} from '@maya-vault/contracts';

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

  @ApiOperation({summary: 'Update a category budget planned amount'})
  @ApiParam({name: 'id', description: 'Category budget ID', type: String, format: 'uuid'})
  @ApiBody({type: EditCategoryBudgetSwaggerDTO})
  @ApiOkResponse({description: 'Category budget updated', type: CategoryBudgetResponseSwaggerDTO})
  @ApiBadRequestResponse({description: 'Invalid input'})
  @ApiNotFoundResponse({description: 'Category budget not found'})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(editCategoryBudgetSchema))
  @Patch(':id')
  async updateCategoryBudget(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EditCategoryBudgetDTO,
  ): Promise<CategoryBudgetContract> {
    return await this.categoryBudgetsService.updateCategoryBudget(user.sub, id, dto);
  }
}
