import MyFinancesPage from '@/modules/my-finances/components/my-finances-page';
import {privateTransactionSortFieldEnum} from '@nest-wise/contracts';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

export const getPrivateTransactionsParams = z.object({
  q: z
    .string({
      invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
    })
    .max(255, 'Pretraga može imati najviše 255 karaktera')
    .optional()
    .catch(undefined),
  accountId: z
    .string({
      invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
    })
    .uuid('Račun mora biti izabran')
    .optional()
    .catch(undefined),
  type: z.enum(['income', 'expense']).optional(),
  from: z
    .string({
      invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
    })
    .datetime({message: 'Datum mora biti u ISO 8601 formatu'})
    .optional()
    .catch(undefined),
  to: z
    .string({
      invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
    })
    .datetime({message: 'Datum mora biti u ISO 8601 formatu'})
    .optional()
    .catch(undefined),
  sort: privateTransactionSortFieldEnum.optional().default('-transactionDate').catch('-transactionDate'),
  page: z.coerce
    .number({
      invalid_type_error: 'Neispravna vrednost (mora biti broj)',
    })
    .int()
    .min(1)
    .default(1)
    .catch(1),
  pageSize: z.coerce
    .number({
      invalid_type_error: 'Neispravna vrednost (mora biti broj)',
    })
    .int()
    .min(1)
    .max(100)
    .default(15)
    .catch(15),
});

export const Route = createFileRoute('/__pathlessLayout/my-finances')({
  component: RouteComponent,
  validateSearch: getPrivateTransactionsParams,
});

function RouteComponent() {
  return <MyFinancesPage />;
}
