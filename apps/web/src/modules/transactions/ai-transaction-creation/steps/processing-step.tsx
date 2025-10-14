import {AiProcessingStatus} from '../../components/ai-processing-status';
import {useAiTransactionCreation} from '../context';
import {useCreateTransactionAISuggestion} from '../../hooks/use-create-transaction-ai-suggestion';
import {useEffect} from 'react';

export default function ProcessingStep() {
  const {inputData, setSuggestion, setStep} = useAiTransactionCreation();
  const suggestionMutation = useCreateTransactionAISuggestion();

  useEffect(() => {
    if (inputData && !suggestionMutation.isPending && !suggestionMutation.isSuccess) {
      suggestionMutation.mutate(inputData, {
        onSuccess: (suggestion) => {
          setSuggestion(suggestion);
          setStep('confirm');
        },
        onError: () => {
          // Error handling is done in the mutation hook
          setStep('input');
        },
      });
    }
  }, [inputData, suggestionMutation, setSuggestion, setStep]);

  return (
    <div className="space-y-4">
      <AiProcessingStatus />
    </div>
  );
}
