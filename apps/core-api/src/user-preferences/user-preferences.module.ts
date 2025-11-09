import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserPreference} from './user-preference.entity';
import {UserPreferencesController} from './user-preferences.controller';
import {UserPreferencesService} from './user-preferences.service';
import {UserPreferencesRepository} from './user-preferences.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreference])],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService, UserPreferencesRepository],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
