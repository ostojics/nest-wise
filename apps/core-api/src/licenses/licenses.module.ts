import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {License} from './license.entity';
import {LicensesService} from './licenses.service';
import {LicensesRepository} from './licenses.repository';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([License]), UsersModule],
  providers: [LicensesService, LicensesRepository, LicenseGuard],
  exports: [LicensesService, LicenseGuard],
})
export class LicensesModule {}
