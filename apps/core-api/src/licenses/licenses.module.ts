import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {License} from './license.entity';
import {LicensesService} from './licenses.service';
import {LicensesRepository} from './licenses.repository';

@Module({
  imports: [TypeOrmModule.forFeature([License])],
  providers: [LicensesService, LicensesRepository],
  exports: [LicensesService],
})
export class LicensesModule {}
