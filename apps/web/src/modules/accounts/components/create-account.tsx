import {accountTypes} from '@/common/constants/account-types';
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {useGetHouseholdById} from '@/modules/households/hooks/use-get-household-by-id';
import {CreateAccountHouseholdScopedDTO} from '@nest-wise/contracts';
import {useValidateCreateAccount} from '@/modules/accounts/hooks/use-validate-create-account';
import {Loader2, PlusIcon, Wallet} from 'lucide-react';
import {useCreateAccountMutation} from '../hooks/use-create-account-mutation';
import {useState} from 'react';
import SelectedAccountType from './selected-account-type';

const CreateAccount = () => {
  const {data} = useGetMe();
  const {data: household} = useGetHouseholdById();
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useCreateAccountMutation({
    householdId: household?.id ?? '',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateCreateAccount({ownerId: data?.id ?? ''});

  const onSubmit = (data: CreateAccountHouseholdScopedDTO) => {
    mutation.mutate(data, {
      onSettled: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  const handleTypeChange = (value: string) => {
    setValue('type', value as CreateAccountHouseholdScopedDTO['type']);
  };

  const selectedType = watch('type');

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
        <Button data-testid="create-account-button">
          <PlusIcon className="w-4 h-4" />
          Dodaj račun
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col" data-testid="create-account-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Kreiraj novi račun
          </DialogTitle>
          <DialogDescription className="text-left">
            Dodajte novi finansijski račun kako biste pratili novac iz različitih izvora i za različite ciljeve.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium">
                Naziv računa
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="npr. Tekući račun, Fond za hitne slučajeve"
                className="w-full"
                data-testid="account-name-input"
              />
              {errors.name && <FormError error={errors.name.message ?? 'Neispravan naziv računa'} />}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Tip računa</Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full" data-testid="account-type-select">
                  <SelectValue placeholder="Izaberite tip računa" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => {
                    return (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="cursor-pointer"
                        data-testid={`account-type-option-${type.value}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="font-medium">{type.label}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.type && <FormError error={errors.type.message ?? ''} />}
            </div>
            <SelectedAccountType type={selectedType} />
            <div className="space-y-3">
              <Label htmlFor="initialBalance" className="text-sm font-medium">
                Početno stanje
              </Label>
              <div className="relative">
                <Input
                  id="initialBalance"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  {...register('initialBalance')}
                  placeholder="0,00"
                  data-testid="account-initial-balance-input"
                />
              </div>
              {errors.initialBalance && <FormError error={errors.initialBalance.message ?? ''} />}
              <p className="text-xs text-muted-foreground">
                Unesite trenutno stanje ovog računa. Ovo možete kasnije izmeniti.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={mutation.isPending}>
                  Otkaži
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending} data-testid="create-account-submit">
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Kreiraj račun'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccount;
