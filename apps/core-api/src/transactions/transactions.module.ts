import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BullModule} from '@nestjs/bullmq';
import {TransactionsService} from './transactions.service';
import {TransactionsController} from './transactions.controller';
import {TransactionsRepository} from './transactions.repository';
import {Transaction} from './transaction.entity';
import {AccountsModule} from '../accounts/accounts.module';
import {HouseholdsModule} from 'src/households/households.module';
import {CategoriesModule} from 'src/categories/categories.module';
import {LicensesModule} from 'src/licenses/licenses.module';
import {Queues} from 'src/common/enums/queues.enum';
import {TransactionsConsumer} from './transactions.consumer';
import {NetWorthSnapshotsModule} from '../net-worth-snapshots/net-worth-snapshots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BullModule.registerQueue({name: Queues.AI_TRANSACTIONS}),
    AccountsModule,
    HouseholdsModule,
    CategoriesModule,
    LicensesModule,
    forwardRef(() => NetWorthSnapshotsModule),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, TransactionsConsumer],
  exports: [TransactionsService],
})
export class TransactionsModule {}
