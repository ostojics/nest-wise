import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ForgotPasswordDTO} from '@nest-wise/contracts';
import {useValidateForgotPassword} from '../hooks/useValidateForgotPassword';
import FormError from '@/components/form-error';
import {useForgotPassword} from '../hooks/useForgotPassword';
import {Loader2} from 'lucide-react';
import {Link} from '@tanstack/react-router';

const ForgotPasswordForm = ({className, ...props}: React.ComponentProps<'div'>) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateForgotPassword();
  const mutation = useForgotPassword();

  const handleForgotPassword = (data: ForgotPasswordDTO) => {
    mutation.mutate(data);
  };

  return (
    <div className={cn('flex flex-col w-md p-4', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => handleForgotPassword(data))}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input {...register('email', {required: true})} placeholder="m@example.com" />
                {errors.email && <FormError error={errors.email.message ?? ''} />}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Remember your password?{' '}
              <Link to="/login" className="underline underline-offset-4">
                Back to login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
