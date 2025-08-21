import {cn} from '@/lib/utils';

interface FormErrorProps extends React.ComponentProps<'p'> {
  error: string;
}

const FormError = ({error, ...props}: FormErrorProps) => {
  const hasError = Boolean(error);

  return (
    <p
      {...props}
      aria-live={hasError ? 'polite' : 'off'}
      aria-disabled={!hasError}
      className={cn('text-red-500 text-xs min-h-4', props.className)}
    >
      {error}
    </p>
  );
};

export default FormError;
