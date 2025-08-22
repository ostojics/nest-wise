import {zodResolver} from '@hookform/resolvers/zod';
import {EditAccountDTO, editAccountSchema} from '@maya-vault/contracts';
import {useForm} from 'react-hook-form';

interface UseValidateEditAccountArgs {
  defaultValues: EditAccountDTO;
}

export const useValidateEditAccount = ({defaultValues}: UseValidateEditAccountArgs) => {
  return useForm<EditAccountDTO>({
    resolver: zodResolver(editAccountSchema),
    defaultValues,
  });
};
