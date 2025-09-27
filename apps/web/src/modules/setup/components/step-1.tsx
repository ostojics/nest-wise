import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {UserRegistrationDTO} from '@nest-wise/contracts';
import FormError from '@/components/form-error';
import {useValidateStep1} from '../hooks/useValidateStep1';
import {useSetupContext} from '../hooks/useSetup';
import {Loader2} from 'lucide-react';
import {useTranslation} from 'react-i18next';

const Step1 = () => {
  const {t} = useTranslation();
  const {setUserData, nextStep, userData} = useSetupContext();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useValidateStep1({
    initialUsername: userData?.username,
    initialEmail: userData?.email,
  });

  const handleUserSetup = (data: UserRegistrationDTO) => {
    setUserData(data);
    nextStep();
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">{t('auth:setup.title')}</CardTitle>
          <CardDescription>{t('auth:setup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleUserSetup)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">{t('common:labels.username')}</Label>
                <Input
                  {...register('username', {required: true})}
                  id="username"
                  placeholder={t('users:profile.usernamePlaceholder')}
                  autoComplete="username"
                />
                {errors.username && <FormError error={errors.username.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">{t('common:labels.email')}</Label>
                <Input
                  {...register('email', {required: true})}
                  id="email"
                  type="email"
                  placeholder={t('users:profile.emailPlaceholder')}
                  autoComplete="email"
                />
                {errors.email && <FormError error={errors.email.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">{t('common:labels.password')}</Label>
                <Input
                  {...register('password', {required: true})}
                  id="password"
                  type="password"
                  placeholder={t('users:profile.passwordPlaceholder')}
                  autoComplete="new-password"
                />
                {errors.password && <FormError error={errors.password.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm_password">{t('users:profile.confirmPassword')}</Label>
                <Input
                  {...register('confirm_password', {required: true})}
                  id="confirm_password"
                  type="password"
                  placeholder={t('users:profile.confirmPasswordPlaceholder')}
                  autoComplete="new-password"
                />
                {errors.confirm_password && <FormError error={errors.confirm_password.message ?? ''} />}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common:buttons.continue')}
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
