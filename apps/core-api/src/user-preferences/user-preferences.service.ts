import {Injectable} from '@nestjs/common';
import {UserPreferencesRepository} from './user-preferences.repository';
import {UserPreference} from './user-preference.entity';
import {UpdateUserPreferencesDTO} from '@nest-wise/contracts';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly userPreferencesRepository: UserPreferencesRepository) {}

  async getUserPreferences(userId: string): Promise<UserPreference> {
    const preferences = await this.userPreferencesRepository.findByUserId(userId);

    if (preferences) {
      return preferences;
    }

    // Create default preferences if they don't exist
    return await this.userPreferencesRepository.create(userId, {
      automaticLogout: false,
    });
  }

  async updateUserPreferences(userId: string, dto: UpdateUserPreferencesDTO): Promise<UserPreference> {
    return await this.userPreferencesRepository.upsert(userId, dto);
  }
}
