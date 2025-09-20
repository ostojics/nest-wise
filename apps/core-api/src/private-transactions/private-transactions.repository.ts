import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {PrivateTransaction} from './private-transactions.entity';
import {GetPrivateTransactionsQueryDTO, GetPrivateTransactionsResponseContract, SortOrder} from '@nest-wise/contracts';
import {TransactionType} from 'src/common/enums/transaction.type.enum';

@Injectable()
export class PrivateTransactionsRepository {
  constructor(
    @InjectRepository(PrivateTransaction)
    private readonly repo: Repository<PrivateTransaction>,
  ) {}

  async create(data: {
    householdId: string;
    accountId: string;
    userId: string;
    amount: number;
    type: TransactionType;
    description: string | null;
    transactionDate: Date;
  }): Promise<PrivateTransaction> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findById(id: string): Promise<PrivateTransaction | null> {
    return await this.repo.findOne({where: {id}, relations: ['account']});
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

    const data = await qb.getMany();

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
      qb.andWhere('pt.transactionDate >= :dateFrom', {dateFrom: query.from});
    }

    if (query.to) {
      qb.andWhere('pt.transactionDate <= :dateTo', {dateTo: query.to});
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
