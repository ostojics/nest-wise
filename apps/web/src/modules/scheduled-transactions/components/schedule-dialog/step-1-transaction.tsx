import {accountTypes} from '@/common/constants/account-types';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {getAccountDisplayName} from '@/lib/utils';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/use-get-household-categories';
import {TransactionDetailsFormData, useValidateTransactionDetails} from '../../hooks/use-validate-transaction-details';
import {useScheduleDialogContext} from '../../context/schedule-dialog.context';
import {useEffect} from 'react';

export default function Step1Transaction() {
  const {data: accounts} = useGetHouseholdAccounts();
  const {data: categories} = useGetHouseholdCategories();
  const hasAccounts = (accounts ?? []).length > 0;

  const {setCurrentStep, setTransactionDetails, transactionDetails} = useScheduleDialogContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useValidateTransactionDetails({
    accountId: transactionDetails?.accountId ?? (accounts ?? [])[0]?.id,
  });

  const watchedCategoryId = watch('categoryId');
  const watchedType = watch('type');

  const onSubmit = (data: TransactionDetailsFormData) => {
    setTransactionDetails(data);
    setCurrentStep(2);
  };

  useEffect(() => {
    if (watchedType === 'income') {
      setValue('categoryId', null);
    }
  }, [watchedType, setValue]);

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountId">
          Račun <span className="text-red-500">*</span>
        </Label>
        <Select value={watch('accountId')} onValueChange={(value) => setValue('accountId', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Izaberi račun" />
          </SelectTrigger>
          <SelectContent>
            {!hasAccounts && <span className="text-sm text-muted-foreground p-2">Nema dostupnih računa.</span>}
            {hasAccounts &&
              accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {getAccountDisplayName({accountId: account.id, accounts, accountTypes})}
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
        <Select value={watch('type')} onValueChange={(value: 'income' | 'expense') => setValue('type', value)}>
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

      {watchedType === 'expense' && (
        <div className="space-y-2">
          <Label htmlFor="categoryId">Kategorija</Label>
          <Select value={watchedCategoryId ?? ''} onValueChange={(value) => setValue('categoryId', value || null)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Izaberi kategoriju" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Bez kategorije</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">
          Iznos <span className="text-red-500">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', {valueAsNumber: true})}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Opis</Label>
        <Input
          id="description"
          type="text"
          placeholder="Opis transakcije..."
          {...register('description', {
            setValueAs: (v: unknown) => (v === '' ? null : (v as string)),
          })}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Dalje</Button>
      </div>
    </form>
  );
}
