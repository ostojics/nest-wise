import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EmailsModule} from 'src/emails/emails.module';
import {HouseholdsModule} from 'src/households/households.module';
import {User} from './user.entity';
import {UsersRepository} from './users.repository';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => HouseholdsModule), EmailsModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
