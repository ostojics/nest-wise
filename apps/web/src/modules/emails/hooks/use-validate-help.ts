import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {HelpRequestDTO, helpRequestSchema} from '@nest-wise/contracts';

interface UseValidateHelpArgs {
  email: string;
}

export const useValidateHelp = ({email}: UseValidateHelpArgs) => {
  return useForm<HelpRequestDTO>({
    resolver: zodResolver(helpRequestSchema),
    defaultValues: {
      email: email,
      message: '',
    },
  });
};
