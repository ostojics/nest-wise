import {Controller, Get, Param, UseGuards, Put, Body} from '@nestjs/common';
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
} from '@nestjs/swagger';
import {HouseholdsService} from './households.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {AccountResponseSwaggerDTO} from 'src/tools/swagger/accounts.swagger.dto';
import {HouseholdResponseSwaggerDTO, UpdateHouseholdSwaggerDTO} from 'src/tools/swagger/households.swagger.dto';
import {AccountContract, HouseholdContract, SavingsTrendPointContract} from '@nest-wise/contracts';
import {Category} from 'src/categories/categories.entity';
import {CategoryResponseSwaggerDTO} from 'src/tools/swagger/categories.swagger.dto';
import {UpdateHouseholdDTO, updateHouseholdSchema} from '@nest-wise/contracts';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {SavingsService} from 'src/savings/savings.service';
import {SavingsTrendPointSwaggerDTO} from 'src/tools/swagger/savings.swagger.dto';

@ApiTags('Households')
@Controller({
  version: '1',
  path: 'households',
})
export class HouseholdsController {
  constructor(
    private readonly householdsService: HouseholdsService,
    private readonly savingsService: SavingsService,
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
    summary: 'Get household savings trend (last 12 months)',
    description: 'Returns month-by-month household savings for the last 12 months',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the household',
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  })
  @ApiOkResponse({
    type: [SavingsTrendPointSwaggerDTO],
    description: 'Savings trend computed successfully',
  })
  @ApiNotFoundResponse({
    description: 'Household not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id/savings/trend')
  async getSavingsTrendByHouseholdId(@Param('id') id: string): Promise<SavingsTrendPointContract[]> {
    return await this.savingsService.getSavingsTrend(id);
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
