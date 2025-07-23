import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Transaction} from './transaction.entity';
import {CreateTransactionDTO, UpdateTransactionDTO} from '@maya-vault/validation';
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

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['account', 'category'],
      order: {createdAt: 'DESC'},
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
