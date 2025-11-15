import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {IUserRepository} from '../repositories/user.repository.interface';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {id},
      select: ['id', 'email', 'username', 'createdAt', 'updatedAt', 'householdId'],
      relations: ['household'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({where: {email}});
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({where: {username}});
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByHouseholdId(householdId: string): Promise<User[]> {
    return await this.userRepository.find({
      where: {householdId},
      select: ['id', 'email', 'username', 'createdAt', 'updatedAt', 'householdId'],
    });
  }

  async findByHouseholdIdWithHousehold(householdId: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.household', 'household')
      .where('user.householdId = :householdId', {householdId})
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.createdAt',
        'user.updatedAt',
        'user.householdId',
        'household.id',
        'household.name',
        'household.currencyCode',
        'household.monthlyBudget',
        'household.createdAt',
        'household.updatedAt',
      ])
      .getMany();
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const updateResult = await this.userRepository.update(id, userData);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.userRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.userRepository.count({where: {id}});
    return count > 0;
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({where: {email}});
    return count > 0;
  }

  async usernameExists(username: string): Promise<boolean> {
    const count = await this.userRepository.count({where: {username}});
    return count > 0;
  }
}
