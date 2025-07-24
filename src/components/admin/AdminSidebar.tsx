import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Settings,
  Shield,
  Users,
  Globe,
  Database,
  Link,
  MapPin,
  BookOpen,
  RefreshCw,
  Handshake,
  Plus,
  List,
  ChevronDown,
  ChevronRight,
  ArrowRightLeft,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuItem {
  title: string;
  icon: any;
  items?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  url: string;
  icon?: any;
}

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useTranslation();
  const [openMenus, setOpenMenus] = useState<string[]>(['config']);

  const menuItems: MenuItem[] = [
    {
      title: t('admin.config'),
      icon: Settings,
      items: [
        { title: t('admin.authorizations'), url: '/admin/authorizations', icon: Shield },
        { title: t('admin.userRoles'), url: '/admin/config/user-roles', icon: Users },
        { title: t('admin.systems'), url: '/admin/config/systems', icon: Database },
        { title: t('admin.migrateUsers'), url: '/admin/config/migrate-users', icon: ArrowRightLeft },
        { title: t('admin.adverseEvents'), url: '/admin/config/adverse-events', icon: AlertTriangle },
        { title: t('admin.siteDefaults'), url: '/admin/site-defaults', icon: Globe },
        { title: t('admin.systemAuth'), url: '/admin/system-auth', icon: Link },
        { title: t('admin.erpConnection'), url: '/admin/erp-connection', icon: Database },
        { title: t('admin.salesAreas'), url: '/admin/config/sales-areas', icon: MapPin },
        { title: 'SAP Business Partner', url: '/admin/config/sap-business-partner', icon: Building2 },
        { title: 'SAP API Test', url: '/admin/sap-api', icon: Database },
      ],
    },
    {
      title: t('admin.catalog'),
      icon: BookOpen,
      items: [
        { title: t('admin.synchronize'), url: '/admin/catalog/synchronize', icon: RefreshCw },
      ],
    },
    {
      title: t('admin.partners'),
      icon: Handshake,
      items: [
        { title: t('admin.create'), url: '/admin/partners/create', icon: Plus },
        { title: t('admin.list'), url: '/admin/partners/list', icon: List },
      ],
    },
    {
      title: t('admin.users'),
      icon: Users,
      items: [
        { title: t('admin.create'), url: '/admin/users/create', icon: Plus },
        { title: t('admin.list'), url: '/admin/users/list', icon: List },
      ],
    },
  ];

  const toggleMenu = (menuTitle: string) => {
    setOpenMenus(prev => 
      prev.includes(menuTitle) 
        ? prev.filter(m => m !== menuTitle)
        : [...prev, menuTitle]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50';

  return (
    <Sidebar className={state === 'collapsed' ? 'w-14' : 'w-60'} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        {menuItems.map((menu) => {
          const Icon = menu.icon;
          const isMenuOpen = openMenus.includes(menu.title);
          
          return (
            <SidebarGroup key={menu.title}>
              <Collapsible open={isMenuOpen} onOpenChange={() => toggleMenu(menu.title)}>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent/50 px-2 py-1 rounded">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {state !== 'collapsed' && <span>{menu.title}</span>}
                    </div>
                    {state !== 'collapsed' && (
                      isMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menu.items?.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <NavLink to={item.url} className={getNavClass}>
                                {ItemIcon && <ItemIcon className="h-4 w-4" />}
                                {state !== 'collapsed' && <span>{item.title}</span>}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
