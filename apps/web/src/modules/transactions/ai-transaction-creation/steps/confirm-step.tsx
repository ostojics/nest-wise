import * as React from 'react';
import {accountTypes} from '@/common/constants/account-types';
import {DatePicker} from '@/components/date-picker';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {dateAtNoon} from '@/lib/utils';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/use-get-household-categories';
import {useCreateCategory} from '@/modules/categories/hooks/use-create-category';
import {useCreateTransaction} from '@/modules/transactions/hooks/use-create-transaction';
import {useValidateCreateTransaction} from '@/modules/transactions/hooks/use-validate-create-transaction';
import {AiTransactionSuggestion, CreateTransactionHouseholdDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import {useCreateTransactionDialog} from '../../components/create-transaction-dialog.context';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {useMutationState} from '@tanstack/react-query';
import {mutationKeys} from '@/modules/api/mutation-keys';
import {toast} from 'sonner';
import {useEffect} from 'react';
import {useAiTransactionCreation} from '../context';

export default function ConfirmStep() {
  const {data: accounts} = useGetHouseholdAccounts();
  const {data: categories} = useGetHouseholdCategories();
  const {reset: resetFlow} = useAiTransactionCreation();
  const {data: me} = useGetMe();
  const hasAccounts = (accounts ?? []).length > 0;
  const {close} = useCreateTransactionDialog();
  const transactionSuggestions = useMutationState({
    filters: {mutationKey: mutationKeys.transactions.createAiTransactionSuggestion()},
    select: (mutation) => mutation.state.data,
  });
  const suggestion = transactionSuggestions.at(-1) as AiTransactionSuggestion | undefined;

  const createTransactionMutation = useCreateTransaction();
  const createCategoryMutation = useCreateCategory(me?.householdId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useValidateCreateTransaction({
    accountId: suggestion?.accountId ?? (accounts ?? [])[0]?.id,
  });

  const watchedCategoryId = watch('categoryId');
  const watchedType = watch('type');
  const transactionDate = watch('transactionDate');

  const onSubmit = async (data: CreateTransactionHouseholdDTO) => {
    let finalCategoryId = data.categoryId;

    if (suggestion?.newCategorySuggested && suggestion.suggestedCategory.newCategoryName) {
      await createCategoryMutation.mutateAsync(
        {
          name: suggestion.suggestedCategory.newCategoryName,
        },
        {
          onSuccess: (data) => {
            finalCategoryId = data.id;
          },
          onError: () => {
            toast.error('Greška pri kreiranju nove kategorije.');
            resetFlow();
            close();
          },
        },
      );
    }

    await createTransactionMutation.mutateAsync(
      {
        ...data,
        categoryId: finalCategoryId,
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
      setValue('type', suggestion.transactionType);
      setValue('amount', suggestion.transactionAmount);
      setValue('transactionDate', suggestion.transactionDate);
      setValue('description', suggestion.description);
      if (suggestion.transactionType !== 'income') {
        setValue('categoryId', suggestion.suggestedCategory.existingCategoryId ?? null);
      }
    }
  }, [suggestion, setValue]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
          AI je analizirao vašu transakciju. Proverite i potvrdite detalje.
        </p>
      </div>

      {/* @ts-expect-error DTO is inferred from the schema */}
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
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Kategorija <span className="text-red-500">*</span>
            </Label>
            {suggestion?.newCategorySuggested && suggestion.suggestedCategory.newCategoryName ? (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>Nova kategorija:</strong> {suggestion.suggestedCategory.newCategoryName}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Ova kategorija će biti automatski kreirana
                </p>
              </div>
            ) : (
              <>
                <Select
                  value={watchedCategoryId ?? ''}
                  onValueChange={(value) => setValue('categoryId', value || null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Izaberi kategoriju" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).length === 0 && (
                      <span className="text-sm text-muted-foreground">Nema dostupnih kategorija.</span>
                    )}
                    {(categories ?? []).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
              </>
            )}
          </div>
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
            defaultValue={suggestion?.description ?? ''}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div className="flex justify-between gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close} disabled={isProcessing}>
            Otkaži
          </Button>
          <Button
            type="submit"
            disabled={isProcessing}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Potvrdi transakciju'}
          </Button>
        </div>
      </form>
    </div>
  );
}
