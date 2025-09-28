import {Global, Module} from '@nestjs/common';
import {PoliciesService} from './policies.service';
import {PoliciesController} from './policies.controller';
import {UsersModule} from 'src/users/users.module';
import {AccountsModule} from 'src/accounts/accounts.module';
import {CategoryBudgetsModule} from 'src/category-budgets/category-budgets.module';
import {I18nService} from 'src/lib/services/i18n.service';

@Global()
@Module({
  imports: [UsersModule, AccountsModule, CategoryBudgetsModule],
  controllers: [PoliciesController],
  providers: [PoliciesService, I18nService],
  exports: [PoliciesService, I18nService],
})
export class PoliciesModule {}
