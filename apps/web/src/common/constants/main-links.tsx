import {IconCalendar, IconCalendarEvent, IconChartBar, IconReceipt, IconUsers, IconWallet} from '@tabler/icons-react';
import {Landmark} from 'lucide-react';

export const mainLinks = [
  {
    title: 'Plan',
    url: '/plan',
    icon: <IconCalendar />,
  },
  {
    title: 'Računi',
    url: '/accounts',
    icon: <Landmark />,
  },
  {
    title: 'Transakcije',
    url: '/transactions',
    icon: <IconReceipt />,
  },
  {
    title: 'Zakazane transakcije',
    url: '/scheduled-transactions',
    icon: <IconCalendarEvent />,
  },
  {
    title: 'Izveštaji',
    url: '/reports',
    icon: <IconChartBar />,
  },
  {
    title: 'Moje finansije',
    url: '/my-finances',
    icon: <IconWallet />,
  },
  {
    title: 'Članovi',
    url: '/members',
    icon: <IconUsers />,
  },
] as const;
