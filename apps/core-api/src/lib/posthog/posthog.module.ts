import {Module, Global} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PosthogService} from './posthog.service';
import {posthogConfig} from '../../config/posthog.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(posthogConfig)],
  providers: [PosthogService],
  exports: [PosthogService],
})
export class PosthogModule {}
