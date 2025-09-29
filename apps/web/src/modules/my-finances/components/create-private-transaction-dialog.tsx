import {DatePicker} from '@/components/date-picker';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useCreatePrivateTransaction} from '@/modules/my-finances/hooks/use-create-private-transaction';
import {useValidateCreatePrivateTransaction} from '@/modules/my-finances/hooks/use-validate-create-private-transaction';
import {CreatePrivateTransactionDTO} from '@nest-wise/contracts';
import {DialogClose, DialogTrigger} from '@radix-ui/react-dialog';
import {Loader2} from 'lucide-react';
import {useState} from 'react';

export function CreatePrivateTransactionDialog() {
  const [open, setOpen] = useState(false);
  const {data: accounts} = useGetHouseholdAccounts();
  const createMutation = useCreatePrivateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateCreatePrivateTransaction();

  const onSubmit = async (data: CreatePrivateTransactionDTO) => {
    await createMutation.mutateAsync(data, {
      onSettled: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Zabeleži privatnu transakciju</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Zabeleži privatnu transakciju</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">Kreiraj privatnu transakciju</DialogDescription>

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
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
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
              value={watch('transactionDate')}
              onChange={(date) => setValue('transactionDate', date ?? new Date())}
              placeholder="Izaberi datum transakcije"
            />
            {errors.transactionDate && <p className="text-sm text-red-500">{errors.transactionDate.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Otkaži
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Zabeleži transakciju'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
