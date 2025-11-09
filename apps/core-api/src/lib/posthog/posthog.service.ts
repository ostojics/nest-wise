import {Injectable, OnModuleInit, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PostHog} from 'posthog-node';
import {GlobalConfig} from '../../config/config.interface';
import {PosthogConfig, PosthogConfigName} from '../../config/posthog.config';

@Injectable()
export class PosthogService implements OnModuleInit {
  private client: PostHog | null = null;
  private readonly logger = new Logger(PosthogService.name);
  private readonly enabled: boolean;

  constructor(private readonly configService: ConfigService<GlobalConfig>) {
    const config = this.configService.getOrThrow<PosthogConfig>(PosthogConfigName);
    this.enabled = config.enabled;
  }

  onModuleInit() {
    if (!this.enabled) {
      this.logger.warn('PostHog is disabled');
      return;
    }

    const config = this.configService.getOrThrow<PosthogConfig>(PosthogConfigName);
    const apiKey = config.apiKey;
    const host = config.host;

    if (!apiKey) {
      this.logger.error('PostHog API key is missing. Analytics will be disabled.');
      return;
    }

    this.client = new PostHog(apiKey, {host});
    this.logger.log('PostHog client initialized');
  }

  capture(params: {distinctId: string; event: string; properties?: Record<string, any>}): void {
    if (!this.client || !this.enabled) {
      return;
    }

    try {
      this.client.capture({
        distinctId: params.distinctId,
        event: params.event,
        properties: params.properties ?? {},
      });
    } catch (error) {
      this.logger.error('Failed to capture PostHog event', error);
    }
  }

  captureException(error: Error, distinctId: string, metadata?: Record<string, any>): void {
    if (!this.client || !this.enabled) {
      return;
    }

    try {
      this.client.captureException(error, distinctId, {
        properties: {
          exception_message: error.message,
          exception_type: error.name,
          exception_stack: error.stack,
          ...metadata,
        },
      });
    } catch (err) {
      this.logger.error('Failed to capture PostHog exception', err);
    }
  }

  async shutdown(): Promise<void> {
    if (this.client) {
      this.logger.log('Shutting down PostHog client...');
      await this.client.shutdown();
      this.logger.log('PostHog client shut down successfully');
    }
  }
}
