import {Module} from '@nestjs/common';
import {InvitesController} from './invites.controller';
import {UsersModule} from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [InvitesController],
})
export class InvitesModule {}
