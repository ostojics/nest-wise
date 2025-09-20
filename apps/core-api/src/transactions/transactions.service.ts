import {openai} from '@ai-sdk/openai';
import {
  CreateTransactionAiDTO,
  CreateTransactionAiHouseholdDTO,
  CreateTransactionDTO,
  CreateTransactionHouseholdDTO,
  GetTransactionsQueryDTO,
  GetTransactionsQueryHouseholdDTO,
  UpdateTransactionDTO,
  AccountSpendingPointContract,
  GetAccountsSpendingQueryDTO,
  GetAccountsSpendingQueryHouseholdDTO,
  GetTransactionsResponseContract,
  NetWorthTrendPointContract,
  TransactionContract,
} from '@nest-wise/contracts';
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {generateObject} from 'ai';
import {CategoriesService} from 'src/categories/categories.service';
import {HouseholdsService} from 'src/households/households.service';
import {categoryPromptFactory} from 'src/tools/ai/prompts/category.prompt';
import {transactionCategoryOutputSchema} from 'src/tools/ai/schemas';
import {DataSource} from 'typeorm';
import {AccountsService} from '../accounts/accounts.service';
import {TransactionType} from '../common/enums/transaction.type.enum';
import {Transaction} from './transaction.entity';
import {TransactionsRepository} from './transactions.repository';
import {Logger} from 'pino-nestjs';

@Injectable()
export class TransactionsService {
  private readonly CHUNK_SIZE = 100;

  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsService: AccountsService,
    private readonly householdsService: HouseholdsService,
    private readonly categoriesService: CategoriesService,
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  async createTransaction(transactionData: CreateTransactionDTO): Promise<Transaction> {
    return await this.dataSource.transaction(async () => {
      const account = await this.accountsService.findAccountById(transactionData.accountId);

      if (transactionData.type === 'expense' && Number(account.currentBalance) < transactionData.amount) {
        throw new BadRequestException('Insufficient funds for this expense');
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

  async createTransactionForHousehold(
    householdId: string,
    transactionData: CreateTransactionHouseholdDTO,
  ): Promise<Transaction> {
    return await this.dataSource.transaction(async () => {
      const account = await this.accountsService.findAccountById(transactionData.accountId);

      // Verify account belongs to the household
      if (account.householdId !== householdId) {
        throw new BadRequestException('Account does not belong to the specified household');
      }

      if (transactionData.type === 'expense' && Number(account.currentBalance) < transactionData.amount) {
        throw new BadRequestException('Insufficient funds for this expense');
      }

      if (transactionData.type === 'income') {
        transactionData.categoryId = null;
      }

      const transaction = await this.transactionsRepository.create({
        ...transactionData,
        householdId,
      });

      await this.updateBalance(
        transactionData.accountId,
        transactionData.amount,
        transactionData.type as TransactionType,
      );

      return transaction;
    });
  }

  async getNetWorthTrend(householdId: string): Promise<NetWorthTrendPointContract[]> {
    return await this.transactionsRepository.getNetWorthTrendForHousehold(householdId);
  }

  async getAccountsSpending(
    householdId: string,
    query: GetAccountsSpendingQueryDTO,
  ): Promise<AccountSpendingPointContract[]> {
    return await this.transactionsRepository.getAccountsSpendingForHousehold(householdId, query);
  }

  async getAccountsSpendingForHousehold(
    householdId: string,
    query: GetAccountsSpendingQueryHouseholdDTO,
  ): Promise<AccountSpendingPointContract[]> {
    return await this.transactionsRepository.getAccountsSpendingForHouseholdNew(householdId, query);
  }

  async createTransactionAi(transactionData: CreateTransactionAiDTO): Promise<Transaction> {
    const account = await this.accountsService.findAccountById(transactionData.accountId);
    const household = await this.householdsService.findHouseholdById(account.householdId);
    const categories = await this.categoriesService.findCategoriesByHouseholdId(household.id);

    const {object} = await generateObject({
      model: openai('gpt-4.1-mini-2025-04-14'),
      prompt: categoryPromptFactory({
        categories,
        transactionDescription: transactionData.description,
        currentDate: new Date().toISOString(),
      }),
      temperature: 0.1,
      schema: transactionCategoryOutputSchema,
    });

    if (object.transactionType === 'expense' && Number(account.currentBalance) < object.transactionAmount) {
      throw new BadRequestException('Insufficient funds for this expense');
    }

    return await this.dataSource.transaction(async () => {
      const isNewCategorySuggested = object.newCategorySuggested;
      let categoryId: string | null = null;

      if (isNewCategorySuggested) {
        const newCategory = await this.categoriesService.createCategory({
          name: object.suggestedCategory.newCategoryName,
          householdId: household.id,
        });

        categoryId = newCategory.id;
      } else {
        categoryId = object.suggestedCategory.existingCategoryId;
      }

      const transaction = await this.transactionsRepository.create({
        description: transactionData.description,
        amount: object.transactionAmount,
        type: object.transactionType as TransactionType,
        categoryId: object.transactionType === 'income' ? null : categoryId,
        householdId: account.householdId,
        accountId: account.id,
        transactionDate: new Date(object.transactionDate),
        isReconciled: true,
      });

      await this.updateBalance(transaction.accountId, transaction.amount, transaction.type);

      return transaction;
    });
  }

  async createTransactionAiForHousehold(
    householdId: string,
    transactionData: CreateTransactionAiHouseholdDTO,
  ): Promise<Transaction> {
    const account = await this.accountsService.findAccountById(transactionData.accountId);

    // Verify account belongs to the household
    if (account.householdId !== householdId) {
      throw new BadRequestException('Account does not belong to the specified household');
    }

    const household = await this.householdsService.findHouseholdById(householdId);
    const categories = await this.categoriesService.findCategoriesByHouseholdId(household.id);

    const {object} = await generateObject({
      model: openai('gpt-4.1-mini-2025-04-14'),
      prompt: categoryPromptFactory({
        categories,
        transactionDescription: transactionData.description,
        currentDate: new Date().toISOString(),
      }),
      temperature: 0.1,
      schema: transactionCategoryOutputSchema,
    });

    if (object.transactionType === 'expense' && Number(account.currentBalance) < object.transactionAmount) {
      throw new BadRequestException('Insufficient funds for this expense');
    }

    return await this.dataSource.transaction(async () => {
      const isNewCategorySuggested = object.newCategorySuggested;
      let categoryId: string | null = null;

      if (isNewCategorySuggested) {
        const newCategory = await this.categoriesService.createCategory({
          name: object.suggestedCategory.newCategoryName,
          householdId: household.id,
        });

        categoryId = newCategory.id;
      } else {
        categoryId = object.suggestedCategory.existingCategoryId;
      }

      const transaction = await this.transactionsRepository.create({
        description: transactionData.description,
        amount: object.transactionAmount,
        type: object.transactionType as TransactionType,
        categoryId: object.transactionType === 'income' ? null : categoryId,
        householdId: household.id,
        accountId: account.id,
        transactionDate: transactionData.transactionDate ?? new Date(object.transactionDate),
        isReconciled: true,
      });

      await this.updateBalance(transaction.accountId, transaction.amount, transaction.type);

      return transaction;
    });
  }

  async findTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async findTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    await this.accountsService.findAccountById(accountId);

    return await this.transactionsRepository.findByAccountId(accountId);
  }

  async findTransactionsByHouseholdId(householdId: string): Promise<Transaction[]> {
    return await this.transactionsRepository.findByHouseholdId(householdId);
  }

  async findTransactions(query: GetTransactionsQueryDTO): Promise<GetTransactionsResponseContract> {
    return await this.transactionsRepository.findTransactionsWithFilters(query);
  }

  async findTransactionsForHousehold(
    householdId: string,
    query: GetTransactionsQueryHouseholdDTO,
  ): Promise<GetTransactionsResponseContract> {
    return await this.transactionsRepository.findTransactionsWithFiltersForHousehold(householdId, query);
  }

  async findAllTransactions(query: Omit<GetTransactionsQueryDTO, 'page' | 'pageSize'>): Promise<TransactionContract[]> {
    const results: TransactionContract[] = [];
    const pageSize = this.CHUNK_SIZE;
    let currentPage = 1;
    let hasMore = true;
    this.logger.debug('Finding all transactions', {query});

    while (hasMore) {
      const {data, meta} = await this.transactionsRepository.findTransactionsWithFilters({
        ...query,
        page: currentPage,
        pageSize,
      });

      results.push(...data);
      hasMore = currentPage < meta.totalPages;
      currentPage += 1;
      this.logger.debug('Found transactions', {data, meta});
    }

    this.logger.debug('Found all transactions', {resultsSize: results.length});
    return results;
  }

  async updateTransaction(id: string, transactionData: UpdateTransactionDTO): Promise<Transaction> {
    return await this.dataSource.transaction(async () => {
      const existingTransaction = await this.transactionsRepository.findById(id);
      if (!existingTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (transactionData.amount !== undefined || transactionData.type !== undefined) {
        const account = await this.accountsService.findAccountById(existingTransaction.accountId);

        const oldAmount = Number(existingTransaction.amount);
        const oldType = existingTransaction.type;
        const newAmount = transactionData.amount ? Number(transactionData.amount) : oldAmount;
        const newType = transactionData.type ? (transactionData.type as TransactionType) : oldType;

        let balanceAfterOldRemoval = Number(account.currentBalance);
        if (oldType === TransactionType.INCOME) {
          balanceAfterOldRemoval -= oldAmount;
        } else {
          balanceAfterOldRemoval += oldAmount;
        }

        if (newType === TransactionType.EXPENSE && balanceAfterOldRemoval < newAmount) {
          throw new BadRequestException('Insufficient funds for updated expense amount');
        }

        const netChange = this.calculateNetBalanceChange(oldAmount, oldType, newAmount, newType);
        if (netChange !== 0) {
          const newBalance = Number(account.currentBalance) + netChange;
          await this.accountsService.updateAccount(existingTransaction.accountId, {
            currentBalance: newBalance,
          });
        }
      }

      const updatedTransaction = await this.transactionsRepository.update(id, transactionData);
      if (!updatedTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      return updatedTransaction;
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    return await this.dataSource.transaction(async () => {
      const existingTransaction = await this.transactionsRepository.findById(id);
      if (!existingTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      const account = await this.accountsService.findAccountById(existingTransaction.accountId);
      let newBalance = Number(account.currentBalance);
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
        throw new NotFoundException('Transaction not found');
      }
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
