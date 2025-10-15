import {accountTypes} from '@/common/constants/account-types';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useValidateCreateAiTransactionSuggestion} from '@/modules/transactions/hooks/use-validate-create-ai-transaction';
import {CreateTransactionAiHouseholdDTO} from '@nest-wise/contracts';
import AiBanner from '../../components/ai-banner';
import {AiDescriptionTooltip} from '../../components/ai-description-tooltip';
import {useAiTransactionCreation} from '../context';
import {useCreateTransactionDialog} from '../../components/create-transaction-dialog.context';
import {useCreateTransactionAISuggestion} from '../../hooks/use-create-transaction-ai-suggestion';

export default function InputStep() {
  const {data: accounts} = useGetHouseholdAccounts();
  const hasAccounts = (accounts ?? []).length > 0;
  const {setStep} = useAiTransactionCreation();
  const {close} = useCreateTransactionDialog();
  const suggestionMutation = useCreateTransactionAISuggestion();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useValidateCreateAiTransactionSuggestion({accountId: (accounts ?? [])[0]?.id});

  const onSubmit = (data: CreateTransactionAiHouseholdDTO) => {
    setStep('processing');

    suggestionMutation.mutate(data, {
      onSuccess: () => {
        setStep('confirm');
      },
      onError: () => {
        setStep('input');
      },
    });
  };

  const getAccountDisplayName = (accountId: string) => {
    const account = accounts?.find((acc) => acc.id === accountId);
    if (!account) return '';

    const accountType = accountTypes.find((type) => type.value === account.type);
    return `${account.name} (${accountType?.label ?? account.type})`;
  };

  return (
    <div className="space-y-4">
      <AiBanner />
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
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="description">
              Opis <span className="text-red-500">*</span>
            </Label>
            <AiDescriptionTooltip />
          </div>
          <Input placeholder="npr. Kupovina namirnica za 2000 RSD" {...register('description')} />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close}>
            Otkaži
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
          >
            Zabeleži transakciju
          </Button>
        </div>
      </form>
    </div>
  );
}
