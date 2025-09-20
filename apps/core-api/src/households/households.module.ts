import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HouseholdsService} from './households.service';
import {HouseholdsController} from './households.controller';
import {HouseholdsRepository} from './households.repository';
import {Household} from './household.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {CategoriesModule} from 'src/categories/categories.module';
import {PoliciesModule} from 'src/policies/policies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Household]), AccountsModule, CategoriesModule, PoliciesModule],
  controllers: [HouseholdsController],
  providers: [HouseholdsService, HouseholdsRepository],
  exports: [HouseholdsService, HouseholdsRepository],
})
export class HouseholdsModule {}
