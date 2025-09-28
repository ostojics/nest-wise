import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {LoginDTO} from '@nest-wise/contracts';
import {useValidateLogin} from '../hooks/use-validate-login';
import FormError from '@/components/form-error';
import {useLoginMutation} from '../hooks/use-login-mutation';
import {Loader2} from 'lucide-react';
import {Link} from '@tanstack/react-router';

const LoginForm = ({className, ...props}: React.ComponentProps<'div'>) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateLogin();
  const mutation = useLoginMutation();

  const handleLogin = (data: LoginDTO) => {
    mutation.mutate(data);
  };

  return (
    <div className={cn('flex flex-col w-md p-4', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Prijavite se na svoj račun</CardTitle>
          <CardDescription>Unesite vašu e‑poštu i lozinku da se prijavite na račun</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => handleLogin(data))}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">E‑pošta</Label>
                <Input {...register('email', {required: true})} placeholder="m@example.com" />
                {errors.email && <FormError error={errors.email.message ?? ''} />}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Lozinka</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Zaboravili ste lozinku?
                  </Link>
                </div>
                <Input {...register('password', {required: true})} type="password" />
                {errors.password && <FormError error={errors.password.message ?? ''} />}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Prijavite se'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
