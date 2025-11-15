import {Injectable, Inject, NotFoundException, BadRequestException} from '@nestjs/common';
import {UpdateTransactionDTO} from '@nest-wise/contracts';
import {DataSource} from 'typeorm';
import {IUseCase} from '../base-use-case';
import {Transaction} from '../../../transactions/transaction.entity';
import {AccountsService} from '../../../accounts/accounts.service';
import {TransactionType} from '../../../common/enums/transaction.type.enum';
import {ITransactionRepository, TRANSACTION_REPOSITORY} from '../../../repositories/transaction.repository.interface';

export interface UpdateTransactionInput {
  id: string;
  transactionData: UpdateTransactionDTO;
}

@Injectable()
export class UpdateTransactionUseCase implements IUseCase<UpdateTransactionInput, Transaction> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
    private readonly accountsService: AccountsService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: UpdateTransactionInput): Promise<Transaction> {
    const {id, transactionData} = input;

    return await this.dataSource.transaction(async () => {
      const existingTransaction = await this.transactionsRepository.findById(id);
      if (!existingTransaction) {
        throw new NotFoundException('Transakcija nije pronađena');
      }

      // Handle category changes based on type
      if (transactionData.type === 'income') {
        transactionData.categoryId = null;
      }

      const oldAmount = Number(existingTransaction.amount);
      const oldType = existingTransaction.type;
      const oldAccountId = existingTransaction.accountId;

      const newAmount = transactionData.amount !== undefined ? Number(transactionData.amount) : oldAmount;
      const newType = transactionData.type ? (transactionData.type as TransactionType) : oldType;
      const newAccountId = transactionData.accountId ?? oldAccountId;

      // Handle account change
      if (newAccountId !== oldAccountId) {
        await this.handleAccountChange(
          existingTransaction,
          oldAccountId,
          newAccountId,
          oldAmount,
          oldType,
          newAmount,
          newType,
        );
      } else if (transactionData.amount !== undefined || transactionData.type !== undefined) {
        // Same account but amount or type changed
        await this.handleAmountOrTypeChange(oldAccountId, oldAmount, oldType, newAmount, newType);
      }

      const updatedTransaction = await this.transactionsRepository.update(id, transactionData);
      if (!updatedTransaction) {
        throw new NotFoundException('Transakcija nije pronađena');
      }

      return updatedTransaction;
    });
  }

  private async handleAccountChange(
    existingTransaction: Transaction,
    oldAccountId: string,
    newAccountId: string,
    oldAmount: number,
    oldType: TransactionType,
    newAmount: number,
    newType: TransactionType,
  ): Promise<void> {
    const oldAccount = await this.accountsService.findAccountById(oldAccountId);
    const newAccount = await this.accountsService.findAccountById(newAccountId);

    // Verify new account belongs to the same household
    if (newAccount.householdId !== existingTransaction.householdId) {
      throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
    }

    // Reverse old effect on old account
    let oldAccountNewBalance = Number(oldAccount.currentBalance);
    if (oldType === TransactionType.INCOME) {
      oldAccountNewBalance -= oldAmount;
    } else {
      oldAccountNewBalance += oldAmount;
    }

    // Apply new effect on new account
    let newAccountNewBalance = Number(newAccount.currentBalance);
    if (newType === TransactionType.INCOME) {
      newAccountNewBalance += newAmount;
    } else {
      newAccountNewBalance -= newAmount;
    }

    // Check for sufficient funds in the new account for expenses
    if (newType === TransactionType.EXPENSE && newAccountNewBalance < 0) {
      throw new BadRequestException('Nedovoljno sredstava na novom računu za ovaj rashod');
    }

    // Update both accounts
    await this.accountsService.updateAccount(oldAccountId, {
      currentBalance: oldAccountNewBalance,
    });
    await this.accountsService.updateAccount(newAccountId, {
      currentBalance: newAccountNewBalance,
    });
  }

  private async handleAmountOrTypeChange(
    accountId: string,
    oldAmount: number,
    oldType: TransactionType,
    newAmount: number,
    newType: TransactionType,
  ): Promise<void> {
    const account = await this.accountsService.findAccountById(accountId);

    let balanceAfterOldRemoval = Number(account.currentBalance);
    if (oldType === TransactionType.INCOME) {
      balanceAfterOldRemoval -= oldAmount;
    } else {
      balanceAfterOldRemoval += oldAmount;
    }

    if (newType === TransactionType.EXPENSE && balanceAfterOldRemoval < newAmount) {
      throw new BadRequestException('Nedovoljno sredstava za ažurirani iznos rashoda');
    }

    const netChange = this.calculateNetBalanceChange(oldAmount, oldType, newAmount, newType);
    if (netChange !== 0) {
      const newBalance = Number(account.currentBalance) + netChange;
      await this.accountsService.updateAccount(accountId, {
        currentBalance: newBalance,
      });
    }
  }

  private calculateNetBalanceChange(
    oldAmount: number,
    oldType: TransactionType,
    newAmount: number,
    newType: TransactionType,
  ): number {
    let netChange = 0;
    if (oldType === TransactionType.INCOME) {
      netChange -= oldAmount;
    } else {
      netChange += oldAmount;
    }

    if (newType === TransactionType.INCOME) {
      netChange += newAmount;
    } else {
      netChange -= newAmount;
    }

    return netChange;
  }
}
