import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {UsersRepository} from './users.repository';
import {User} from './user.entity';
import {HouseholdsModule} from 'src/households/households.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HouseholdsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
