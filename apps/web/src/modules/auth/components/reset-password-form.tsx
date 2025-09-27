import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ResetPasswordDTO} from '@nest-wise/contracts';
import {useValidateResetPassword} from '../hooks/use-validate-reset-password';
import FormError from '@/components/form-error';
import {useResetPassword} from '../hooks/use-reset-password';
import {Loader2} from 'lucide-react';
import {Link, useSearch} from '@tanstack/react-router';

const ResetPasswordForm = ({className, ...props}: React.ComponentProps<'div'>) => {
  const search = useSearch({from: '/reset-password'});
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateResetPassword(search.token || '');
  const mutation = useResetPassword();

  const handleResetPassword = (data: ResetPasswordDTO) => {
    mutation.mutate(data);
  };

  return (
    <div className={cn('flex flex-col w-md p-4', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => handleResetPassword(data))}>
            <input {...register('token')} type="hidden" />
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password">New Password</Label>
                <Input {...register('password', {required: true})} type="password" />
                {errors.password && <FormError error={errors.password.message ?? ''} />}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input {...register('confirm_password', {required: true})} type="password" />
                {errors.confirm_password && <FormError error={errors.confirm_password.message ?? ''} />}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
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

export default ResetPasswordForm;
