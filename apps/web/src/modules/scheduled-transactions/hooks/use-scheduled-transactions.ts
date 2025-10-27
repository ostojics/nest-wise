import {
  getScheduledTransactionsForHousehold,
  createScheduledTransactionForHousehold,
  updateScheduledTransactionForHousehold,
  pauseScheduledTransactionForHousehold,
  resumeScheduledTransactionForHousehold,
  getScheduledTransactionForHousehold,
  deleteScheduledTransactionForHousehold,
} from '@/modules/api/scheduled-transactions-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {
  CreateScheduledTransactionRuleHouseholdDTO,
  UpdateScheduledTransactionRuleDTO,
  GetScheduledTransactionsQueryHouseholdDTO,
  ErrorResponse,
  ScheduledTransactionRuleContract,
} from '@nest-wise/contracts';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useGetScheduledTransactions = (query: GetScheduledTransactionsQueryHouseholdDTO) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.scheduledTransactions.all(query),
    queryFn: () => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return getScheduledTransactionsForHousehold(me.householdId, query);
    },
    enabled: !!me?.householdId,
  });
};

export const useGetScheduledTransaction = (id: string) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.scheduledTransactions.single(id),
    queryFn: () => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return getScheduledTransactionForHousehold(me.householdId, id);
    },
    enabled: !!me?.householdId && !!id,
  });
};

export const useCreateScheduledTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (transaction: CreateScheduledTransactionRuleHouseholdDTO) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return createScheduledTransactionForHousehold(me.householdId, transaction);
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.scheduledTransactions.key()});
      toast.success('Zakazana transakcija je uspešno kreirana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Kreiranje zakazane transakcije nije uspelo');
    },
  });
};

export const useUpdateScheduledTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: UpdateScheduledTransactionRuleDTO}) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return updateScheduledTransactionForHousehold(me.householdId, id, dto);
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.scheduledTransactions.key()});
      toast.success('Zakazana transakcija je uspešno ažurirana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Ažuriranje zakazane transakcije nije uspelo');
    },
  });
};

export const usePauseScheduledTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (id: string) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return pauseScheduledTransactionForHousehold(me.householdId, id);
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await client.cancelQueries({queryKey: queryKeys.scheduledTransactions.key()});

      // Snapshot the previous value
      const previousData = client.getQueriesData({queryKey: queryKeys.scheduledTransactions.key()});

      // Optimistically update to the new value
      client.setQueriesData({queryKey: queryKeys.scheduledTransactions.key()}, (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old) || !Array.isArray(old.data)) {
          return old;
        }
        return {
          ...old,
          data: old.data.map((item: ScheduledTransactionRuleContract) =>
            item.id === id ? {...item, status: 'paused' as const} : item,
          ),
        };
      });

      return {previousData};
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.scheduledTransactions.key()});
      toast.success('Zakazana transakcija je pauzirana');
    },
    onError: async (error, _id, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          client.setQueryData(key, data);
        });
      }

      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Pauziranje zakazane transakcije nije uspelo');
    },
  });
};

export const useResumeScheduledTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (id: string) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return resumeScheduledTransactionForHousehold(me.householdId, id);
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await client.cancelQueries({queryKey: queryKeys.scheduledTransactions.key()});

      // Snapshot the previous value
      const previousData = client.getQueriesData({queryKey: queryKeys.scheduledTransactions.key()});

      // Optimistically update to the new value
      client.setQueriesData({queryKey: queryKeys.scheduledTransactions.key()}, (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old) || !Array.isArray(old.data)) {
          return old;
        }
        return {
          ...old,
          data: old.data.map((item: ScheduledTransactionRuleContract) =>
            item.id === id ? {...item, status: 'active' as const} : item,
          ),
        };
      });

      return {previousData};
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.scheduledTransactions.key()});
      toast.success('Zakazana transakcija je nastavljena');
    },
    onError: async (error, _id, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          client.setQueryData(key, data);
        });
      }

      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Nastavljanje zakazane transakcije nije uspelo');
    },
  });
};

export const useDeleteScheduledTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (id: string) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return deleteScheduledTransactionForHousehold(me.householdId, id);
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.scheduledTransactions.key()});
      toast.success('Zakazana transakcija je uspešno obrisana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Brisanje zakazane transakcije nije uspelo');
    },
  });
};
