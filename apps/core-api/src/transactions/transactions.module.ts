import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TransactionsService} from './transactions.service';
import {TransactionsController} from './transactions.controller';
import {TransactionsRepository} from './transactions.repository';
import {Transaction} from './transaction.entity';
import {AccountsModule} from '../accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AccountsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsService],
})
export class TransactionsModule {}
