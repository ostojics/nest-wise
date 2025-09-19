import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HouseholdsService} from './households.service';
import {HouseholdsController} from './households.controller';
import {HouseholdTransactionsController} from './household-transactions.controller';
import {HouseholdsRepository} from './households.repository';
import {Household} from './household.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {CategoriesModule} from 'src/categories/categories.module';
import {TransactionsService} from 'src/transactions/transactions.service';
import {TransactionsRepository} from 'src/transactions/transactions.repository';
import {Transaction} from 'src/transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Household, Transaction]), AccountsModule, CategoriesModule],
  controllers: [HouseholdsController, HouseholdTransactionsController],
  providers: [HouseholdsService, HouseholdsRepository, TransactionsService, TransactionsRepository],
  exports: [HouseholdsService, HouseholdsRepository],
})
export class HouseholdsModule {}
