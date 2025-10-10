import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {HelpRequestDTO} from '@nest-wise/contracts';
import {Loader2, Mail, MessageSquare} from 'lucide-react';
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
    await mutation.mutateAsync(data);

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
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Pomoć
          </DialogTitle>
          <DialogDescription className="text-left text-balance">
            Pošaljite nam poruku i odgovorićemo vam u najkraćem mogućem roku.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit(handleSendHelp)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-medium">
                Poruka <span className="text-red-500">*</span>
              </Label>
              <Textarea
                autoFocus
                id="message"
                placeholder="Opišite vaš problem ili pitanje..."
                className="w-full min-h-[7.5rem]"
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
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Pošalji
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
