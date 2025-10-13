import {Global, Module} from '@nestjs/common';
import {PoliciesService} from './policies.service';
import {PoliciesController} from './policies.controller';
import {UsersModule} from 'src/users/users.module';
import {AccountsModule} from 'src/accounts/accounts.module';
import {CategoryBudgetsModule} from 'src/category-budgets/category-budgets.module';
import {CategoriesModule} from 'src/categories/categories.module';

@Global()
@Module({
  imports: [UsersModule, AccountsModule, CategoryBudgetsModule, CategoriesModule],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
