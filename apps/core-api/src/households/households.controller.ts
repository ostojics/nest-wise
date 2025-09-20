import {Controller, Get, Param, UseGuards, Put, Body, Post, UsePipes} from '@nestjs/common';
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
  ApiConflictResponse,
} from '@nestjs/swagger';
import {HouseholdsService} from './households.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {AccountResponseSwaggerDTO} from 'src/tools/swagger/accounts.swagger.dto';
import {HouseholdResponseSwaggerDTO, UpdateHouseholdSwaggerDTO} from 'src/tools/swagger/households.swagger.dto';
import {AccountContract, HouseholdContract} from '@nest-wise/contracts';
import {Category} from 'src/categories/categories.entity';
import {CategoryResponseSwaggerDTO, CreateCategoryHouseholdSwaggerDTO} from 'src/tools/swagger/categories.swagger.dto';
import {
  UpdateHouseholdDTO,
  updateHouseholdSchema,
  CreateCategoryHouseholdDTO,
  createCategoryHouseholdSchema,
} from '@nest-wise/contracts';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {CategoriesService} from 'src/categories/categories.service';
import {CategoryContract} from '@nest-wise/contracts';

@ApiTags('Households')
@Controller({
  version: '1',
  path: 'households',
})
export class HouseholdsController {
  constructor(
    private readonly householdsService: HouseholdsService,
    private readonly categoriesService: CategoriesService,
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
    type: CreateCategoryHouseholdSwaggerDTO,
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
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createCategoryHouseholdSchema))
  @Post(':id/categories')
  async createCategoryForHousehold(
    @Param('id') id: string,
    @Body() dto: CreateCategoryHouseholdDTO,
  ): Promise<CategoryContract> {
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
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateHousehold(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateHouseholdSchema)) updateData: UpdateHouseholdDTO,
  ): Promise<HouseholdContract> {
    return (await this.householdsService.updateHousehold(id, updateData)) as HouseholdContract;
  }
}
