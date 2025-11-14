import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {PrivateTransaction} from './private-transactions.entity';
import {GetPrivateTransactionsQueryDTO, GetPrivateTransactionsResponseContract, SortOrder} from '@nest-wise/contracts';
import {TransactionType} from 'src/common/enums/transaction.type.enum';
import {IPrivateTransactionRepository} from '../repositories/private-transaction.repository.interface';

@Injectable()
export class PrivateTransactionsRepository implements IPrivateTransactionRepository {
  constructor(
    @InjectRepository(PrivateTransaction)
    private readonly repo: Repository<PrivateTransaction>,
  ) {}

  async create(data: Partial<PrivateTransaction>): Promise<PrivateTransaction> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findById(id: string): Promise<PrivateTransaction | null> {
    return await this.repo.findOne({where: {id}, relations: ['account']});
  }

  async findByIdAndUser(id: string, userId: string, householdId: string): Promise<PrivateTransaction | null> {
    return await this.repo.findOne({
      where: {id, userId, householdId},
      relations: ['account'],
    });
  }

  async findByUser(userId: string, householdId: string): Promise<PrivateTransaction[]> {
    return await this.repo.find({
      where: {userId, householdId},
      relations: ['account'],
      order: {transactionDate: 'DESC'},
    });
  }

  async update(id: string, data: Partial<PrivateTransaction>): Promise<PrivateTransaction | null> {
    const updateResult = await this.repo.update(id, data);
    if (updateResult.affected === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }

  async findWithFilters(
    userId: string,
    query: GetPrivateTransactionsQueryDTO,
  ): Promise<GetPrivateTransactionsResponseContract> {
    const qb = this.repo
      .createQueryBuilder('pt')
      .leftJoinAndSelect('pt.account', 'account')
      .where('pt.userId = :userId', {userId})
      .addSelect(['account.id', 'account.name']);

    this.applyFilters(qb, query);
    this.applySorting(qb, query.sort);

    const totalCount = await qb.getCount();
    const pageSize = query.pageSize;
    const currentPage = query.page;
    const totalPages = Math.ceil(totalCount / pageSize);

    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    const transactions = await qb.getMany();
    const data = transactions.map((tx) => ({
      ...tx,
      transactionDate: tx.transactionDate.toISOString(),
    }));

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

  private applyFilters(qb: SelectQueryBuilder<PrivateTransaction>, query: GetPrivateTransactionsQueryDTO): void {
    if (query.accountId) {
      qb.andWhere('pt.accountId = :accountId', {accountId: query.accountId});
    }

    if (query.type) {
      qb.andWhere('pt.type = :type', {type: query.type});
    }

    if (query.from) {
      qb.andWhere('pt.transactionDate >= :dateFrom::timestamptz::date', {dateFrom: query.from});
    }

    if (query.to) {
      qb.andWhere("pt.transactionDate < (:dateTo::timestamptz::date + INTERVAL '1 day')", {dateTo: query.to});
    }

    if (query.q) {
      qb.andWhere('pt.description ILIKE :q', {
        q: `%${query.q}%`,
      });
    }
  }

  private applySorting(qb: SelectQueryBuilder<PrivateTransaction>, sort?: string): void {
    if (!sort) {
      qb.orderBy('pt.transactionDate', SortOrder.DESC);
      return;
    }
    const isDescending = sort.startsWith('-');
    const fieldName = isDescending ? sort.slice(1) : sort;
    const direction = isDescending ? SortOrder.DESC : SortOrder.ASC;
    const columnName = `pt.${fieldName}`;
    qb.orderBy(columnName, direction);
  }
}
