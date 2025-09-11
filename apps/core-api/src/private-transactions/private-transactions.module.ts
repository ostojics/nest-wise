import {Module} from '@nestjs/common';
import {PrivateTransactionsService} from './private-transactions.service';
import {PrivateTransactionsController} from './private-transactions.controller';

@Module({
  controllers: [PrivateTransactionsController],
  providers: [PrivateTransactionsService],
})
export class PrivateTransactionsModule {}
