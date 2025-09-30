import {UpdateCategoryDTO, updateCategorySchema} from '@nest-wise/contracts';
import {Body, Controller, Delete, ForbiddenException, Param, Put, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {PoliciesService} from 'src/policies/policies.service';
import {CategoryResponseSwaggerDTO, UpdateCategorySwaggerDTO} from 'src/tools/swagger/categories.swagger.dto';
import {CategoriesService} from './categories.service';

@ApiTags('Categories')
@Controller({
  version: '1',
  path: 'categories',
})
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly policiesService: PoliciesService,
  ) {}

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
  @ApiForbiddenResponse({
    description: 'User does not have access to this category',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, LicenseGuard)
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  @Put(':id')
  async updateCategory(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateCategoryDTO) {
    const canUpdate = await this.policiesService.canUserUpdateCategory(user.sub, id);
    if (!canUpdate) {
      throw new ForbiddenException('Nemate pristup ovom resursu');
    }

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
  @UseGuards(AuthGuard, LicenseGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoriesService.deleteCategory(id);
  }
}
