import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PrivateTransactionsService} from './private-transactions.service';
import {PrivateTransactionsController} from './private-transactions.controller';
import {PrivateTransaction} from './private-transactions.entity';
import {AccountsModule} from 'src/accounts/accounts.module';
import {UsersModule} from 'src/users/users.module';
import {PrivateTransactionsRepository} from './private-transactions.repository';
import {LicensesModule} from 'src/licenses/licenses.module';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {HouseholdsModule} from 'src/households/households.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateTransaction]),
    AccountsModule,
    UsersModule,
    LicensesModule,
    forwardRef(() => HouseholdsModule),
  ],
  controllers: [PrivateTransactionsController],
  providers: [PrivateTransactionsService, PrivateTransactionsRepository, LicenseGuard],
})
export class PrivateTransactionsModule {}
