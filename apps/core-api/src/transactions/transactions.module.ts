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
import {TRANSACTION_REPOSITORY} from '../repositories/transaction.repository.interface';
import {AiProviderModule} from '../infrastructure/providers/ai/ai-provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BullModule.registerQueue({name: Queues.AI_TRANSACTIONS}),
    AccountsModule,
    forwardRef(() => HouseholdsModule),
    CategoriesModule,
    LicensesModule,
    AiProviderModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    TransactionsConsumer,
    {
      provide: TRANSACTION_REPOSITORY,
      useExisting: TransactionsRepository,
    },
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
