import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {UpdateHouseholdDTO, updateHouseholdSchema} from '@nest-wise/contracts';

export const useValidateEditHousehold = () => {
  return useForm<UpdateHouseholdDTO>({
    resolver: zodResolver(updateHouseholdSchema),
  });
};
