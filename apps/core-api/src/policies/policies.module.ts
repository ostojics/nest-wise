import {Global, Module} from '@nestjs/common';
import {PoliciesService} from './policies.service';
import {PoliciesController} from './policies.controller';
import {UsersModule} from 'src/users/users.module';
import {AccountsModule} from 'src/accounts/accounts.module';

@Global()
@Module({
  imports: [UsersModule, AccountsModule],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
