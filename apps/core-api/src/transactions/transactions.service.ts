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
} from '@nest-wise/contracts';
import {BadRequestException, Injectable, NotFoundException, Inject} from '@nestjs/common';
import {InjectQueue} from '@nestjs/bullmq';
import {Queue} from 'bullmq';
import {AccountsService} from '../accounts/accounts.service';
import {Transaction} from './transaction.entity';
import {Logger} from 'pino-nestjs';
import {Queues} from 'src/common/enums/queues.enum';
import {AiTransactionJobs} from 'src/common/enums/jobs.enum';
import {ProcessAiTransactionPayload} from 'src/common/interfaces/ai-transactions.interface';
import {ITransactionRepository, TRANSACTION_REPOSITORY} from '../repositories/transaction.repository.interface';
import {
  CreateTransactionUseCase,
  CreateTransactionForHouseholdUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
  CreateAiTransactionForHouseholdUseCase,
} from '../application/use-cases/transactions';

@Injectable()
export class TransactionsService {
  private readonly CHUNK_SIZE = 100;

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
    private readonly accountsService: AccountsService,
    private readonly logger: Logger,
    @InjectQueue(Queues.AI_TRANSACTIONS) private readonly aiTransactionsQueue: Queue,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly createTransactionForHouseholdUseCase: CreateTransactionForHouseholdUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly createAiTransactionForHouseholdUseCase: CreateAiTransactionForHouseholdUseCase,
  ) {}

  async createTransaction(transactionData: CreateTransactionDTO): Promise<Transaction> {
    return await this.createTransactionUseCase.execute({transactionData});
  }

  async createTransactionForHousehold(
    householdId: string,
    transactionData: CreateTransactionHouseholdDTO,
  ): Promise<Transaction> {
    return await this.createTransactionForHouseholdUseCase.execute({householdId, transactionData});
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

  async createTransactionAiForHousehold(
    householdId: string,
    transactionData: CreateTransactionAiHouseholdDTO,
  ): Promise<Transaction> {
    return await this.createAiTransactionForHouseholdUseCase.execute({householdId, transactionData});
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
    return await this.updateTransactionUseCase.execute({id, transactionData});
  }

  async deleteTransaction(id: string): Promise<void> {
    return await this.deleteTransactionUseCase.execute({id});
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
      response.transaction = job.returnvalue as TransactionContract;
    } else if (status === AiTransactionJobStatus.FAILED) {
      response.error = job.failedReason || 'Obrada transakcije nije uspela';
    }

    return response;
  }
}
