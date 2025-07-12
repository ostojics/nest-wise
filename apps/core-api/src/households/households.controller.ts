import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {HouseholdsService} from './households.service';
import {AuthGuard} from 'src/common/guards/auth.guard';

@Controller({
  version: '1',
  path: 'households',
})
export class HouseholdsController {
  constructor(private readonly householdsService: HouseholdsService) {}

  @UseGuards(AuthGuard)
  @Get(':id/accounts')
  async getAccountsByHouseholdId(@Param('id') id: string) {
    return await this.householdsService.findAccountsByHouseholdId(id);
  }
}
