import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoriesService} from './categories.service';
import {CategoriesController} from './categories.controller';
import {CategoriesRepository} from './categories.repository';
import {Category} from './categories.entity';
import {LicensesModule} from 'src/licenses/licenses.module';
import {LicenseGuard} from 'src/common/guards/license.guard';
import {HouseholdsModule} from 'src/households/households.module';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), LicensesModule, UsersModule, forwardRef(() => HouseholdsModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, LicenseGuard],
  exports: [CategoriesService],
})
export class CategoriesModule {}
