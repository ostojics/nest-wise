import {accountTypes} from '@/common/constants/account-types';
import {Button} from '@/components/ui/button';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {AccountContract, EditAccountDTO} from '@nest-wise/contracts';
import {DialogDescription, DialogTrigger} from '@radix-ui/react-dialog';
import {Loader2, Pencil} from 'lucide-react';
import React from 'react';
import SelectedAccountType from './selected-account-type';
import {useValidateEditAccount} from '../hooks/use-validate-edit-account';
import FormError from '@/components/form-error';
import {useEditAccountMutation} from '../hooks/use-edit-account-mutation';

interface EditAccountDialogProps {
  account: AccountContract;
}

const EditAccountDialog: React.FC<EditAccountDialogProps> = ({account}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
    setValue,
    reset,
  } = useValidateEditAccount({
    defaultValues: {
      name: account.name,
      currentBalance: account.currentBalance,
      type: account.type as EditAccountDTO['type'],
    },
  });
  const mutation = useEditAccountMutation();
  const selectedType = watch('type');

  const handleEditAccount = async (data: EditAccountDTO) => {
    await mutation.mutateAsync(
      {id: account.id, dto: data},
      {
        onSettled: () => {
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value);
          if (!value) {
            reset({
              name: account.name,
              currentBalance: account.currentBalance,
              type: account.type as EditAccountDTO['type'],
            });
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="ghost" title="Izmeni račun" size="icon" aria-label="Izmeni račun">
            <Pencil className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Izmeni račun</DialogTitle>
            <DialogDescription className="sr-only">Izmenite detalje računa</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditAccount)}>
            <div className="flex flex-col gap-6 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-name">Naziv</Label>
                <Input id="edit-account-name" {...register('name', {required: true})} />
                {errors.name?.message && <FormError error={errors.name.message} />}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-type">Tip</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => setValue('type', value as EditAccountDTO['type'])}
                >
                  <SelectTrigger id="edit-account-type" className="w-full">
                    <SelectValue placeholder="Izaberite tip" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type?.message && <FormError error={errors.type.message} />}
              </div>
              <SelectedAccountType type={selectedType} />
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-balance">Trenutno stanje</Label>
                <Input
                  id="edit-account-balance"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  {...register('currentBalance')}
                />
                {errors.currentBalance?.message && <FormError error={errors.currentBalance.message} />}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={mutation.isPending}>
                  Otkaži
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sačuvaj'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAccountDialog;
