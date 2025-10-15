import {accountTypes} from '@/common/constants/account-types';
import {DatePicker} from '@/components/date-picker';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {dateAtNoon} from '@/lib/utils';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/use-get-household-categories';
import {useCreateTransaction} from '@/modules/transactions/hooks/use-create-transaction';
import {useValidateCreateTransaction} from '@/modules/transactions/hooks/use-validate-create-transaction';
import {CreateTransactionHouseholdDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import {useEffect} from 'react';

interface ManualTransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ManualTransactionForm({onSuccess, onCancel}: ManualTransactionFormProps) {
  const {data: accounts} = useGetHouseholdAccounts();
  const {data: categories} = useGetHouseholdCategories();
  const hasAccounts = (accounts ?? []).length > 0;

  const createTransactionMutation = useCreateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateCreateTransaction({accountId: (accounts ?? [])[0]?.id});

  const watchedCategoryId = watch('categoryId');
  const watchedType = watch('type');
  const transactionDate = watch('transactionDate');

  const onSubmit = async (data: CreateTransactionHouseholdDTO) => {
    await createTransactionMutation.mutateAsync(data, {
      onSuccess: () => {
        onSuccess();
      },
      onError: () => {
        onCancel();
      },
      onSettled: () => {
        reset();
      },
    });
  };

  const getAccountDisplayName = (accountId: string) => {
    const account = accounts?.find((acc) => acc.id === accountId);
    if (!account) return '';

    const accountType = accountTypes.find((type) => type.value === account.type);
    return `${account.name} (${accountType?.label ?? account.type})`;
  };

  useEffect(() => {
    if (watchedType === 'income') {
      setValue('categoryId', null);
    }
  }, [watchedType, setValue]);

  return (
    // @ts-expect-error DTO is inferred from the schema
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

      {watchedType === 'expense' && (
        <div className="space-y-2">
          <Label htmlFor="categoryId">
            Kategorija <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Select value={watchedCategoryId ?? ''} onValueChange={(value) => setValue('categoryId', value)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Izaberi kategoriju" />
              </SelectTrigger>
              <SelectContent>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    <span>Nema dostupnih kategorija. Kreirajte novu na stranici plana.</span>
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="type">
          Tip <span className="text-red-500">*</span>
        </Label>
        <Select value={watch('type')} onValueChange={(value) => setValue('type', value as 'income' | 'expense')}>
          <SelectTrigger>
            <SelectValue />
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
        <Input type="number" step="0.01" placeholder="0.00" {...register('amount')} />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Opis <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Opis transakcije" {...register('description')} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="transactionDate">
          Datum transakcije <span className="text-red-500">*</span>
        </Label>
        <DatePicker
          value={new Date(transactionDate)}
          onChange={(date) => {
            if (date) {
              const adjustedDate = dateAtNoon(date);
              setValue('transactionDate', adjustedDate.toISOString());
            }
          }}
          placeholder="Izaberi datum transakcije"
        />
        {errors.transactionDate && <p className="text-sm text-red-500">{errors.transactionDate.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Otkaži
        </Button>
        <Button type="submit" disabled={createTransactionMutation.isPending}>
          {createTransactionMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Zabeleži transakciju'}
        </Button>
      </div>
    </form>
  );
}
