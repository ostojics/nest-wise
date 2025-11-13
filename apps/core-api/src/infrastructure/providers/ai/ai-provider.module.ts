import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {OpenAiProvider} from './openai.provider';
import {AI_PROVIDER} from '../../../contracts/providers/ai-provider.interface';

/**
 * AI Provider Module
 * Provides AI categorization capabilities with pluggable providers
 */
@Module({
  imports: [ConfigModule],
  providers: [
    OpenAiProvider,
    {
      provide: AI_PROVIDER,
      useExisting: OpenAiProvider,
    },
  ],
  exports: [AI_PROVIDER],
})
export class AiProviderModule {}
