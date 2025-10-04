import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {ErrorResponse, HelpRequestDTO} from '@nest-wise/contracts';
import {HTTPError} from 'ky';
import {Mail, MessageSquare} from 'lucide-react';
import {toast} from 'sonner';
import {useSendHelp} from '@/modules/emails/hooks/use-send-help';
import {useValidateHelp} from '@/modules/emails/hooks/use-validate-help';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpDialog = ({open, onOpenChange}: HelpDialogProps) => {
  const mutation = useSendHelp();
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useValidateHelp();

  const handleSendHelp = async (data: HelpRequestDTO) => {
    await mutation.mutateAsync(data, {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onError: async (error) => {
        const typedError = error as HTTPError<ErrorResponse>;
        try {
          const err = await typedError.response.json();

          if (err.message) {
            toast.error(err.message);
            return;
          }
        } catch {
          // Ignore parsing errors
        }

        toast.error('Došlo je do neočekivane greške');
      },
    });

    onOpenChange(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          reset();
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Pomoć
          </DialogTitle>
          <DialogDescription className="text-left text-balance">
            Pošaljite nam poruku i odgovorićemo vam u najkraćem mogućem roku.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSendHelp)} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              Vaša e‑pošta <span className="text-red-500">*</span>
            </Label>
            <Input id="email" type="email" placeholder="ime@primer.com" className="w-full" {...register('email')} />
            {errors.email?.message && <FormError error={errors.email.message} />}
          </div>
          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-medium">
              Poruka <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Opišite vaš problem ili pitanje..."
              className="w-full min-h-[120px]"
              {...register('message')}
            />
            {errors.message?.message && <FormError error={errors.message.message} />}
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Otkaži
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              <Mail className="w-4 h-4" />
              Pošalji
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
