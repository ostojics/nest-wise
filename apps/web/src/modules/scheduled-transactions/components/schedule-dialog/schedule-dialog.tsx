import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {ScheduleDialogProvider, useScheduleDialogContext} from '../../context/schedule-dialog.context';
import Step1Transaction from './step-1-transaction';
import Step2Rule from './step-2-rule';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ScheduleDialogContent({onOpenChange}: {onOpenChange: (open: boolean) => void}) {
  const {currentStep, resetDialog} = useScheduleDialogContext();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
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

export default function ScheduleDialog({open, onOpenChange}: ScheduleDialogProps) {
  if (!open) return null;

  return (
    <ScheduleDialogProvider>
      <ScheduleDialogContent onOpenChange={onOpenChange} />
    </ScheduleDialogProvider>
  );
}
