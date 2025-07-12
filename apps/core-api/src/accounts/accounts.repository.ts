import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Account} from './account.entity';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(accountData: Partial<Account>): Promise<Account> {
    const account = this.accountRepository.create(accountData);
    return await this.accountRepository.save(account);
  }

  async findById(id: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: {id},
      select: [
        'id',
        'name',
        'type',
        'initialBalance',
        'currentBalance',
        'createdAt',
        'updatedAt',
        'ownerId',
        'householdId',
      ],
    });
  }

  async findByHouseholdId(householdId: string): Promise<Account[]> {
    return await this.accountRepository.find({where: {householdId}});
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async update(id: string, accountData: Partial<Account>): Promise<Account | null> {
    const updateResult = await this.accountRepository.update(id, accountData);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.accountRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.accountRepository.count({where: {id}});
    return count > 0;
  }

  async nameExistsForHousehold(name: string, householdId: string): Promise<boolean> {
    const count = await this.accountRepository.count({where: {name, householdId}});
    return count > 0;
  }
}
