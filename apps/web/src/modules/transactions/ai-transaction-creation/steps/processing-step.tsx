import {AiProcessingStatus} from '../../components/ai-processing-status';
import {useEffect} from 'react';
import {useAiTransactionCreation} from '@/contexts/ai-transaction-creation-context';
import {toast} from 'sonner';
import {useAiSuggestionMutationState} from '../../hooks/use-ai-suggestion-mutation-state';

export default function ProcessingStep() {
  const {setStep} = useAiTransactionCreation();
  const latestStatus = useAiSuggestionMutationState((mutation) => mutation.status);

  useEffect(() => {
    if (latestStatus === 'success') {
      setStep('confirm');
    }

    if (latestStatus === 'error') {
      setStep('input');
      toast.error('Došlo je do greške prilikom obrade transakcije. Pokušajte ponovo kasnije.');
    }
  }, [latestStatus, setStep]);

  return (
    <div className="space-y-4">
      <AiProcessingStatus />
    </div>
  );
}
