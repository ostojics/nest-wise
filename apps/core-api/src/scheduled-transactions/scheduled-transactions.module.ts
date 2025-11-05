import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BullModule} from '@nestjs/bullmq';
import {ScheduledTransactionRule} from './scheduled-transaction-rule.entity';
import {ScheduledTransactionExecution} from './scheduled-transaction-execution.entity';
import {ScheduledTransactionsRepository} from './scheduled-transactions.repository';
import {ScheduledTransactionsService} from './scheduled-transactions.service';
import {ScheduledTransactionsController} from './scheduled-transactions.controller';
import {ScheduledTransactionsOrchestrator} from './scheduled-transactions.orchestrator';
import {ScheduledTransactionsWorker} from './scheduled-transactions.worker';
import {Queues} from '../common/enums/queues.enum';
import {AccountsModule} from '../accounts/accounts.module';
import {CategoriesModule} from '../categories/categories.module';
import {TransactionsModule} from '../transactions/transactions.module';
import {PoliciesModule} from '../policies/policies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledTransactionRule, ScheduledTransactionExecution]),
    BullModule.registerQueue({
      name: Queues.SCHEDULED_TRANSACTIONS,
    }),
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    PoliciesModule,
  ],
  controllers: [ScheduledTransactionsController],
  providers: [
    ScheduledTransactionsRepository,
    ScheduledTransactionsService,
    ScheduledTransactionsOrchestrator,
    ScheduledTransactionsWorker,
  ],
  exports: [ScheduledTransactionsService, ScheduledTransactionsRepository],
})
export class ScheduledTransactionsModule {}
