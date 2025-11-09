import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserPreference} from './user-preference.entity';

@Injectable()
export class UserPreferencesRepository {
  constructor(
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
  ) {}

  async create(userId: string, data: Partial<UserPreference>): Promise<UserPreference> {
    const userPreference = this.userPreferenceRepository.create({
      userId,
      ...data,
    });
    return await this.userPreferenceRepository.save(userPreference);
  }

  async findByUserId(userId: string): Promise<UserPreference | null> {
    return await this.userPreferenceRepository.findOne({
      where: {userId},
    });
  }

  async update(userId: string, data: Partial<UserPreference>): Promise<UserPreference | null> {
    const updateResult = await this.userPreferenceRepository.update({userId}, data);

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findByUserId(userId);
  }

  async upsert(userId: string, data: Partial<UserPreference>): Promise<UserPreference> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      const updated = await this.update(userId, data);
      if (!updated) {
        throw new Error('Failed to update user preferences');
      }
      return updated;
    }

    return await this.create(userId, data);
  }
}
