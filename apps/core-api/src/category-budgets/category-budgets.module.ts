import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryBudgetsService} from './category-budgets.service';
import {CategoryBudgetsController} from './category-budgets.controller';
import {HouseholdCategoryBudgetsController} from './household-category-budgets.controller';
import {CategoryBudget} from './category-budgets.entity';
import {UsersModule} from 'src/users/users.module';
import {CategoryBudgetsRepository} from './category-budgets.repository';
import {CategoriesModule} from 'src/categories/categories.module';
import {TransactionsModule} from 'src/transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryBudget]), UsersModule, CategoriesModule, TransactionsModule],
  controllers: [CategoryBudgetsController, HouseholdCategoryBudgetsController],
  providers: [CategoryBudgetsService, CategoryBudgetsRepository],
  exports: [CategoryBudgetsService],
})
export class CategoryBudgetsModule {}
