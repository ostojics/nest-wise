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
    url: '#',
    icon: <IconChartBar />,
  },
  {
    title: 'Members',
    url: '#',
    icon: <IconUsers />,
  },
] as const;
