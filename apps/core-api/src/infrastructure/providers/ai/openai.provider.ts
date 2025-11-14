import {Injectable, BadGatewayException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Logger} from 'pino-nestjs';
import OpenAI from 'openai';
import {zodTextFormat} from 'openai/helpers/zod';
import {IAiProvider, CategorizeTransactionRequest} from '../../../providers/ai-provider.interface';
import {TransactionCategoryResult, transactionCategoryOutputSchema} from '../../../tools/ai/schemas';
import {AppConfig, AppConfigName} from '../../../config/app.config';

/**
 * OpenAI implementation of the AI provider
 * Uses OpenAI's API for transaction categorization
 */
@Injectable()
export class OpenAiProvider implements IAiProvider {
  private readonly openAiClient: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const config = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.openAiClient = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async categorizeTransaction(request: CategorizeTransactionRequest): Promise<TransactionCategoryResult> {
    this.logger.debug('AI categorization request', {
      systemPromptLength: request.systemPrompt.length,
      userInput: request.userInput,
    });

    try {
      const response = await this.openAiClient.responses.parse({
        model: 'gpt-4o-mini',
        input: [
          {role: 'system', content: request.systemPrompt},
          {role: 'user', content: request.userInput},
        ],
        max_output_tokens: 256,
        text: {
          format: zodTextFormat(transactionCategoryOutputSchema, 'object'),
        },
      });

      const result = response.output_parsed;
      if (!result) {
        this.logger.error('AI response parsing failed', {response});
        throw new BadGatewayException('Nije moguće odrediti kategoriju transakcije putem AI');
      }

      this.logger.debug('AI categorization successful', {
        transactionType: result.transactionType,
        amount: result.transactionAmount,
        newCategorySuggested: result.newCategorySuggested,
      });

      return result;
    } catch (error) {
      this.logger.error('AI categorization failed', {error});
      throw new BadGatewayException('Nije moguće odrediti kategoriju transakcije putem AI');
    }
  }
}
