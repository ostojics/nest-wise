import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, DataSource} from 'typeorm';
import {PrivateTransaction} from './private-transactions.entity';
import {CreatePrivateTransactionDTO} from '@maya-vault/contracts';
import {AccountsService} from 'src/accounts/accounts.service';
import {PoliciesService} from 'src/policies/policies.service';
import {TransactionType} from 'src/common/enums/transaction.type.enum';
import {UTCDate} from '@date-fns/utc';

@Injectable()
export class PrivateTransactionsService {
  constructor(
    @InjectRepository(PrivateTransaction)
    private readonly repo: Repository<PrivateTransaction>,
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
    private readonly policiesService: PoliciesService,
  ) {}

  async create(userId: string, dto: CreatePrivateTransactionDTO): Promise<PrivateTransaction> {
    const can = await this.policiesService.canUserUpdateAccount(userId, dto.accountId);
    if (!can) {
      throw new BadRequestException('You cannot create a private transaction for this account/household');
    }

    const account = await this.accountsService.findAccountById(dto.accountId);
    if (account.householdId !== dto.householdId) {
      throw new NotFoundException('Account not found in specified household');
    }

    if (dto.type === 'expense' && Number(account.currentBalance) < dto.amount) {
      throw new BadRequestException('Insufficient funds for this expense');
    }

    return await this.dataSource.transaction(async (manager) => {
      const created = await manager.getRepository(PrivateTransaction).save({
        householdId: dto.householdId,
        accountId: dto.accountId,
        amount: dto.amount,
        type: dto.type as TransactionType,
        description: dto.description,
        transactionDate: new UTCDate(dto.transactionDate),
      });

      const current = Number(account.currentBalance);
      const newBalance = dto.type === 'income' ? current + dto.amount : current - dto.amount;
      await this.accountsService.updateAccount(dto.accountId, {currentBalance: newBalance});

      return created;
    });
  }
}
