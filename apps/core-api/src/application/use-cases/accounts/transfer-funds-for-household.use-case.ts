import {Injectable, Inject, BadRequestException, NotFoundException} from '@nestjs/common';
import {TransferFundsDTO} from '@nest-wise/contracts';
import {DataSource} from 'typeorm';
import {IUseCase} from '../base-use-case';
import {Account} from '../../../accounts/account.entity';
import {AccountsService} from '../../../accounts/accounts.service';
import {IAccountRepository, ACCOUNT_REPOSITORY} from '../../../repositories/account.repository.interface';

export interface TransferFundsForHouseholdInput {
  householdId: string;
  dto: TransferFundsDTO;
}

export interface TransferFundsForHouseholdOutput {
  fromAccount: Account;
  toAccount: Account;
}

@Injectable()
export class TransferFundsForHouseholdUseCase
  implements IUseCase<TransferFundsForHouseholdInput, TransferFundsForHouseholdOutput>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountsRepository: IAccountRepository,
    private readonly accountsService: AccountsService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: TransferFundsForHouseholdInput): Promise<TransferFundsForHouseholdOutput> {
    const {householdId, dto} = input;

    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException('Polazni i odredišni račun moraju biti različiti');
    }

    const fromAccount = await this.accountsService.findAccountById(dto.fromAccountId);
    const toAccount = await this.accountsService.findAccountById(dto.toAccountId);

    // Validate both accounts belong to the specified household
    if (fromAccount.householdId !== householdId) {
      throw new BadRequestException('Polazni račun ne pripada navedenom domaćinstvu');
    }
    if (toAccount.householdId !== householdId) {
      throw new BadRequestException('Odredišni račun ne pripada navedenom domaćinstvu');
    }

    if (fromAccount.householdId !== toAccount.householdId) {
      throw new BadRequestException('Računi moraju pripadati istom domaćinstvu');
    }

    const amount = Number(dto.amount);

    // Use domain method to check for sufficient funds
    if (!fromAccount.hasSufficientFunds(amount)) {
      throw new BadRequestException('Nedovoljno sredstava za ovaj transfer');
    }

    return await this.dataSource.transaction(async () => {
      // Use domain methods to update balances
      fromAccount.withdraw(amount);
      toAccount.deposit(amount);

      const updatedFrom = await this.accountsRepository.update(dto.fromAccountId, {
        currentBalance: fromAccount.currentBalance,
      });
      if (!updatedFrom) {
        throw new NotFoundException('Polazni račun nije pronađen');
      }

      const updatedTo = await this.accountsRepository.update(dto.toAccountId, {
        currentBalance: toAccount.currentBalance,
      });
      if (!updatedTo) {
        throw new NotFoundException('Odredišni račun nije pronađen');
      }

      return {fromAccount: updatedFrom, toAccount: updatedTo};
    });
  }
}
