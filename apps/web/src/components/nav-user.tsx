import {IconCreditCard, IconDotsVertical, IconLogout, IconUserCircle, IconLanguage} from '@tabler/icons-react';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from '@/components/ui/sidebar';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useMemo} from 'react';
import {useLogOut} from '@/modules/auth/hooks/use-log-out';
import {useTranslation} from 'react-i18next';
import {supportedLanguages} from '@nest-wise/locales';

export function NavUser() {
  const {isMobile} = useSidebar();
  const {data: user} = useGetMe();
  const {t, i18n} = useTranslation();
  const userInitials = useMemo(() => {
    return `${user?.username.charAt(0).toUpperCase()}${user?.username.charAt(user.username.length - 1).toUpperCase()}`;
  }, [user]);

  const mutation = useLogOut();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
              <DropdownMenuItem disabled>
                <IconUserCircle />
                {t('common:labels.account')}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <IconCreditCard />
                {t('common:navigation.billing')}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconLanguage />
                  {t('common:labels.language')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {supportedLanguages.map((lng) => (
                    <DropdownMenuItem
                      key={lng}
                      onClick={() => changeLanguage(lng)}
                      className={i18n.language === lng ? 'bg-accent' : ''}
                    >
                      {t(`common:languages.${lng}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              <IconLogout />
              {t('common:buttons.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
