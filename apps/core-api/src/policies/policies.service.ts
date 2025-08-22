import {Injectable} from '@nestjs/common';
import {AccountsService} from 'src/accounts/accounts.service';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) {}

  async canUserUpdateAccount(userId: string, accountId: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    const account = await this.accountsService.findAccountById(accountId);
    return user.householdId === account.householdId;
  }
}
