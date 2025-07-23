import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
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
  ApiConflictResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {CategoriesService} from './categories.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {CreateCategoryDTO, UpdateCategoryDTO, createCategorySchema, updateCategorySchema} from '@maya-vault/validation';
import {
  CreateCategorySwaggerDTO,
  UpdateCategorySwaggerDTO,
  CategoryResponseSwaggerDTO,
} from 'src/tools/swagger/categories.swagger.dto';

@ApiTags('Categories')
@Controller({
  version: '1',
  path: 'categories',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new transaction category for a specific household',
  })
  @ApiBody({
    type: CreateCategorySwaggerDTO,
    description: 'Category creation data',
    examples: {
      groceries: {
        summary: 'Groceries Category',
        value: {
          name: 'Groceries',
          householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
      },
      utilities: {
        summary: 'Utilities Category',
        value: {
          name: 'Utilities',
          householdId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  @Post('')
  async createCategory(@Body() dto: CreateCategoryDTO) {
    return await this.categoriesService.createCategory(dto);
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
  @Get('household/:householdId')
  async getCategoriesByHouseholdId(@Param('householdId') householdId: string) {
    return await this.categoriesService.findCategoriesByHouseholdId(householdId);
  }

  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates an existing category by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the category',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({
    type: UpdateCategorySwaggerDTO,
    description: 'Category update data',
    examples: {
      renameCategory: {
        summary: 'Rename Category',
        value: {
          name: 'Food & Dining',
        },
      },
    },
  })
  @ApiOkResponse({
    type: CategoryResponseSwaggerDTO,
    description: 'Category updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiConflictResponse({
    description: 'Category name already exists for this household',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDTO) {
    return await this.categoriesService.updateCategory(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a category',
    description: 'Deletes a category by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the category',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiNoContentResponse({
    description: 'Category deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoriesService.deleteCategory(id);
  }
}
