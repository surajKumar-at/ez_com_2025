import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Settings, Shield, Save } from 'lucide-react';
import { systemAuthService } from '@/services/systemAuthService';
import { 
  SystemAuthDto, 
  AuthDescriptionDto, 
  SystemAuthAssignmentDto 
} from '@/lib/dto/systemAuth.dto';

export default function SystemAuth() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [systems, setSystems] = useState<SystemAuthDto[]>([]);
  const [authDescriptions, setAuthDescriptions] = useState<AuthDescriptionDto[]>([]);
  const [systemAuthorizations, setSystemAuthorizations] = useState<SystemAuthAssignmentDto[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);
  const [selectedAuthKeys, setSelectedAuthKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedSystemId) {
      fetchSystemAuthorizations(selectedSystemId);
    }
  }, [selectedSystemId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [systemsData, authDescData] = await Promise.all([
        systemAuthService.getSystems(),
        systemAuthService.getAuthDescriptions()
      ]);
      
      setSystems(systemsData);
      setAuthDescriptions(authDescData);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('systemAuth.fetchError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemAuthorizations = async (systemId: number) => {
    try {
      const data = await systemAuthService.getSystemAuthorizations(systemId);
      setSystemAuthorizations(data);
      
      // Set selected auth keys based on existing authorizations
      const existingAuthKeys = data.map(auth => auth.esa_auth_key);
      setSelectedAuthKeys(existingAuthKeys);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('systemAuth.fetchSystemAuthError'),
        variant: 'destructive'
      });
    }
  };

  const handleSystemChange = (systemId: string) => {
    const id = parseInt(systemId);
    setSelectedSystemId(id);
    setSelectedAuthKeys([]);
    setSystemAuthorizations([]);
  };

  const handleAuthToggle = (authKey: string, checked: boolean) => {
    if (checked) {
      setSelectedAuthKeys(prev => [...prev, authKey]);
    } else {
      setSelectedAuthKeys(prev => prev.filter(key => key !== authKey));
    }
  };

  const handleSaveAuthorizations = async () => {
    if (!selectedSystemId) return;

    try {
      setSaving(true);
      await systemAuthService.updateSystemAuthorizations({
        systemId: selectedSystemId,
        authKeys: selectedAuthKeys
      });

      toast({
        title: t('common.success'),
        description: t('systemAuth.saveSuccess')
      });

      // Refresh the system authorizations
      await fetchSystemAuthorizations(selectedSystemId);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('systemAuth.saveError'),
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedSystem = systems.find(s => s.esd_sys_no === selectedSystemId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('systemAuth.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('systemAuth.description')}</p>
          </div>
        </div>
      </div>

      {/* System Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('systemAuth.selectSystem')}</CardTitle>
          <CardDescription>{t('systemAuth.selectSystemDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="system">{t('systemAuth.system')}</Label>
            <Select onValueChange={handleSystemChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={t('systemAuth.selectSystemPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {systems.map((system) => (
                  <SelectItem key={system.esd_sys_no} value={system.esd_sys_no.toString()}>
                    {system.esd_sys_desc} ({system.esd_sys_no})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Authorization Table */}
      {selectedSystemId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{t('systemAuth.authorizations')}</CardTitle>
                <CardDescription>
                  {selectedSystem ? 
                    t('systemAuth.authorizationsFor', { system: selectedSystem.esd_sys_desc }) :
                    t('systemAuth.authorizationsDesc')
                  }
                </CardDescription>
              </div>
              <Button 
                onClick={handleSaveAuthorizations}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">{t('common.loading')}</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>{t('systemAuth.authorizationDescription')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authDescriptions.map((auth) => (
                    <TableRow key={auth.euad_auth_key}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAuthKeys.includes(auth.euad_auth_key)}
                          onCheckedChange={(checked) => 
                            handleAuthToggle(auth.euad_auth_key, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>{auth.euad_auth_desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}