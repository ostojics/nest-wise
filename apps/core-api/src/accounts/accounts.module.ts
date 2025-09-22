import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AccountsService} from './accounts.service';
import {AccountsController} from './accounts.controller';
import {AccountsRepository} from './accounts.repository';
import {Account} from './account.entity';
import {LicensesModule} from 'src/licenses/licenses.module';
import {HouseholdsModule} from 'src/households/households.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), LicensesModule, forwardRef(() => HouseholdsModule)],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
