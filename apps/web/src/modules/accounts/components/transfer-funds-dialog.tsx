import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {TransferFundsDTO} from '@nest-wise/contracts';
import {ArrowLeftRight, Loader2, Wallet} from 'lucide-react';
import {useState} from 'react';
import {useTransferFundsMutation} from '../hooks/use-transfer-funds-mutation';
import {useValidateTransferFunds} from '../hooks/use-validate-transfer-funds';
import {useGetHouseholdAccounts} from '../hooks/use-get-household-accounts';
import {useGetHouseholdById} from '@/modules/households/hooks/use-get-household-by-id';
import AccountSelect from './account-select';

const TransferFundsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {data: accounts = []} = useGetHouseholdAccounts();
  const {data: household} = useGetHouseholdById();
  const mutation = useTransferFundsMutation({
    householdId: household?.id ?? '',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateTransferFunds();

  const fromAccountId = watch('fromAccountId');
  const toAccountId = watch('toAccountId');

  const handleTransferFunds = async (data: TransferFundsDTO) => {
    await mutation.mutateAsync(data, {
      onSettled: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <ArrowLeftRight className="w-4 h-4" />
          Prebaci sredstva
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Prebacivanje sredstava
          </DialogTitle>
          <DialogDescription className="text-left">
            Prebacite novac između svojih računa. Izaberite polazni i odredišni račun i unesite iznos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleTransferFunds)} className="space-y-6">
          <div className="overflow-y-auto flex-1 -mx-6 px-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Polazni račun</Label>
                <AccountSelect
                  accounts={accounts}
                  value={fromAccountId}
                  onChange={(id) => setValue('fromAccountId', id, {shouldValidate: true})}
                  placeholder="Izaberite polazni račun"
                  className="w-full"
                  excludeId={toAccountId}
                />
                {errors.fromAccountId && <FormError error={errors.fromAccountId.message ?? ''} />}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Odredišni račun</Label>
                <AccountSelect
                  accounts={accounts}
                  value={toAccountId}
                  onChange={(id) => setValue('toAccountId', id, {shouldValidate: true})}
                  placeholder="Izaberite odredišni račun"
                  className="w-full"
                  excludeId={fromAccountId}
                />
                {errors.toAccountId && <FormError error={errors.toAccountId.message ?? ''} />}
              </div>

              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Iznos
                </Label>
                <div className="relative">
                  <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register('amount')} />
                </div>
                {errors.amount && <FormError error={errors.amount.message ?? ''} />}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={mutation.isPending}>
                Otkaži
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Prebaci'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferFundsDialog;
