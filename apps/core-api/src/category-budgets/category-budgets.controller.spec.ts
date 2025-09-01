import {Test, TestingModule} from '@nestjs/testing';
import {CategoryBudgetsController} from './category-budgets.controller';
import {CategoryBudgetsService} from './category-budgets.service';

describe('CategoryBudgetsController', () => {
  let controller: CategoryBudgetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryBudgetsController],
      providers: [CategoryBudgetsService],
    }).compile();

    controller = module.get<CategoryBudgetsController>(CategoryBudgetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
