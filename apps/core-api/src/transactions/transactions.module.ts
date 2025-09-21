import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TransactionsService} from './transactions.service';
import {TransactionsController} from './transactions.controller';
import {TransactionsRepository} from './transactions.repository';
import {Transaction} from './transaction.entity';
import {AccountsModule} from '../accounts/accounts.module';
import {HouseholdsModule} from 'src/households/households.module';
import {CategoriesModule} from 'src/categories/categories.module';
import {UsersModule} from 'src/users/users.module';
import {LicensesModule} from 'src/licenses/licenses.module';
import {LicenseGuard} from 'src/common/guards/license.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AccountsModule,
    HouseholdsModule,
    CategoriesModule,
    UsersModule,
    LicensesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, LicenseGuard],
  exports: [TransactionsService],
})
export class TransactionsModule {}
