import {BadRequestException, Injectable, NotFoundException, Inject} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {PrivateTransaction} from './private-transactions.entity';
import {
  CreatePrivateTransactionDTO,
  GetPrivateTransactionsQueryDTO,
  GetPrivateTransactionsResponseContract,
} from '@nest-wise/contracts';
import {AccountsService} from 'src/accounts/accounts.service';
import {PoliciesService} from 'src/policies/policies.service';
import {UsersService} from 'src/users/users.service';
import {TransactionType} from 'src/common/enums/transaction.type.enum';
import {
  IPrivateTransactionRepository,
  PRIVATE_TRANSACTION_REPOSITORY,
} from '../repositories/private-transaction.repository.interface';

@Injectable()
export class PrivateTransactionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
    private readonly policiesService: PoliciesService,
    private readonly usersService: UsersService,
    @Inject(PRIVATE_TRANSACTION_REPOSITORY)
    private readonly privateTransactionsRepository: IPrivateTransactionRepository,
  ) {}

  async create(userId: string, dto: CreatePrivateTransactionDTO): Promise<PrivateTransaction> {
    const can = await this.policiesService.canUserUpdateAccount(userId, dto.accountId);
    if (!can) {
      throw new BadRequestException('Ne možete kreirati privatnu transakciju za ovaj račun/domaćinstvo');
    }

    const user = await this.usersService.findUserById(userId);
    const account = await this.accountsService.findAccountById(dto.accountId);

    if (account.householdId !== user.householdId) {
      throw new NotFoundException('Račun nije pronađen u vašem domaćinstvu');
    }

    if (dto.type === 'expense' && Number(account.currentBalance) < dto.amount) {
      throw new BadRequestException('Insufficient funds for this expense');
    }

    return await this.dataSource.transaction(async () => {
      const created = await this.privateTransactionsRepository.create({
        householdId: user.householdId,
        accountId: dto.accountId,
        userId,
        amount: dto.amount,
        type: dto.type as TransactionType,
        description: dto.description,
        transactionDate: new Date(dto.transactionDate),
      });

      const current = Number(account.currentBalance);
      const newBalance = dto.type === 'income' ? current + dto.amount : current - dto.amount;
      await this.accountsService.updateAccount(dto.accountId, {currentBalance: newBalance});

      return created;
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    return await this.dataSource.transaction(async () => {
      const tx = await this.privateTransactionsRepository.findById(id);
      if (!tx) {
        throw new NotFoundException('Privatna transakcija nije pronađena');
      }

      if (tx.userId !== userId) {
        throw new BadRequestException('Ne možete obrisati ovu privatnu transakciju');
      }

      const account = await this.accountsService.findAccountById(tx.accountId);
      const current = Number(account.currentBalance);
      const amount = Number(tx.amount);

      const newBalance = tx.type === TransactionType.INCOME ? current - amount : current + amount;
      await this.accountsService.updateAccount(tx.accountId, {currentBalance: newBalance});

      await this.privateTransactionsRepository.delete(id);
    });
  }

  async find(userId: string, query: GetPrivateTransactionsQueryDTO): Promise<GetPrivateTransactionsResponseContract> {
    return await this.privateTransactionsRepository.findWithFilters(userId, query);
  }
}
