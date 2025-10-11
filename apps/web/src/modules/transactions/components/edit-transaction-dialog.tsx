import {accountTypes} from '@/common/constants/account-types';
import {DatePicker} from '@/components/date-picker';
import {Button} from '@/components/ui/button';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/use-get-household-categories';
import {useUpdateTransaction} from '@/modules/transactions/hooks/use-update-transaction';
import {useValidateUpdateTransaction} from '@/modules/transactions/hooks/use-validate-update-transaction';
import {TransactionContract, UpdateTransactionDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import React, {useEffect} from 'react';

interface EditTransactionDialogProps {
  transaction: TransactionContract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({transaction, open, onOpenChange}: EditTransactionDialogProps) {
  const {data: accounts} = useGetHouseholdAccounts();
  const {data: categories} = useGetHouseholdCategories();
  const hasAccounts = (accounts ?? []).length > 0;

  const updateTransactionMutation = useUpdateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateUpdateTransaction({transaction});

  const watchedCategoryId = watch('categoryId');
  const watchedType = watch('type');

  const onSubmit = async (data: UpdateTransactionDTO) => {
    await updateTransactionMutation.mutateAsync(
      {id: transaction.id, dto: data},
      {
        onSettled: () => {
          onOpenChange(false);
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

  useEffect(() => {
    if (watchedType === 'income') {
      setValue('categoryId', null);
    }
  }, [watchedType, setValue]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        reset();
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Izmeni transakciju</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-6 px-6">
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
              <Label htmlFor="description">Opis</Label>
              <Input placeholder="Opis transakcije" {...register('description')} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionDate">
                Datum transakcije <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={watch('transactionDate')}
                onChange={(date) => {
                  if (date) {
                    setValue('transactionDate', date);
                  }
                }}
                placeholder="Izaberi datum transakcije"
              />
              {errors.transactionDate && <p className="text-sm text-red-500">{errors.transactionDate.message}</p>}
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={updateTransactionMutation.isPending}>
                  Otkaži
                </Button>
              </DialogClose>
              <Button type="submit" disabled={updateTransactionMutation.isPending}>
                {updateTransactionMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sačuvaj'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
