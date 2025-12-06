import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {UserRegistrationDTO} from '@nest-wise/contracts';
import FormError from '@/components/form-error';
import {useValidateStep1} from '../hooks/use-validate-step1';
import {useSetupContext} from '../hooks/use-setup';
import {Loader2} from 'lucide-react';
import {useCheckEmailMutation} from '../hooks/use-check-email-mutation';
import {toast} from 'sonner';

const Step1 = () => {
  const {setUserData, nextStep, userData} = useSetupContext();
  const checkEmailMutation = useCheckEmailMutation();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useValidateStep1({
    initialUsername: userData?.username,
    initialEmail: userData?.email,
  });

  const handleUserSetup = (data: UserRegistrationDTO) => {
    checkEmailMutation.mutate(data.email, {
      onSuccess: (result) => {
        if (!result.available) {
          toast.error('Nije moguće kreirati nalog');
          return;
        }

        setUserData(data);
        nextStep();
      },
      onError: () => {
        toast.error('Nije moguće kreirati nalog');
      },
    });
  };

  const isLoading = isSubmitting || checkEmailMutation.isPending;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Vaše putovanje ka finansijskoj sigurnosti počinje ovde</CardTitle>
          <CardDescription>
            Podesite pristup NestWise aplikaciji i otključajte pametno upravljanje novcem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleUserSetup)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  {...register('username', {required: true})}
                  id="username"
                  placeholder="Unesite korisničko ime"
                  autoComplete="username"
                  data-testid="setup-username-input"
                />
                {errors.username && <FormError error={errors.username.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">E‑pošta</Label>
                <Input
                  {...register('email', {required: true})}
                  id="email"
                  type="email"
                  placeholder="Unesite e‑poštu"
                  autoComplete="email"
                  data-testid="setup-email-input"
                />
                {errors.email && <FormError error={errors.email.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  {...register('password', {required: true})}
                  id="password"
                  type="password"
                  placeholder="Kreirajte lozinku"
                  autoComplete="new-password"
                  data-testid="setup-password-input"
                />
                {errors.password && <FormError error={errors.password.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm_password">Potvrdite lozinku</Label>
                <Input
                  {...register('confirm_password', {required: true})}
                  id="confirm_password"
                  type="password"
                  placeholder="Potvrdite lozinku"
                  autoComplete="new-password"
                  data-testid="setup-confirm-password-input"
                />
                {errors.confirm_password && <FormError error={errors.confirm_password.message ?? ''} />}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading} data-testid="setup-step1-submit">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Nastavi'}
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
