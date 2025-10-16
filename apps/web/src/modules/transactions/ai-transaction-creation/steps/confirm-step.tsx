import * as React from 'react';
import {accountTypes} from '@/common/constants/account-types';
import {DatePicker} from '@/components/date-picker';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {dateAtNoon} from '@/lib/utils';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/use-get-household-categories';
import {useCreateCategory} from '@/modules/categories/hooks/use-create-category';
import {useCreateTransaction} from '@/modules/transactions/hooks/use-create-transaction';
import {useValidateConfirmTransaction} from '@/modules/transactions/hooks/use-validate-confirm-transaction';
import {CreateTransactionHouseholdDTO} from '@nest-wise/contracts';
import {useCreateTransactionDialog} from '@/contexts/create-transaction-dialog-context';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {toast} from 'sonner';
import {useEffect} from 'react';
import {useAiTransactionCreation} from '@/contexts/ai-transaction-creation-context';
import {useAiSuggestionMutationState} from '../../hooks/use-ai-suggestion-mutation-state';
import {ConfirmationBanner} from './confirm-step-components/confirmation-banner';
import {CategoryField} from './confirm-step-components/category-field';
import {FormActions} from './confirm-step-components/form-actions';

export default function ConfirmStep() {
  const {data: accounts} = useGetHouseholdAccounts();
  const {data: categories} = useGetHouseholdCategories();
  const {reset: resetFlow} = useAiTransactionCreation();
  const {data: me} = useGetMe();
  const hasAccounts = (accounts ?? []).length > 0;
  const {close} = useCreateTransactionDialog();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  const suggestion = useAiSuggestionMutationState((mutation) => mutation.data);

  const createTransactionMutation = useCreateTransaction();
  const createCategoryMutation = useCreateCategory(me?.householdId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useValidateConfirmTransaction({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    accountId: suggestion?.accountId ?? (accounts ?? [])[0]?.id,
  });

  const watchedCategoryId = watch('categoryId');
  const watchedType = watch('type');
  const transactionDate = watch('transactionDate');

  const onSubmit = async (data: CreateTransactionHouseholdDTO) => {
    let finalCategoryId = data.categoryId;

    // For expense transactions, ensure we have a category (either selected or will be created)
    const shouldCreateNewCategory = Boolean(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      suggestion?.newCategorySuggested && suggestion.suggestedCategory.newCategoryName && !data.categoryId,
    );

    if (data.type === 'expense' && !data.categoryId && !shouldCreateNewCategory) {
      toast.error('Kategorija je obavezna za rashodne transakcije');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (shouldCreateNewCategory && suggestion.suggestedCategory.newCategoryName) {
      try {
        const newCategory = await createCategoryMutation.mutateAsync({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          name: suggestion.suggestedCategory.newCategoryName,
        });
        finalCategoryId = newCategory.id;
      } catch {
        toast.error('Greška pri kreiranju nove kategorije.');
        resetFlow();
        close();
        return;
      }
    }

    await createTransactionMutation.mutateAsync(
      {
        ...data,
        categoryId: finalCategoryId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        description: suggestion?.description ?? data.description,
      },
      {
        onSettled: () => {
          close();
          resetFlow();
        },
      },
    );
  };

  const getAccountDisplayName = (accountId: string) => {
    const account = accounts?.find((acc) => acc.id === accountId);
    if (!account) return '';

    const accountType = accountTypes.find((type) => type.value === account.type);
    return `${account.name} (${accountType?.label ?? account.type})`;
  };

  const isProcessing = createTransactionMutation.isPending || createCategoryMutation.isPending;

  useEffect(() => {
    if (watchedType === 'income') {
      setValue('categoryId', null);
    }
  }, [watchedType, setValue]);

  useEffect(() => {
    if (suggestion) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setValue('type', suggestion.transactionType);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setValue('amount', suggestion.transactionAmount);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setValue('transactionDate', suggestion.transactionDate);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setValue('description', suggestion.description);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (suggestion.transactionType !== 'income' && !suggestion.newCategorySuggested) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setValue('categoryId', suggestion.suggestedCategory.existingCategoryId ?? null);
      }
    }
  }, [suggestion, setValue]);

  return (
    <div className="space-y-4">
      <ConfirmationBanner />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountId">
            Račun <span className="text-red-500">*</span>
          </Label>
          <Select value={watch('accountId')} onValueChange={(value) => setValue('accountId', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Izaberi račun" />
            </SelectTrigger>
            <SelectContent>
              {!hasAccounts && <span className="text-sm text-muted-foreground">Nema dostupnih računa.</span>}
              {hasAccounts &&
                accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {getAccountDisplayName(account.id)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">
            Tip <span className="text-red-500">*</span>
          </Label>
          <Select value={watch('type')} onValueChange={(value) => setValue('type', value as 'income' | 'expense')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Izaberi tip" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Rashod</SelectItem>
              <SelectItem value="income">Prihod</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">
            Iznos <span className="text-red-500">*</span>
          </Label>
          <Input type="number" placeholder="0.00" step="0.01" {...register('amount')} />
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>

        {watchedType === 'expense' && (
          <CategoryField
            suggestion={suggestion}
            categories={categories}
            value={watchedCategoryId}
            onChange={(value) => setValue('categoryId', value)}
            error={errors.categoryId?.message}
          />
        )}

        <div className="space-y-2">
          <Label htmlFor="transactionDate">
            Datum <span className="text-red-500">*</span>
          </Label>
          <DatePicker
            value={transactionDate ? new Date(transactionDate) : undefined}
            onChange={(date: Date | undefined) =>
              setValue('transactionDate', date ? dateAtNoon(date).toISOString() : '')
            }
          />
          {errors.transactionDate && <p className="text-sm text-red-500">{errors.transactionDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Opis</Label>
          <Input
            placeholder="Opis transakcije"
            {...register('description')}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            defaultValue={suggestion?.description ?? ''}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <FormActions onCancel={close} isProcessing={isProcessing} />
      </form>
    </div>
  );
}
