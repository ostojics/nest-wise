import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import FormError from '@/components/form-error';
import {useValidateUpdateUsername} from '@/modules/users/hooks/use-validate-update-username';
import {useValidateRequestEmailChange} from '@/modules/users/hooks/use-validate-request-email-change';
import {useUpdateUsername} from '@/modules/users/hooks/use-update-username';
import {useRequestEmailChange} from '@/modules/users/hooks/use-request-email-change';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {UpdateUsernameDTO, RequestEmailChangeDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import {createFileRoute} from '@tanstack/react-router';
import {useEffect} from 'react';

export const Route = createFileRoute('/__pathlessLayout/account-settings')({
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  const {data: user} = useGetMe();

  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: {errors: usernameErrors},
    setValue: setUsernameValue,
  } = useValidateUpdateUsername();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: {errors: emailErrors},
    reset: resetEmailForm,
  } = useValidateRequestEmailChange();

  const updateUsernameMutation = useUpdateUsername();
  const requestEmailChangeMutation = useRequestEmailChange();

  // Set initial username value
  useEffect(() => {
    if (user?.username) {
      setUsernameValue('username', user.username);
    }
  }, [user?.username, setUsernameValue]);

  const handleUpdateUsername = (data: UpdateUsernameDTO) => {
    updateUsernameMutation.mutate(data);
  };

  const handleRequestEmailChange = (data: RequestEmailChangeDTO) => {
    requestEmailChangeMutation.mutate(data, {
      onSuccess: () => {
        resetEmailForm();
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Podešavanja naloga</h1>
        <p className="text-muted-foreground text-sm mt-1">Upravljajte vašim korisničkim imenom i e‑poštom</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Username Section */}
        <Card>
          <CardHeader>
            <CardTitle>Korisničko ime</CardTitle>
            <CardDescription>Izmenite vaše korisničko ime</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitUsername(handleUpdateUsername)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Novo korisničko ime</Label>
                  <Input
                    {...registerUsername('username', {required: true})}
                    id="username"
                    placeholder="korisničko_ime"
                  />
                  {usernameErrors.username && <FormError error={usernameErrors.username.message ?? ''} />}
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={updateUsernameMutation.isPending}>
                  {updateUsernameMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sačuvaj'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Email Section */}
        <Card>
          <CardHeader>
            <CardTitle>E‑pošta</CardTitle>
            <CardDescription>Promenite vašu e‑poštu. Poslaćemo link za potvrdu na novu adresu.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Trenutna e‑pošta</Label>
                <Input value={user?.email ?? ''} disabled className="bg-muted" />
              </div>
              <form onSubmit={handleSubmitEmail(handleRequestEmailChange)}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="newEmail">Nova e‑pošta</Label>
                    <Input
                      {...registerEmail('newEmail', {required: true})}
                      id="newEmail"
                      type="email"
                      placeholder="nova@example.com"
                    />
                    {emailErrors.newEmail && <FormError error={emailErrors.newEmail.message ?? ''} />}
                  </div>
                  <Button type="submit" className="w-full sm:w-auto" disabled={requestEmailChangeMutation.isPending}>
                    {requestEmailChangeMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Pošalji potvrdu'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
