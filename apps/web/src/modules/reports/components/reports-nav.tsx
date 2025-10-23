import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useLocation, useNavigate} from '@tanstack/react-router';

export function ReportsNav() {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {value: '/reports/spending', label: 'Troškovi'},
    {value: '/reports/net-worth', label: 'Ukupni kapital'},
  ];

  const active = tabs.find((t) => pathname.startsWith(t.value))?.value ?? '/reports/spending';

  return (
    <div className="w-full overflow-auto flex justify-center mb-[2rem]">
      <Tabs value={active} className="max-w-full">
        <TabsList className="min-w-[30rem]">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} onClick={() => navigate({to: tab.value})}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default ReportsNav;
