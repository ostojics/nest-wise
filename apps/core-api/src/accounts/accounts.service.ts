import {EditAccountDTO} from '@maya-vault/contracts';
import {CreateAccountDTO} from '@maya-vault/validation';
import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {Account} from './account.entity';
import {AccountsRepository} from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

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
}
