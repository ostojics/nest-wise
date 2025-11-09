import {Module, Global} from '@nestjs/common';
import {ShutdownService} from './shutdown.service';
import {PosthogModule} from '../posthog/posthog.module';

@Global()
@Module({
  imports: [PosthogModule],
  providers: [ShutdownService],
  exports: [ShutdownService],
})
export class ShutdownModule {}
