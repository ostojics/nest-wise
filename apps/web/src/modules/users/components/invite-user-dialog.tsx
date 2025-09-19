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
import {useInviteUser} from '../hooks/use-invite-user';
import {useValidateInviteUser} from '../hooks/use-validate-invite-user';

const InviteUserDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useInviteUser();
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
    reset,
  } = useValidateInviteUser();

  const handleInviteUser = async (data: InviteUserDTO) => {
    await mutation.mutateAsync(data, {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onError: async (error) => {
        const typedError = error as HTTPError<ErrorResponse>;
        const err = await typedError.response.json();

        if (err.message) {
          setError('email', {message: err.message});
          return;
        }

        toast.error('Unexpected error occurred');
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
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite a Member
          </DialogTitle>
          <DialogDescription className="text-left text-balance">
            Send an invitation to add a new member to your household. They will receive an email with instructions to
            join.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleInviteUser)} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input id="email" type="email" placeholder="name@example.com" className="w-full" {...register('email')} />
            {errors.email?.message && <FormError error={errors.email.message} />}
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              Send invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
