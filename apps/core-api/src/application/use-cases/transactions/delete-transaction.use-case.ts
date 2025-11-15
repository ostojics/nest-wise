import {Injectable, Inject, NotFoundException} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {EventEmitter2} from '@nestjs/event-emitter';
import {IUseCase} from '../base-use-case';
import {AccountsService} from '../../../accounts/accounts.service';
import {TransactionType} from '../../../common/enums/transaction.type.enum';
import {ITransactionRepository, TRANSACTION_REPOSITORY} from '../../../repositories/transaction.repository.interface';
import {TransactionDeletedEvent, AccountBalanceChangedEvent} from '../../../domain/events';

export interface DeleteTransactionInput {
  id: string;
}

@Injectable()
export class DeleteTransactionUseCase implements IUseCase<DeleteTransactionInput, void> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
    private readonly accountsService: AccountsService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: DeleteTransactionInput): Promise<void> {
    const {id} = input;

    return await this.dataSource.transaction(async () => {
      const existingTransaction = await this.transactionsRepository.findById(id);
      if (!existingTransaction) {
        throw new NotFoundException('Transakcija nije pronađena');
      }

      const account = await this.accountsService.findAccountById(existingTransaction.accountId);
      const oldBalance = Number(account.currentBalance);
      let newBalance = oldBalance;
      const transactionAmount = Number(existingTransaction.amount);

      if (existingTransaction.type === TransactionType.INCOME) {
        newBalance -= transactionAmount;
      } else {
        newBalance += transactionAmount;
      }

      await this.accountsService.updateAccount(existingTransaction.accountId, {
        currentBalance: newBalance,
      });

      const deleted = await this.transactionsRepository.delete(id);
      if (!deleted) {
        throw new NotFoundException('Transakcija nije pronađena');
      }

      // Emit events
      this.eventEmitter.emit(
        'transaction.deleted',
        new TransactionDeletedEvent(
          existingTransaction.id,
          existingTransaction.accountId,
          existingTransaction.householdId,
          existingTransaction.amount,
          existingTransaction.type,
          existingTransaction.categoryId,
        ),
      );

      this.eventEmitter.emit(
        'account.balance.changed',
        new AccountBalanceChangedEvent(
          existingTransaction.accountId,
          existingTransaction.householdId,
          oldBalance,
          newBalance,
          'transaction',
          {transactionId: existingTransaction.id, deleted: true},
        ),
      );
    });
  }
}
