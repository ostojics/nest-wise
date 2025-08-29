import {IconCalendar, IconReceipt, IconUsers} from '@tabler/icons-react';
import {Landmark} from 'lucide-react';

export const mainLinks = [
  {
    title: 'Plan',
    url: '/plan',
    icon: <IconCalendar />,
  },
  {
    title: 'Accounts',
    url: '/accounts',
    icon: <Landmark />,
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: <IconReceipt />,
  },
  {
    title: 'Members',
    url: '/members',
    icon: <IconUsers />,
  },
] as const;
