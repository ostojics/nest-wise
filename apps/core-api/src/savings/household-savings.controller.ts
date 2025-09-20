import {Controller, Get, UseGuards, Param} from '@nestjs/common';
import {SavingsService} from './savings.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {SavingsTrendPointContract} from '@nest-wise/contracts';
import {SavingsTrendPointSwaggerDTO} from 'src/tools/swagger/savings.swagger.dto';

@ApiTags('Households')
@Controller({
  version: '1',
  path: 'households/:householdId/savings',
})
export class HouseholdSavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @ApiOperation({
    summary: 'Get household savings trend (last 12 months)',
    description: 'Returns month-by-month household savings for the last 12 months',
  })
  @ApiParam({
    name: 'householdId',
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
  @Get('trend')
  async getSavingsTrendByHouseholdId(@Param('householdId') householdId: string): Promise<SavingsTrendPointContract[]> {
    return await this.savingsService.getSavingsTrend(householdId);
  }
}
