import {Suspense, lazy} from 'react';
import {AiTransactionCreationProvider, useAiTransactionCreation} from '@/contexts/ai-transaction-creation-context';
import {Loader2} from 'lucide-react';

// Lazy load steps
const InputStep = lazy(() => import('./steps/input-step'));
const ProcessingStep = lazy(() => import('./steps/processing-step'));
const ConfirmStep = lazy(() => import('./steps/confirm-step'));

function AiTransactionCreationContent() {
  const {step} = useAiTransactionCreation();

  const renderStep = () => {
    switch (step) {
      case 'input':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <InputStep />
          </Suspense>
        );
      case 'processing':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <ProcessingStep />
          </Suspense>
        );
      case 'confirm':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <ConfirmStep />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
}

export function AiTransactionCreation() {
  return (
    <AiTransactionCreationProvider>
      <AiTransactionCreationContent />
    </AiTransactionCreationProvider>
  );
}
