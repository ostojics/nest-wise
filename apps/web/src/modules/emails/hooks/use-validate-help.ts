import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {HelpRequestDTO, helpRequestSchema} from '@nest-wise/contracts';

export const useValidateHelp = () => {
  return useForm<HelpRequestDTO>({
    resolver: zodResolver(helpRequestSchema),
    defaultValues: {
      message: '',
    },
  });
};
