import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {cn} from '@/lib/utils';
import {AcceptInviteDTO} from '@nest-wise/contracts';
import {useSearch} from '@tanstack/react-router';
import {Loader2} from 'lucide-react';
import {useAcceptInvite} from '../hooks/use-accept-invite';
import {useValidateAcceptInvite} from '../hooks/use-validate-accept-invite';

const AcceptInviteForm = ({className, ...props}: React.ComponentProps<'div'>) => {
  const search = useSearch({from: '/invites'});
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useValidateAcceptInvite({token: search.token, email: search.email});
  const mutation = useAcceptInvite();

  const onSubmit = async (data: AcceptInviteDTO) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className={cn('flex flex-col max-w-md w-full p-4', className)} {...props}>
      <Card>
        <CardHeader className="mb-2">
          <CardTitle>Join {search.householdName || 'the household'}</CardTitle>
          <CardDescription className="text-balance">Complete your account details to accept the invite</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 text-left">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input {...register('username', {required: true})} placeholder="e.g. john_smith" />
              <FormError error={errors.username?.message ?? ''} />
            </div>
            <div className="flex flex-col gap-3 text-left">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input {...register('email', {required: true})} type="email" placeholder="m@example.com" />
              <FormError error={errors.email?.message ?? ''} />
            </div>

            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center gap-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input {...register('password', {required: true})} type="password" placeholder="••••••••" />
              <FormError error={errors.password?.message ?? ''} />
            </div>

            <div className="flex flex-col gap-3 text-left">
              <Label htmlFor="confirm_password">
                Confirm password <span className="text-red-500">*</span>
              </Label>
              <Input {...register('confirm_password', {required: true})} type="password" placeholder="••••••••" />
              <FormError error={errors.confirm_password?.message ?? ''} />
            </div>

            <input type="hidden" {...register('token')} />

            <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept invite'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInviteForm;
