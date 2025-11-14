import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Household} from './household.entity';
import {IHouseholdRepository} from '../repositories/household.repository.interface';

@Injectable()
export class HouseholdsRepository implements IHouseholdRepository {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
  ) {}

  async create(householdData: Partial<Household>): Promise<Household> {
    const household = this.householdRepository.create(householdData);
    return await this.householdRepository.save(household);
  }

  async findById(id: string): Promise<Household | null> {
    return await this.householdRepository.findOne({where: {id}});
  }

  async findByIdWithUsers(id: string): Promise<Household | null> {
    return await this.householdRepository.findOne({
      where: {id},
      relations: ['users'],
    });
  }

  async findAll(): Promise<Household[]> {
    return await this.householdRepository.find();
  }

  async update(id: string, householdData: Partial<Household>): Promise<Household | null> {
    const updateResult = await this.householdRepository.update(id, householdData);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.householdRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.householdRepository.count({where: {id}});
    return count > 0;
  }

  async getMemberCount(householdId: string): Promise<number> {
    const household = await this.findByIdWithUsers(householdId);
    return household?.users?.length ?? 0;
  }
}
