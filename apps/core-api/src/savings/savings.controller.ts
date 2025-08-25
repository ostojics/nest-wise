import {Controller} from '@nestjs/common';
import {SavingsService} from './savings.service';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}
}
