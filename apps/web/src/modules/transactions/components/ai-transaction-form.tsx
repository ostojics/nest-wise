import {accountTypes} from '@/common/constants/account-types';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/useGetHouseholdAccounts';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import {useCreateTransactionAI} from '@/modules/transactions/hooks/useCreateTransactionAI';
import {CreateTransactionAiDTO} from '@nest-wise/contracts';
import {useValidateCreateAiTransaction} from '@/modules/transactions/hooks/useValidateCreateAiTransaction';
import AiBanner from './ai-banner';
import {AiDescriptionTooltip} from './ai-description-tooltip';

interface AiTransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AiTransactionForm({onSuccess, onCancel}: AiTransactionFormProps) {
  const {data: household} = useGetHouseholdById();
  const {data: accounts} = useGetHouseholdAccounts();
  const hasAccounts = (accounts ?? []).length > 0;

  const createAiTransactionMutation = useCreateTransactionAI();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateCreateAiTransaction({
    householdId: household?.id ?? '',
  });

  const onSubmit = async (data: CreateTransactionAiDTO) => {
    await createAiTransactionMutation.mutateAsync(data);
    onSuccess();
    reset();
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
            Account <span className="text-red-500">*</span>
          </Label>
          <Select value={watch('accountId')} onValueChange={(value) => setValue('accountId', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {!hasAccounts && <span className="text-sm text-muted-foreground">No accounts available.</span>}
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
              Description <span className="text-red-500">*</span>
            </Label>
            <AiDescriptionTooltip />
          </div>
          <Input placeholder="e.g. Bought groceries for 120" {...register('description')} />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createAiTransactionMutation.isPending}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
          >
            {createAiTransactionMutation.isPending ? 'Processing...' : 'Log Transaction'}
          </Button>
        </div>
      </form>
    </div>
  );
}
