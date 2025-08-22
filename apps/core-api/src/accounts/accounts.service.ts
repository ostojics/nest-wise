import {EditAccountDTO, TransferFundsDTO} from '@maya-vault/contracts';
import {CreateAccountDTO} from '@maya-vault/validation';
import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {Account} from './account.entity';
import {AccountsRepository} from './accounts.repository';
import {DataSource} from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createAccount(accountData: CreateAccountDTO): Promise<Account> {
    const nameExists = await this.accountsRepository.nameExistsForHousehold(accountData.name, accountData.householdId);
    if (nameExists) {
      throw new ConflictException('Account name already exists for this household');
    }

    return await this.accountsRepository.create({
      name: accountData.name,
      type: accountData.type,
      initialBalance: accountData.initialBalance,
      currentBalance: accountData.initialBalance,
      ownerId: accountData.ownerId,
      householdId: accountData.householdId,
    });
  }

  async findAccountById(id: string): Promise<Account> {
    const account = await this.accountsRepository.findById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async findAccountsByHouseholdId(householdId: string): Promise<Account[]> {
    return await this.accountsRepository.findByHouseholdId(householdId);
  }

  async findAllAccounts(): Promise<Account[]> {
    return await this.accountsRepository.findAll();
  }

  async updateAccount(id: string, accountData: EditAccountDTO): Promise<Account> {
    const existingAccount = await this.accountsRepository.findById(id);
    if (!existingAccount) {
      throw new NotFoundException('Account not found');
    }

    if (accountData.name && accountData.name !== existingAccount.name) {
      const nameExists = await this.accountsRepository.nameExistsForHousehold(
        accountData.name,
        existingAccount.householdId,
      );
      if (nameExists) {
        throw new ConflictException('Account name already exists for this household');
      }
    }

    const updatedAccount = await this.accountsRepository.update(id, accountData);
    if (!updatedAccount) {
      throw new NotFoundException('Account not found');
    }

    return updatedAccount;
  }

  async deleteAccount(id: string): Promise<void> {
    const deleted = await this.accountsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Account not found');
    }
  }

  async transferFunds(dto: TransferFundsDTO): Promise<{fromAccount: Account; toAccount: Account}> {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException('fromAccountId and toAccountId must be different');
    }

    const fromAccount = await this.findAccountById(dto.fromAccountId);
    const toAccount = await this.findAccountById(dto.toAccountId);

    if (fromAccount.householdId !== toAccount.householdId) {
      throw new BadRequestException('Accounts must belong to the same household');
    }

    const fromBalance = Number(fromAccount.currentBalance);
    const toBalance = Number(toAccount.currentBalance);
    const amount = Number(dto.amount);

    if (fromBalance < amount) {
      throw new BadRequestException('Insufficient funds for this transfer');
    }

    return await this.dataSource.transaction(async () => {
      const updatedFrom = await this.accountsRepository.update(dto.fromAccountId, {
        currentBalance: fromBalance - amount,
      });
      if (!updatedFrom) {
        throw new NotFoundException('From account not found');
      }

      const updatedTo = await this.accountsRepository.update(dto.toAccountId, {
        currentBalance: toBalance + amount,
      });
      if (!updatedTo) {
        throw new NotFoundException('To account not found');
      }

      return {fromAccount: updatedFrom, toAccount: updatedTo};
    });
  }
}
