import {Test, TestingModule} from '@nestjs/testing';
import {PrivateTransactionsController} from './private-transactions.controller';
import {PrivateTransactionsService} from './private-transactions.service';

describe('PrivateTransactionsController', () => {
  let controller: PrivateTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateTransactionsController],
      providers: [PrivateTransactionsService],
    }).compile();

    controller = module.get<PrivateTransactionsController>(PrivateTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
