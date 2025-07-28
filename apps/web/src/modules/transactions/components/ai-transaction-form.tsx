import {accountTypes} from '@/common/constants/account-types';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/useGetHouseholdAccounts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import {useCreateTransactionAI} from '@/modules/transactions/hooks/useCreateTransactionAI';
import {useValidateCreateAiTransaction, CreateTransactionAiDTO} from '@maya-vault/validation';
import AiBanner from './ai-banner';

interface AiTransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AiTransactionForm({onSuccess, onCancel}: AiTransactionFormProps) {
  const {data: me} = useGetMe();
  const {data: household} = useGetHouseholdById(me?.householdId ?? '');
  const {data: accounts} = useGetHouseholdAccounts(household?.id ?? '');

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
              {accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {getAccountDisplayName(account.id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Input placeholder="e.g. Grocery shopping - 100, Salary - 2000..." {...register('description')} />
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
