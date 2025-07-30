import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoriesService} from './categories.service';
import {CategoriesController} from './categories.controller';
import {CategoriesRepository} from './categories.repository';
import {Category} from './categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
