import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PrivateTransactionsService} from './private-transactions.service';
import {PrivateTransactionsController} from './private-transactions.controller';
import {PrivateTransaction} from './private-transactions.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {PoliciesModule} from 'src/policies/policies.module';
import {PrivateTransactionsRepository} from './private-transactions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateTransaction]), AccountsModule, PoliciesModule],
  controllers: [PrivateTransactionsController],
  providers: [PrivateTransactionsService, PrivateTransactionsRepository],
})
export class PrivateTransactionsModule {}
