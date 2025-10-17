import {Button} from '@/components/ui/button';
import {Loader2} from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isProcessing: boolean;
}

export function FormActions({onCancel, isProcessing}: FormActionsProps) {
  return (
    <div className="flex justify-between gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
        Otkaži
      </Button>
      <Button
        type="submit"
        disabled={isProcessing}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
      >
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Potvrdi transakciju'}
      </Button>
    </div>
  );
}
