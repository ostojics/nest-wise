import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryBudgetsService} from './category-budgets.service';
import {CategoryBudgetsController} from './category-budgets.controller';
import {CategoryBudget} from './category-budgets.entity';
import {UsersModule} from 'src/users/users.module';
import {CategoryBudgetsRepository} from './category-budgets.repository';
import {CategoriesModule} from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryBudget]), UsersModule, CategoriesModule],
  controllers: [CategoryBudgetsController],
  providers: [CategoryBudgetsService, CategoryBudgetsRepository],
})
export class CategoryBudgetsModule {}
