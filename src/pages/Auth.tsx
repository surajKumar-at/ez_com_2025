import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { setUser } from '@/store/slices/authSlice';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 3, // Default to customer
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success && result.user) {
          dispatch(setUser(result.user));
          toast({
            title: t('common.success'),
            description: t('auth.loginSuccess'),
          });

          // Route based on user type
          if (result.user.eu_type === 1) {
            navigate('/admin');
          } else {
            navigate('/customer');
          }
        } else {
          toast({
            title: t('common.error'),
            description: result.message || t('auth.loginError'),
            variant: 'destructive',
          });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: t('common.error'),
            description: 'Passwords do not match',
            variant: 'destructive',
          });
          return;
        }

        const result = await authService.signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userType: formData.userType,
        });

        if (result.success) {
          toast({
            title: t('common.success'),
            description: t('auth.signupSuccess'),
          });
          setIsLogin(true);
        } else {
          toast({
            title: t('common.error'),
            description: result.message || t('auth.signupError'),
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t(isLogin ? 'auth.loginTitle' : 'auth.signupTitle')}</CardTitle>
          <CardDescription>
            {isLogin ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">{t('auth.userType')}</Label>
                  <Select 
                    value={formData.userType.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, userType: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('auth.admin')}</SelectItem>
                      <SelectItem value="2">{t('auth.customer')}</SelectItem>
                      <SelectItem value="3">{t('auth.customer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('common.loading') : t(isLogin ? 'auth.login' : 'auth.signup')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;