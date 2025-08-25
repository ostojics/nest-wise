import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Savings} from './savings.entity';

@Injectable()
export class SavingsRepository {
  constructor(
    @InjectRepository(Savings)
    private readonly savingsRepository: Repository<Savings>,
  ) {}

  async create(savingsData: Partial<Savings>): Promise<Savings> {
    const savings = this.savingsRepository.create(savingsData);
    return await this.savingsRepository.save(savings);
  }
}
