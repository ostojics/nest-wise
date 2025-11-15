import {Injectable, Inject, BadRequestException} from '@nestjs/common';
import {CreateTransactionAiHouseholdDTO} from '@nest-wise/contracts';
import {DataSource} from 'typeorm';
import {Logger} from 'pino-nestjs';
import {IUseCase} from '../base-use-case';
import {Transaction} from '../../../transactions/transaction.entity';
import {AccountsService} from '../../../accounts/accounts.service';
import {HouseholdsService} from '../../../households/households.service';
import {CategoriesService} from '../../../categories/categories.service';
import {TransactionType} from '../../../common/enums/transaction.type.enum';
import {categoryPromptFactory} from '../../../tools/ai/prompts/category.prompt';
import {ITransactionRepository, TRANSACTION_REPOSITORY} from '../../../repositories/transaction.repository.interface';
import {IAiProvider, AI_PROVIDER} from '../../../providers/ai-provider.interface';

export interface CreateAiTransactionForHouseholdInput {
  householdId: string;
  transactionData: CreateTransactionAiHouseholdDTO;
}

@Injectable()
export class CreateAiTransactionForHouseholdUseCase
  implements IUseCase<CreateAiTransactionForHouseholdInput, Transaction>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionsRepository: ITransactionRepository,
    private readonly accountsService: AccountsService,
    private readonly householdsService: HouseholdsService,
    private readonly categoriesService: CategoriesService,
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
    @Inject(AI_PROVIDER) private readonly aiProvider: IAiProvider,
  ) {}

  async execute(input: CreateAiTransactionForHouseholdInput): Promise<Transaction> {
    const {householdId, transactionData} = input;

    const account = await this.accountsService.findAccountById(transactionData.accountId);

    // Verify account belongs to the household
    if (account.householdId !== householdId) {
      throw new BadRequestException('Račun ne pripada navedenom domaćinstvu');
    }

    const household = await this.householdsService.findHouseholdById(householdId);
    const categories = await this.categoriesService.findCategoriesByHouseholdId(household.id);
    const systemPrompt = categoryPromptFactory({
      categories,
      currentDate: transactionData.currentDate,
    });

    this.logger.debug('AI Category System Prompt', {systemPrompt});
    this.logger.debug('AI Category User Input', {userInput: transactionData.description});

    // Use AI provider abstraction instead of direct OpenAI SDK
    const object = await this.aiProvider.categorizeTransaction({
      systemPrompt,
      userInput: transactionData.description,
    });

    if (object.transactionType === 'expense' && Number(account.currentBalance) < object.transactionAmount) {
      this.logger.error('Insufficient funds for expense', {
        accountId: account.id,
        transactionAmount: object.transactionAmount,
      });
      throw new BadRequestException('Nedovoljno sredstava za ovaj rashod');
    }

    return await this.dataSource.transaction(async () => {
      const isNewCategorySuggested = object.newCategorySuggested;
      let categoryId: string | null = null;

      if (isNewCategorySuggested) {
        const newCategory = await this.categoriesService.createCategoryForHousehold(householdId, {
          name: object.suggestedCategory.newCategoryName,
        });

        categoryId = newCategory.id;
      } else {
        categoryId = object.suggestedCategory.existingCategoryId;
      }

      const transaction = await this.transactionsRepository.create({
        description: object.transactionDescription,
        amount: object.transactionAmount,
        type: object.transactionType as TransactionType,
        categoryId: object.transactionType === 'income' ? null : categoryId,
        householdId: household.id,
        accountId: account.id,
        transactionDate: object.transactionDate,
        isReconciled: true,
      });

      await this.updateBalance(transaction.accountId, transaction.amount, transaction.type);

      return transaction;
    });
  }

  private async updateBalance(accountId: string, amount: number, type: TransactionType): Promise<void> {
    const account = await this.accountsService.findAccountById(accountId);

    const currentBalance = Number(account.currentBalance);
    let newBalance = currentBalance;

    if (type === TransactionType.INCOME) {
      newBalance += amount;
    } else {
      newBalance -= amount;
    }

    await this.accountsService.updateAccount(accountId, {
      currentBalance: newBalance,
    });
  }
}
