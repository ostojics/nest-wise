import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {License} from './license.entity';
import {LicensesService} from './licenses.service';
import {LicensesRepository} from './licenses.repository';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([License]), forwardRef(() => UsersModule)],
  providers: [LicensesService, LicensesRepository, LicenseGuard],
  exports: [LicensesService, LicenseGuard, forwardRef(() => UsersModule)],
})
export class LicensesModule {}
