import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PrivateTransactionsService} from './private-transactions.service';
import {PrivateTransactionsController} from './private-transactions.controller';
import {PrivateTransaction} from './private-transactions.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {PrivateTransactionsRepository} from './private-transactions.repository';
import {LicensesModule} from 'src/licenses/licenses.module';
import {HouseholdsModule} from 'src/households/households.module';
import {PRIVATE_TRANSACTION_REPOSITORY} from '../repositories/private-transaction.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateTransaction]),
    AccountsModule,
    LicensesModule,
    forwardRef(() => HouseholdsModule),
  ],
  controllers: [PrivateTransactionsController],
  providers: [
    PrivateTransactionsService,
    PrivateTransactionsRepository,
    {
      provide: PRIVATE_TRANSACTION_REPOSITORY,
      useExisting: PrivateTransactionsRepository,
    },
  ],
})
export class PrivateTransactionsModule {}
