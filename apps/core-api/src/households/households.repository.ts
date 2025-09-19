import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Household} from './household.entity';
import {CreateHouseholdDTO, UpdateHouseholdDTO} from '@nest-wise/contracts';

@Injectable()
export class HouseholdsRepository {
  constructor(
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
  ) {}

  async create(householdData: CreateHouseholdDTO): Promise<Household> {
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

  async update(id: string, householdData: UpdateHouseholdDTO): Promise<Household | null> {
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
}
