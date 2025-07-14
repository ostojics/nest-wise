import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useValidateLogin} from '@maya-vault/validation';
import FormError from '@/components/form-error';

const LoginForm = ({className, ...props}: React.ComponentProps<'div'>) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateLogin();

  return (
    <div className={cn('flex flex-col w-md p-4', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email and password below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => {
              return data;
            })}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input {...register('email')} id="email" type="email" placeholder="m@example.com" required />
                {errors.email && <FormError error={errors.email.message ?? ''} />}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input {...register('password')} id="password" type="password" required />
                {errors.password && <FormError error={errors.password.message ?? ''} />}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
