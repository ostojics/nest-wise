import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useConfirmEmailChange} from '@/modules/users/hooks/use-confirm-email-change';
import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {Loader2} from 'lucide-react';
import {useState} from 'react';
import z from 'zod';

const emailChangeQueryParamsSchema = z.object({
  token: z.string().catch(''),
});

export const Route = createFileRoute('/email-change')({
  component: EmailChangePage,
  validateSearch: emailChangeQueryParamsSchema,
});

function EmailChangePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const confirmEmailChangeMutation = useConfirmEmailChange();
  const [confirmed, setConfirmed] = useState(false);

  if (!search.token) {
    return (
      <section className="flex items-center justify-center h-screen w-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Neispravan link</CardTitle>
            <CardDescription>Link za potvrdu promene e‑pošte je neispravan ili nedostaje.</CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  const handleConfirm = () => {
    confirmEmailChangeMutation.mutate(
      {token: search.token},
      {
        onSuccess: () => {
          setConfirmed(true);
          setTimeout(() => {
            void navigate({to: '/'});
          }, 2000);
        },
      },
    );
  };

  return (
    <section className="flex items-center justify-center h-screen w-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Potvrdite promenu e‑pošte</CardTitle>
          <CardDescription>Kliknite na dugme ispod da potvrdite promenu vaše e‑pošte.</CardDescription>
        </CardHeader>
        <CardContent>
          {confirmed ? (
            <div className="text-center py-4">
              <p className="text-green-600 font-medium">E‑pošta je uspešno promenjena!</p>
              <p className="text-sm text-muted-foreground mt-2">Preusmeravamo vas na podešavanja naloga...</p>
            </div>
          ) : (
            <Button onClick={handleConfirm} className="w-full" disabled={confirmEmailChangeMutation.isPending}>
              {confirmEmailChangeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Potvrdi promenu'}
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
