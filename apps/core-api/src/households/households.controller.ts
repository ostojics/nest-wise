import {Controller} from '@nestjs/common';
import {HouseholdsService} from './households.service';

@Controller('households')
export class HouseholdsController {
  constructor(private readonly householdsService: HouseholdsService) {}
}
