import {useMutationState, MutationState} from '@tanstack/react-query';
import {mutationKeys} from '@/modules/api/mutation-keys';
import {AiTransactionSuggestion} from '@nest-wise/contracts';

export function useAiSuggestionMutationState<T>(selector: (mutation: MutationState<AiTransactionSuggestion>) => T) {
  const states = useMutationState({
    filters: {mutationKey: mutationKeys.transactions.createAiTransactionSuggestion()},
    select: selector,
  });

  return states.at(-1);
}
