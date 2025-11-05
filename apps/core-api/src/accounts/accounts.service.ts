import {EditAccountDTO, CreateAccountHouseholdScopedDTO, TransferFundsDTO} from '@nest-wise/contracts';
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

  // Household-scoped version where householdId comes from path parameter
  async createAccountForHousehold(householdId: string, accountData: CreateAccountHouseholdScopedDTO): Promise<Account> {
    const nameExists = await this.accountsRepository.nameExistsForHousehold(accountData.name, householdId);
    if (nameExists) {
      throw new ConflictException('Naziv računa već postoji u ovom domaćinstvu');
    }

    return await this.accountsRepository.create({
      name: accountData.name,
      type: accountData.type,
      initialBalance: accountData.initialBalance,
      currentBalance: accountData.initialBalance,
      ownerId: accountData.ownerId,
      householdId: householdId,
    });
  }

  async findAccountById(id: string): Promise<Account> {
    const account = await this.accountsRepository.findById(id);
    if (!account) {
      throw new NotFoundException('Račun nije pronađen');
    }
    return account;
  }

  async findAccountsByHouseholdId(householdId: string, options?: {isActive?: boolean}): Promise<Account[]> {
    return await this.accountsRepository.findByHouseholdId(householdId, options);
  }

  async findAllAccounts(): Promise<Account[]> {
    return await this.accountsRepository.findAll();
  }

  async updateAccount(id: string, accountData: EditAccountDTO): Promise<Account> {
    const existingAccount = await this.accountsRepository.findById(id);
    if (!existingAccount) {
      throw new NotFoundException('Račun nije pronađen');
    }

    if (accountData.name && accountData.name !== existingAccount.name) {
      const nameExists = await this.accountsRepository.nameExistsForHousehold(
        accountData.name,
        existingAccount.householdId,
      );
      if (nameExists) {
        throw new ConflictException('Naziv računa već postoji u ovom domaćinstvu');
      }
    }

    const updatedAccount = await this.accountsRepository.update(id, accountData);
    if (!updatedAccount) {
      throw new NotFoundException('Račun nije pronađen');
    }

    return updatedAccount;
  }

  async deleteAccount(id: string): Promise<void> {
    const deleted = await this.accountsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Račun nije pronađen');
    }
  }

  async activateAccount(id: string): Promise<Account> {
    const existingAccount = await this.accountsRepository.findById(id);
    if (!existingAccount) {
      throw new NotFoundException('Račun nije pronađen');
    }

    const updatedAccount = await this.accountsRepository.update(id, {isActive: true});
    if (!updatedAccount) {
      throw new NotFoundException('Račun nije pronađen');
    }

    return updatedAccount;
  }

  async deactivateAccount(id: string): Promise<Account> {
    const existingAccount = await this.accountsRepository.findById(id);
    if (!existingAccount) {
      throw new NotFoundException('Račun nije pronađen');
    }

    const updatedAccount = await this.accountsRepository.update(id, {isActive: false});
    if (!updatedAccount) {
      throw new NotFoundException('Račun nije pronađen');
    }

    return updatedAccount;
  }

  // Household-scoped version that validates accounts belong to the specified household
  async transferFundsForHousehold(
    householdId: string,
    dto: TransferFundsDTO,
  ): Promise<{fromAccount: Account; toAccount: Account}> {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException('Polazni i odredišni račun moraju biti različiti');
    }

    const fromAccount = await this.findAccountById(dto.fromAccountId);
    const toAccount = await this.findAccountById(dto.toAccountId);

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

    const fromBalance = Number(fromAccount.currentBalance);
    const toBalance = Number(toAccount.currentBalance);
    const amount = Number(dto.amount);

    if (fromBalance < amount) {
      throw new BadRequestException('Nedovoljno sredstava za ovaj transfer');
    }

    return await this.dataSource.transaction(async () => {
      const updatedFrom = await this.accountsRepository.update(dto.fromAccountId, {
        currentBalance: fromBalance - amount,
      });
      if (!updatedFrom) {
        throw new NotFoundException('Polazni račun nije pronađen');
      }

      const updatedTo = await this.accountsRepository.update(dto.toAccountId, {
        currentBalance: toBalance + amount,
      });
      if (!updatedTo) {
        throw new NotFoundException('Odredišni račun nije pronađen');
      }

      return {fromAccount: updatedFrom, toAccount: updatedTo};
    });
  }
}
