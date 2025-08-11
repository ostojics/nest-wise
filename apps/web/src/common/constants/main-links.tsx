import {IconDashboard, IconReceipt, IconUsers} from '@tabler/icons-react';
import {Landmark} from 'lucide-react';

export const mainLinks = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <IconDashboard />,
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
