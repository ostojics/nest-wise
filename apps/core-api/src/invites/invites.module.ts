import {Module} from '@nestjs/common';
import {InvitesController} from './invites.controller';
import {UsersModule} from 'src/users/users.module';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [InvitesController],
})
export class InvitesModule {}
