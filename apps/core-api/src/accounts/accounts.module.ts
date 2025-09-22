import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AccountsService} from './accounts.service';
import {AccountsController} from './accounts.controller';
import {AccountsRepository} from './accounts.repository';
import {Account} from './account.entity';
import {LicensesModule} from 'src/licenses/licenses.module';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {HouseholdsModule} from 'src/households/households.module';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), LicensesModule, UsersModule, forwardRef(() => HouseholdsModule)],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository, LicenseGuard],
  exports: [AccountsService],
})
export class AccountsModule {}
