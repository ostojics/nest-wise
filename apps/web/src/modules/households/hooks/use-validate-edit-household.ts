import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {UpdateHouseholdDTO, updateHouseholdSchema} from '@maya-vault/contracts';

export const useValidateEditHousehold = () => {
  return useForm<UpdateHouseholdDTO>({
    resolver: zodResolver(updateHouseholdSchema),
  });
};
