import {mainLinks} from '@/common/constants/main-links';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {useLocation, useNavigate} from '@tanstack/react-router';

export function NavMain() {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Brzo kreiranje"
              className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Brzo kreiranje</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          {mainLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname.startsWith(item.url)}
                onClick={() => navigate({to: item.url})}
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
