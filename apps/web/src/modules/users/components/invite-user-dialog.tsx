import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ErrorResponse, InviteUserDTO} from '@nest-wise/contracts';
import {HTTPError} from 'ky';
import {Mail, UserPlus2} from 'lucide-react';
import {useState} from 'react';
import {toast} from 'sonner';
import {useInviteUserToHousehold} from '../hooks/use-invite-user';
import {useValidateInviteUser} from '../hooks/use-validate-invite-user';

const InviteUserDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useInviteUserToHousehold();
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
    reset,
  } = useValidateInviteUser();

  const handleInviteUser = async (data: InviteUserDTO) => {
    await mutation.mutateAsync(data.email, {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onError: async (error) => {
        const typedError = error as HTTPError<ErrorResponse>;
        const err = await typedError.response.json();

        const {default: posthog} = await import('posthog-js');

        posthog.captureException(error, {
          context: {
            feature: 'invite_user',
          },
        });

        if (err.message) {
          setError('email', {message: err.message});
          return;
        }

        toast.error('Došlo je do neočekivane greške');
      },
    });

    setIsOpen(false);
    reset();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }

        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus2 className="w-4 h-4" />
          Pozovi člana
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Pozovi člana
          </DialogTitle>
          <DialogDescription className="text-left text-balance">
            Pozovite novog člana u svoje domaćinstvo. Dobiće email sa instrukcijama za registraciju.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit(handleInviteUser)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input id="email" type="email" placeholder="ime@primer.com" className="w-full" {...register('email')} />
              {errors.email?.message && <FormError error={errors.email.message} />}
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Otkaži
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                Pošalji pozivnicu
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
