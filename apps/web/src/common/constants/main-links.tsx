import {IconChartBar, IconDashboard, IconUsers} from '@tabler/icons-react';
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
    title: 'Analytics',
    url: '/analytics',
    icon: <IconChartBar />,
  },
  {
    title: 'Members',
    url: '/members',
    icon: <IconUsers />,
  },
] as const;
