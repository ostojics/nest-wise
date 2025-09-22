import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoriesService} from './categories.service';
import {CategoriesController} from './categories.controller';
import {CategoriesRepository} from './categories.repository';
import {Category} from './categories.entity';
import {LicensesModule} from 'src/licenses/licenses.module';
import {HouseholdsModule} from 'src/households/households.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), LicensesModule, forwardRef(() => HouseholdsModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
