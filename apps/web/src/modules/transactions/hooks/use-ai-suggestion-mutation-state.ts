import {useMutationState} from '@tanstack/react-query';
import {mutationKeys} from '@/modules/api/mutation-keys';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAiSuggestionMutationState<T>(selector: (mutation: any) => T) {
  const states = useMutationState({
    filters: {mutationKey: mutationKeys.transactions.createAiTransactionSuggestion()},
    select: selector,
  });

  return states.at(-1);
}
