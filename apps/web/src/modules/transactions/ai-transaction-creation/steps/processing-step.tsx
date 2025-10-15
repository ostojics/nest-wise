import {useMutationState} from '@tanstack/react-query';
import {AiProcessingStatus} from '../../components/ai-processing-status';
import {mutationKeys} from '@/modules/api/mutation-keys';
import {useEffect} from 'react';
import {useAiTransactionCreation} from '../context';
import {toast} from 'sonner';

export default function ProcessingStep() {
  const {setStep} = useAiTransactionCreation();
  const statuses = useMutationState({
    filters: {mutationKey: mutationKeys.transactions.createAiTransactionSuggestion()},
    select: (mutation) => mutation.state.status,
  });
  const latestStatus = statuses.at(-1);

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
