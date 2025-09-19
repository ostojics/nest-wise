import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HouseholdsService} from './households.service';
import {HouseholdsController} from './households.controller';
import {HouseholdsRepository} from './households.repository';
import {Household} from './household.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {CategoriesModule} from 'src/categories/categories.module';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Household]), AccountsModule, CategoriesModule, forwardRef(() => UsersModule)],
  controllers: [HouseholdsController],
  providers: [HouseholdsService, HouseholdsRepository],
  exports: [HouseholdsService, HouseholdsRepository],
})
export class HouseholdsModule {}
