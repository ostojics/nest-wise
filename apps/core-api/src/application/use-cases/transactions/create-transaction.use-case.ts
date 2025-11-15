import {Injectable, Inject, BadRequestException} from '@nestjs/common';
import {CreateTransactionDTO} from '@nest-wise/contracts';
import {DataSource} from 'typeorm';
import {IUseCase} from '../base-use-case';
import {Transaction} from '../../../transactions/transaction.entity';
import {AccountsService} from '../../../accounts/accounts.service';
import {TransactionType} from '../../../common/enums/transaction.type.enum';
import {ITransactionRepository, TRANSACTION_REPOSITORY} from '../../../repositories/transaction.repository.interface';

export interface CreateTransactionInput {
  transactionData: CreateTransactionDTO;
}

@Injectable()
export class CreateTransactionUseCase implements IUseCase<CreateTransactionInput, Transaction> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
    private readonly accountsService: AccountsService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    const {transactionData} = input;

    return await this.dataSource.transaction(async () => {
      const account = await this.accountsService.findAccountById(transactionData.accountId);

      if (transactionData.type === 'expense' && Number(account.currentBalance) < transactionData.amount) {
        throw new BadRequestException('Nedovoljno sredstava za ovaj rashod');
      }

      if (transactionData.type === 'income') {
        transactionData.categoryId = null;
      }

      const transaction = await this.transactionsRepository.create(transactionData);

      await this.updateBalance(
        transactionData.accountId,
        transactionData.amount,
        transactionData.type as TransactionType,
      );

      return transaction;
    });
  }

  private async updateBalance(accountId: string, amount: number, type: TransactionType): Promise<void> {
    const account = await this.accountsService.findAccountById(accountId);

    const currentBalance = Number(account.currentBalance);
    let newBalance = currentBalance;

    if (type === TransactionType.INCOME) {
      newBalance += amount;
    } else {
      newBalance -= amount;
    }

    await this.accountsService.updateAccount(accountId, {
      currentBalance: newBalance,
    });
  }
}
