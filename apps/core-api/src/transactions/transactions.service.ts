import {openai} from '@ai-sdk/openai';
import {
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
  SpendingTotalContract,
  CategorySpendingPointContract,
  GetSpendingSummaryQueryHouseholdDTO,
  AiTransactionJobResponseContract,
  AiTransactionJobStatusContract,
  AiTransactionJobStatus,
  AiTransactionSuggestion,
  ConfirmAiTransactionSuggestionHouseholdDTO,
} from '@nest-wise/contracts';
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectQueue} from '@nestjs/bullmq';
import {Queue} from 'bullmq';
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
import {Queues} from 'src/common/enums/queues.enum';
import {AiTransactionJobs} from 'src/common/enums/jobs.enum';
import {ProcessAiTransactionPayload} from 'src/common/interfaces/ai-transactions.interface';

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
    @InjectQueue(Queues.AI_TRANSACTIONS) private readonly aiTransactionsQueue: Queue,
  ) {}

  async createTransaction(transactionData: CreateTransactionDTO): Promise<Transaction> {
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

  async createTransactionForHousehold(
    householdId: string,
    transactionData: CreateTransactionHouseholdDTO,
  ): Promise<Transaction> {
    return await this.dataSource.transaction(async () => {
      const account = await this.accountsService.findAccountById(transactionData.accountId);

      // Verify account belongs to the household
      if (account.householdId !== householdId) {
        throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
      }

      if (transactionData.type === 'expense' && Number(account.currentBalance) < transactionData.amount) {
        throw new BadRequestException('Nedovoljno sredstava za ovaj rashod');
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

  async getSpendingTotalForHousehold(
    householdId: string,
    query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<SpendingTotalContract> {
    return await this.transactionsRepository.getSpendingTotalForHousehold(householdId, query);
  }

  async getCategoriesSpendingForHousehold(
    householdId: string,
    query: GetSpendingSummaryQueryHouseholdDTO,
  ): Promise<CategorySpendingPointContract[]> {
    return await this.transactionsRepository.getCategoriesSpendingForHousehold(householdId, query);
  }

  /**
   * Generate an AI transaction suggestion without creating a transaction.
   * This is used by the background job to return a suggestion that the user can confirm.
   */
  async generateAiTransactionSuggestion(
    householdId: string,
    transactionData: CreateTransactionAiHouseholdDTO,
  ): Promise<AiTransactionSuggestion> {
    const account = await this.accountsService.findAccountById(transactionData.accountId);

    // Verify account belongs to the household
    if (account.householdId !== householdId) {
      throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
    }

    const household = await this.householdsService.findHouseholdById(householdId);
    const categories = await this.categoriesService.findCategoriesByHouseholdId(household.id);

    const {object} = await generateObject({
      model: openai('gpt-5-nano-2025-08-07'),
      prompt: categoryPromptFactory({
        categories,
        transactionDescription: transactionData.description,
        currentDate: transactionData.currentDate,
      }),
      temperature: 0.1,
      schema: transactionCategoryOutputSchema,
      abortSignal: AbortSignal.timeout(20_000),
    });

    if (object.transactionType === 'expense' && Number(account.currentBalance) < object.transactionAmount) {
      throw new BadRequestException('Nedovoljno sredstava za ovaj rashod');
    }

    // Return suggestion without creating a transaction
    const suggestion: AiTransactionSuggestion = {
      accountId: transactionData.accountId,
      description: transactionData.description,
      transactionAmount: object.transactionAmount,
      transactionType: object.transactionType,
      transactionDate: object.transactionDate,
      newCategorySuggested: object.newCategorySuggested,
      suggestedCategory: {
        existingCategoryId: object.suggestedCategory.existingCategoryId || undefined,
        newCategoryName: object.suggestedCategory.newCategoryName || undefined,
      },
    };

    return suggestion;
  }

  /**
   * Confirm an AI transaction suggestion and create the transaction.
   * If a new category is suggested and no categoryId is provided, creates the category first.
   * All operations are done in a database transaction for atomicity.
   */
  async confirmAiTransactionSuggestion(
    householdId: string,
    confirmationData: ConfirmAiTransactionSuggestionHouseholdDTO,
  ): Promise<Transaction> {
    const account = await this.accountsService.findAccountById(confirmationData.accountId);

    // Verify account belongs to the household
    if (account.householdId !== householdId) {
      throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
    }

    // Verify sufficient funds for expenses
    if (confirmationData.type === 'expense' && Number(account.currentBalance) < confirmationData.amount) {
      throw new BadRequestException('Nedovoljno sredstava za ovaj rashod');
    }

    return await this.dataSource.transaction(async () => {
      let finalCategoryId = confirmationData.categoryId;

      // Create new category if suggested and no category is selected
      if (
        confirmationData.newCategorySuggested &&
        confirmationData.suggestedCategoryName &&
        !confirmationData.categoryId
      ) {
        const newCategory = await this.categoriesService.createCategoryForHousehold(householdId, {
          name: confirmationData.suggestedCategoryName,
        });
        finalCategoryId = newCategory.id;
      }

      // Create the transaction
      const transaction = await this.transactionsRepository.create({
        description: confirmationData.description,
        amount: confirmationData.amount,
        type: confirmationData.type as TransactionType,
        categoryId: confirmationData.type === 'income' ? null : finalCategoryId,
        householdId: householdId,
        accountId: account.id,
        transactionDate: confirmationData.transactionDate,
        isReconciled: confirmationData.isReconciled,
      });

      // Update account balance
      await this.updateBalance(
        confirmationData.accountId,
        confirmationData.amount,
        confirmationData.type as TransactionType,
      );

      return transaction;
    });
  }

  async findTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transakcija nije pronađena');
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
      } else if (transactionData.amount !== undefined || transactionData.type !== undefined) {
        // Same account but amount or type changed
        const account = await this.accountsService.findAccountById(oldAccountId);

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
          await this.accountsService.updateAccount(oldAccountId, {
            currentBalance: newBalance,
          });
        }
      }

      const updatedTransaction = await this.transactionsRepository.update(id, transactionData);
      if (!updatedTransaction) {
        throw new NotFoundException('Transakcija nije pronađena');
      }

      return updatedTransaction;
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    return await this.dataSource.transaction(async () => {
      const existingTransaction = await this.transactionsRepository.findById(id);
      if (!existingTransaction) {
        throw new NotFoundException('Transakcija nije pronađena');
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
        throw new NotFoundException('Transakcija nije pronađena');
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

  async enqueueAiTransaction(
    householdId: string,
    transactionData: CreateTransactionAiHouseholdDTO,
  ): Promise<AiTransactionJobResponseContract> {
    // Validate account exists and belongs to household before enqueueing
    const account = await this.accountsService.findAccountById(transactionData.accountId);
    if (account.householdId !== householdId) {
      throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
    }

    const payload: ProcessAiTransactionPayload = {
      householdId,
      transactionData,
    };

    const job = await this.aiTransactionsQueue.add(AiTransactionJobs.PROCESS_AI_TRANSACTION, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    this.logger.debug('AI transaction job enqueued', {jobId: job.id, householdId});

    return {
      jobId: job.id ?? '',
      status: AiTransactionJobStatus.PENDING,
    };
  }

  async getAiTransactionJobStatus(jobId: string): Promise<AiTransactionJobStatusContract> {
    const job = await this.aiTransactionsQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('Posao nije pronađen');
    }

    const state = await job.getState();
    let status: AiTransactionJobStatus;

    switch (state) {
      case 'waiting':
      case 'delayed':
        status = AiTransactionJobStatus.PENDING;
        break;
      case 'active':
        status = AiTransactionJobStatus.PROCESSING;
        break;
      case 'completed':
        status = AiTransactionJobStatus.COMPLETED;
        break;
      case 'failed':
        status = AiTransactionJobStatus.FAILED;
        break;
      default:
        status = AiTransactionJobStatus.PENDING;
    }

    const response: AiTransactionJobStatusContract = {
      jobId,
      status,
    };

    this.logger.debug('AI transaction job status fetched', {jobId, status});

    if (status === AiTransactionJobStatus.COMPLETED) {
      response.suggestion = job.returnvalue as AiTransactionSuggestion;
    } else if (status === AiTransactionJobStatus.FAILED) {
      response.error = job.failedReason || 'Obrada transakcije nije uspela';
    }

    return response;
  }
}
