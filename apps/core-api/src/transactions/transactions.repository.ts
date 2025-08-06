import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {Transaction} from './transaction.entity';
import {CreateTransactionDTO, GetTransactionsQueryDTO, UpdateTransactionDTO} from '@maya-vault/validation';
import {GetTransactionsResponseContract, SortOrder, TransactionContract} from '@maya-vault/contracts';
import {TransactionType} from '../common/enums/transaction.type.enum';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(transactionData: CreateTransactionDTO): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...transactionData,
      type: transactionData.type as TransactionType,
    });
    return await this.transactionRepository.save(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({
      where: {id},
      relations: ['account', 'category'],
    });
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: {accountId},
      relations: ['category'],
      order: {createdAt: 'DESC'},
    });
  }

  async findByHouseholdId(householdId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: {householdId},
      relations: ['account', 'category'],
      order: {createdAt: 'DESC'},
    });
  }

  async findTransactionsWithFilters(query: GetTransactionsQueryDTO): Promise<GetTransactionsResponseContract> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.category', 'category');

    this.applyFilters(queryBuilder, query);
    this.applySorting(queryBuilder, query.sort);

    const totalCount = await queryBuilder.getCount();
    const pageSize = query.pageSize;
    const currentPage = query.page;
    const totalPages = Math.ceil(totalCount / pageSize);

    queryBuilder.skip((currentPage - 1) * pageSize).take(pageSize);

    const data = (await queryBuilder.getMany()) as TransactionContract[];

    return {
      data,
      meta: {
        totalCount,
        pageSize,
        currentPage,
        totalPages,
      },
    };
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Transaction>, query: GetTransactionsQueryDTO): void {
    if (query.householdId) {
      queryBuilder.andWhere('transaction.householdId = :householdId', {householdId: query.householdId});
    }

    if (query.accountId) {
      queryBuilder.andWhere('transaction.accountId = :accountId', {accountId: query.accountId});
    }

    if (query.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {categoryId: query.categoryId});
    }

    if (query.transactionDate_from) {
      queryBuilder.andWhere('transaction.transactionDate >= :dateFrom', {
        dateFrom: query.transactionDate_from,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('transaction.type = :type', {type: query.type as TransactionType});
    }

    if (query.transactionDate_to) {
      queryBuilder.andWhere('transaction.transactionDate <= :dateTo', {
        dateTo: query.transactionDate_to,
      });
    }

    if (query.q) {
      queryBuilder.andWhere('transaction.description ILIKE :q', {
        q: `%${query.q}%`,
      });
    }
  }

  private applySorting(queryBuilder: SelectQueryBuilder<Transaction>, sort?: string): void {
    if (!sort) {
      queryBuilder.orderBy('transaction.transactionDate', SortOrder.DESC);
      return;
    }

    const isDescending = sort.startsWith('-');
    const fieldName = isDescending ? sort.slice(1) : sort;
    const direction = isDescending ? SortOrder.DESC : SortOrder.ASC;

    const columnName = `transaction.${fieldName}`;

    queryBuilder.orderBy(columnName, direction);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['account', 'category'],
      order: {createdAt: SortOrder.DESC},
    });
  }

  async update(id: string, transactionData: UpdateTransactionDTO): Promise<Transaction | null> {
    const {type, ...otherData} = transactionData;
    const updateData = {
      ...otherData,
      ...(type && {type: type as TransactionType}),
    };

    const updateResult = await this.transactionRepository.update(id, updateData);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.transactionRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.transactionRepository.count({where: {id}});
    return count > 0;
  }
}
