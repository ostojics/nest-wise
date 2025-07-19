import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {HouseholdsService} from './households.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {AccountResponseSwaggerDTO} from 'src/tools/swagger/accounts.swagger.dto';
import {HouseholdResponseSwaggerDTO} from 'src/tools/swagger/households.swagger.dto';

@ApiTags('Households')
@Controller({
  version: '1',
  path: 'households',
})
export class HouseholdsController {
  constructor(private readonly householdsService: HouseholdsService) {}

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
  async getHouseholdById(@Param('id') id: string) {
    return await this.householdsService.findHouseholdById(id);
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
  async getAccountsByHouseholdId(@Param('id') id: string) {
    return await this.householdsService.findAccountsByHouseholdId(id);
  }
}
