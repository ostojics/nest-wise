import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import FormError from '@/components/form-error';
import {useValidateRequestEmailChange} from '../hooks/use-validate-request-email-change';
import {useRequestEmailChange} from '../hooks/use-request-email-change';
import {RequestEmailChangeDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';

interface RequestEmailChangeFormProps {
  currentEmail?: string;
}

const RequestEmailChangeForm = ({currentEmail}: RequestEmailChangeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useValidateRequestEmailChange();

  const requestEmailChangeMutation = useRequestEmailChange();

  const handleRequestEmailChange = (data: RequestEmailChangeDTO) => {
    requestEmailChangeMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>E‑pošta</CardTitle>
        <CardDescription>Promenite vašu e‑poštu. Poslaćemo link za potvrdu na novu adresu.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Trenutna e‑pošta</Label>
            <Input value={currentEmail ?? ''} disabled className="bg-muted" />
          </div>
          <form onSubmit={handleSubmit(handleRequestEmailChange)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="newEmail">Nova e‑pošta</Label>
                <Input
                  {...register('newEmail', {required: true})}
                  id="newEmail"
                  type="email"
                  placeholder="nova@example.com"
                />
                {errors.newEmail && <FormError error={errors.newEmail.message ?? ''} />}
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
  );
};

export default RequestEmailChangeForm;
