import {Controller} from '@nestjs/common';
import {CategoryBudgetsService} from './category-budgets.service';

@Controller('category-budgets')
export class CategoryBudgetsController {
  constructor(private readonly categoryBudgetsService: CategoryBudgetsService) {}
}
