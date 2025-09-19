import {Controller, Get, UseGuards} from '@nestjs/common';
import {SavingsService} from './savings.service';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {CurrentUser} from 'src/common/decorators/current-user.decorator';
import {UsersService} from 'src/users/users.service';
import {JwtPayload} from 'src/common/interfaces/jwt.payload.interface';
import {SavingsTrendPointContract} from '@nest-wise/contracts';
import {SavingsTrendPointSwaggerDTO} from 'src/tools/swagger/savings.swagger.dto';

@ApiTags('Savings')
@Controller({
  version: '1',
  path: 'savings',
})
export class SavingsController {
  constructor(
    private readonly savingsService: SavingsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Get household savings trend (last 12 months)',
    description:
      'Returns month-by-month household savings for the last 12 months. Household inferred from current user.',
  })
  @ApiOkResponse({description: 'Savings trend computed successfully', type: [SavingsTrendPointSwaggerDTO]})
  @ApiUnauthorizedResponse({description: 'Authentication required'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('trend')
  async getSavingsTrend(@CurrentUser() user: JwtPayload): Promise<SavingsTrendPointContract[]> {
    const me = await this.usersService.findUserById(user.sub);
    return await this.savingsService.getSavingsTrend(me.householdId);
  }
}
