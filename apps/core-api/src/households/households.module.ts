import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HouseholdsService} from './households.service';
import {HouseholdsController} from './households.controller';
import {HouseholdTransactionsController} from './household-transactions.controller';
import {HouseholdsRepository} from './households.repository';
import {Household} from './household.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {CategoriesModule} from 'src/categories/categories.module';
import {LicensesModule} from 'src/licenses/licenses.module';
import {TransactionsModule} from 'src/transactions/transactions.module';
import {UsersModule} from 'src/users/users.module';
import {HOUSEHOLD_REPOSITORY} from '../repositories/household.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Household]),
    AccountsModule,
    CategoriesModule,
    LicensesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
  ],
  controllers: [HouseholdsController, HouseholdTransactionsController],
  providers: [
    HouseholdsService,
    HouseholdsRepository,
    {
      provide: HOUSEHOLD_REPOSITORY,
      useExisting: HouseholdsRepository,
    },
  ],
  exports: [HouseholdsService, HouseholdsRepository],
})
export class HouseholdsModule {}
