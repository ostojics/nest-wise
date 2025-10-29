import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {ScheduleDialogProvider, useScheduleDialogContext} from '../../context/schedule-dialog.context';
import Step1Transaction from './step-1-transaction';
import Step2Rule from './step-2-rule';
import {Button} from '@/components/ui/button';

function ScheduleDialogContent() {
  const {currentStep, isOpen, setIsOpen, resetDialog} = useScheduleDialogContext();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }

    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Zakažite novu transakciju</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{currentStep === 1 ? 'Detalji transakcije' : 'Pravilo ponavljanja'}</DialogTitle>
          <DialogDescription className="hidden">
            {currentStep === 1 ? 'Korak 1 od 2' : 'Korak 2 od 2'}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {currentStep === 1 ? <Step1Transaction /> : <Step2Rule />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ScheduleDialog() {
  return (
    <ScheduleDialogProvider>
      <ScheduleDialogContent />
    </ScheduleDialogProvider>
  );
}
