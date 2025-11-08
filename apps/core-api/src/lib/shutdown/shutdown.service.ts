import {Injectable, OnModuleDestroy, Logger} from '@nestjs/common';
import {PosthogService} from '../posthog/posthog.service';

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  private readonly logger = new Logger(ShutdownService.name);

  constructor(private readonly posthogService: PosthogService) {}

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Application shutdown initiated');
    await this.posthogService.shutdown();
  }
}
