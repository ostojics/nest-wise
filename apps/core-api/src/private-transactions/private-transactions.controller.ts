import {Controller} from '@nestjs/common';
import {PrivateTransactionsService} from './private-transactions.service';

@Controller('private-transactions')
export class PrivateTransactionsController {
  constructor(private readonly privateTransactionsService: PrivateTransactionsService) {}
}
