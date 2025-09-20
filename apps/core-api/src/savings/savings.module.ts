import {Module} from '@nestjs/common';
import {SavingsService} from './savings.service';
import {HouseholdSavingsController} from './household-savings.controller';
import {HouseholdsModule} from 'src/households/households.module';
import {TransactionsModule} from 'src/transactions/transactions.module';
import {BullModule} from '@nestjs/bullmq';
import {Queues} from 'src/common/enums/queues.enum';
import {SavingsRepository} from './savings.repository';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Savings} from './savings.entity';

@Module({
  imports: [
    HouseholdsModule,
    TransactionsModule,
    BullModule.registerQueue({name: Queues.SAVINGS}),
    TypeOrmModule.forFeature([Savings]),
  ],
  controllers: [HouseholdSavingsController],
  providers: [SavingsService, SavingsRepository],
  exports: [SavingsService],
})
export class SavingsModule {}
