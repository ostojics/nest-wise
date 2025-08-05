import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {updateHouseholdSchema} from '../schemas';

export const useValidateEditHousehold = () => {
  return useForm({
    resolver: zodResolver(updateHouseholdSchema),
  });
};
