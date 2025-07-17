import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {UserRegistrationDTO} from '@maya-vault/validation';
import FormError from '@/components/form-error';
import {useValidateStep1} from '../hooks/useValidateStep1';
import {useSetupContext} from '../hooks/useSetup';
import {Loader2} from 'lucide-react';

const Step1 = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useValidateStep1();
  const {setUserData, nextStep} = useSetupContext();

  const handleUserSetup = (data: UserRegistrationDTO) => {
    setUserData(data);
    nextStep();
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Your Journey to Financial Clarity Starts Here</CardTitle>
          <CardDescription>
            Set up your secure access to Maya Finance and unlock intelligent money management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleUserSetup)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  {...register('username', {required: true})}
                  id="username"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
                {errors.username && <FormError error={errors.username.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email', {required: true})}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {errors.email && <FormError error={errors.email.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register('password', {required: true})}
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                {errors.password && <FormError error={errors.password.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  {...register('confirm_password', {required: true})}
                  id="confirm_password"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {errors.confirm_password && <FormError error={errors.confirm_password.message ?? ''} />}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step1;
