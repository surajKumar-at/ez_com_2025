import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '@/store/store';
import { clearUser } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  User, 
  Settings, 
  Shield, 
  Bell, 
  HelpCircle, 
  ChevronDown,
  Home
} from 'lucide-react';

export function AdminMenuBar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state anyway
      dispatch(clearUser());
      navigate('/');
    }
  };

  const getUserInitials = () => {
    if (!user) return 'AD';
    const first = user.eu_first_name?.charAt(0) || '';
    const last = user.eu_last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'AD';
  };

  return (
    <header className="h-16 bg-background border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">
                  {t('admin.dashboard')}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {t('admin.adminPanel')}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden md:flex">
              Admin
            </Badge>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4 mr-2" />
              {t('common.home')}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">
                    {user?.eu_first_name} {user?.eu_last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Administrator
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {user?.eu_first_name} {user?.eu_last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Administrator
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>{t('admin.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('admin.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('common.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}