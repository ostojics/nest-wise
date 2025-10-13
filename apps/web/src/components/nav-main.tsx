import {mainLinks} from '@/common/constants/main-links';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {useIsMobile} from '@/hooks/use-mobile';
import {useLocation, useNavigate} from '@tanstack/react-router';

export function NavMain() {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {toggleSidebar} = useSidebar();
  const isMobile = useIsMobile();

  const handleNavItemClick = (url: string) => {
    void navigate({to: url});
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {mainLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname.startsWith(item.url)}
                onClick={() => handleNavItemClick(item.url)}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
