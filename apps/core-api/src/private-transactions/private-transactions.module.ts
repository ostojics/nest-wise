import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PrivateTransactionsService} from './private-transactions.service';
import {PrivateTransactionsController} from './private-transactions.controller';
import {PrivateTransaction} from './private-transactions.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {PoliciesModule} from 'src/policies/policies.module';
import {UsersModule} from 'src/users/users.module';
import {PrivateTransactionsRepository} from './private-transactions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateTransaction]), AccountsModule, PoliciesModule, UsersModule],
  controllers: [PrivateTransactionsController],
  providers: [PrivateTransactionsService, PrivateTransactionsRepository],
})
export class PrivateTransactionsModule {}
