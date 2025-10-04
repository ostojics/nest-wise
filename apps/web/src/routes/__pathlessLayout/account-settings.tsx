import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import UpdateUsernameForm from '@/modules/users/components/update-username-form';
import RequestEmailChangeForm from '@/modules/users/components/request-email-change-form';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/account-settings')({
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  const {data: user} = useGetMe();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Podešavanja naloga</h1>
        <p className="text-muted-foreground text-sm mt-1">Upravljajte vašim korisničkim imenom i e‑poštom</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <UpdateUsernameForm currentUsername={user?.username} />
        <RequestEmailChangeForm currentEmail={user?.email} />
      </div>
    </div>
  );
}
