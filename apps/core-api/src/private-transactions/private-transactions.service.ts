import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, DataSource} from 'typeorm';
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
import {PrivateTransactionsRepository} from './private-transactions.repository';

@Injectable()
export class PrivateTransactionsService {
  constructor(
    @InjectRepository(PrivateTransaction)
    private readonly repo: Repository<PrivateTransaction>,
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
    private readonly policiesService: PoliciesService,
    private readonly usersService: UsersService,
    private readonly privateTransactionsRepository: PrivateTransactionsRepository,
  ) {}

  async create(userId: string, dto: CreatePrivateTransactionDTO): Promise<PrivateTransaction> {
    const can = await this.policiesService.canUserUpdateAccount(userId, dto.accountId);
    if (!can) {
      throw new BadRequestException('You cannot create a private transaction for this account/household');
    }

    const user = await this.usersService.findUserById(userId);
    const account = await this.accountsService.findAccountById(dto.accountId);

    if (account.householdId !== user.householdId) {
      throw new NotFoundException('Account not found in your household');
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
        transactionDate: dto.transactionDate,
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
        throw new NotFoundException('Private transaction not found');
      }

      if (tx.userId !== userId) {
        throw new BadRequestException('You cannot delete this private transaction');
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
