import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryBudgetsService} from './category-budgets.service';
import {CategoryBudgetsController} from './category-budgets.controller';
import {CategoryBudget} from './category-budgets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryBudget])],
  controllers: [CategoryBudgetsController],
  providers: [CategoryBudgetsService],
})
export class CategoryBudgetsModule {}
