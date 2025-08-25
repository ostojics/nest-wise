import {Module} from '@nestjs/common';
import {SavingsService} from './savings.service';
import {SavingsController} from './savings.controller';
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
  controllers: [SavingsController],
  providers: [SavingsService, SavingsRepository],
  exports: [SavingsService],
})
export class SavingsModule {}
