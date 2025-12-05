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
import {TransactionsService} from 'src/transactions/transactions.service';
import {TransactionsRepository} from 'src/transactions/transactions.repository';
import {Transaction} from 'src/transactions/transaction.entity';
import {UsersModule} from 'src/users/users.module';
import {BullModule} from '@nestjs/bullmq';
import {Queues} from 'src/common/enums/queues.enum';
import {NetWorthSnapshotsModule} from 'src/net-worth-snapshots/net-worth-snapshots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Household, Transaction]),
    AccountsModule,
    CategoriesModule,
    LicensesModule,
    forwardRef(() => UsersModule),
    BullModule.registerQueue({name: Queues.AI_TRANSACTIONS}),
    forwardRef(() => NetWorthSnapshotsModule),
  ],
  controllers: [HouseholdsController, HouseholdTransactionsController],
  providers: [HouseholdsService, HouseholdsRepository, TransactionsService, TransactionsRepository],
  exports: [HouseholdsService, HouseholdsRepository],
})
export class HouseholdsModule {}
