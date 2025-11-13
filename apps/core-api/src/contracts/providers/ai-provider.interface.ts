import {TransactionCategoryResult} from '../../tools/ai/schemas';

/**
 * Message for AI categorization
 */
export interface AiMessage {
  role: 'system' | 'user';
  content: string;
}

/**
 * Request for categorizing a transaction using AI
 */
export interface CategorizeTransactionRequest {
  systemPrompt: string;
  userInput: string;
}

/**
 * Dependency injection token for IAiProvider
 */
export const AI_PROVIDER = Symbol('IAiProvider');

/**
 * Interface for AI provider abstraction
 * Allows swapping AI providers (OpenAI, Anthropic, local models, etc.) without changing business logic
 */
export interface IAiProvider {
  /**
   * Categorize a transaction using AI
   * Parses natural language description to extract transaction details and category
   * @param request The categorization request with system prompt and user input
   * @returns Structured transaction category result
   */
  categorizeTransaction(request: CategorizeTransactionRequest): Promise<TransactionCategoryResult>;
}
