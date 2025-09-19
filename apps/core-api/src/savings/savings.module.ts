import {Module, forwardRef} from '@nestjs/common';
import {SavingsService} from './savings.service';
import {SavingsController} from './savings.controller';
import {HouseholdSavingsController} from './household-savings.controller';
import {HouseholdsModule} from 'src/households/households.module';
import {TransactionsModule} from 'src/transactions/transactions.module';
import {BullModule} from '@nestjs/bullmq';
import {Queues} from 'src/common/enums/queues.enum';
import {SavingsRepository} from './savings.repository';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Savings} from './savings.entity';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => HouseholdsModule),
    TransactionsModule,
    BullModule.registerQueue({name: Queues.SAVINGS}),
    TypeOrmModule.forFeature([Savings]),
    UsersModule,
  ],
  controllers: [SavingsController, HouseholdSavingsController],
  providers: [SavingsService, SavingsRepository],
  exports: [SavingsService],
})
export class SavingsModule {}
