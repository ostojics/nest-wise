'use client';

import * as React from 'react';
import {Icon} from '@tabler/icons-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {cn} from '@/lib/utils';
import {useNavigate} from '@tanstack/react-router';
import {useIsMobile} from '@/hooks/use-mobile';

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url?: string;
    icon: Icon;
    onClick?: () => void;
    disabled?: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const navigate = useNavigate();
  const {toggleSidebar} = useSidebar();
  const isMobile = useIsMobile();

  const handleItemClick = (url: string | null, handler?: () => void) => {
    if (url) {
      void navigate({to: url});
    }

    handler?.();
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <SidebarGroup {...props} className={cn(props.className)}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                disabled={item.disabled ?? false}
                onClick={() => handleItemClick(item.url ?? null, item.onClick)}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
