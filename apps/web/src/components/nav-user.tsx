import {IconCreditCard, IconDotsVertical, IconLogout, IconQuestionMark, IconUserCircle} from '@tabler/icons-react';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from '@/components/ui/sidebar';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {useMemo} from 'react';
import {useLogOut} from '@/modules/auth/hooks/use-log-out';
import {Link} from '@tanstack/react-router';
import {BookIcon} from 'lucide-react';

export function NavUser() {
  const {isMobile} = useSidebar();
  const {data: user} = useGetMe();
  const userInitials = useMemo(() => {
    return `${user?.username.charAt(0).toUpperCase()}${user?.username.charAt(user.username.length - 1).toUpperCase()}`;
  }, [user]);

  const mutation = useLogOut();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src="" alt={user?.username} />
                <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.username}</span>
                <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={user?.username} />
                  <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.username}</span>
                  <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/account-settings">
                  <IconUserCircle />
                  Nalog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://github.com/ostojics/nest-wise/blob/main/docs/user-manual.sr.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  <BookIcon />
                  Priručnik
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/onboarding">
                  <IconQuestionMark />
                  Tutorial
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <IconCreditCard />
                Plaćanja
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              <IconLogout />
              Odjavite se
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
