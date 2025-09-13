import {Test, TestingModule} from '@nestjs/testing';
import {PrivateTransactionsService} from './private-transactions.service';

describe('PrivateTransactionsService', () => {
  let service: PrivateTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateTransactionsService],
    }).compile();

    service = module.get<PrivateTransactionsService>(PrivateTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
