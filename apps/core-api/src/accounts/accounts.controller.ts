import {Body, Controller, Get, Param, Post, UseGuards, UsePipes} from '@nestjs/common';
import {AccountsService} from './accounts.service';
import {AuthGuard} from 'src/common/guards/auth.guard';
import {ZodValidationPipe} from 'src/lib/pipes/zod.vallidation.pipe';
import {CreateAccountDTO, createAccountSchema} from '@maya-vault/validation';

@Controller({
  version: '1',
  path: 'accounts',
})
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  @Post('')
  async createAccount(@Body() dto: CreateAccountDTO) {
    return await this.accountsService.createAccount(dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return await this.accountsService.findAccountById(id);
  }
}
