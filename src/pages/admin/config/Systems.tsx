import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Trash2, Settings } from 'lucide-react';
import { systemService } from '@/services/systemService';
import { System, CreateSystemDto, SystemType } from '@/lib/dto/system.dto';

export default function Systems() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [systems, setSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>([]);
  const [systemTypes, setSystemTypes] = useState<SystemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<number[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateSystemDto>({
    systemType: '',
    language: '',
    systemId: '',
    description: ''
  });

  // Validation errors state
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateSystemDto, string>>>({});

  const languages = [
    { value: 'EN', label: 'English' },
    { value: 'ES', label: 'Spanish' },
    { value: 'FR', label: 'French' },
    { value: 'DE', label: 'German' }
  ];

  useEffect(() => {
    fetchSystems();
    fetchSystemTypes();
  }, []);

  useEffect(() => {
    const filtered = systems.filter(system =>
      system.esd_sys_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.esd_sys_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.esd_sys_no.toString().includes(searchTerm)
    );
    setFilteredSystems(filtered);
  }, [systems, searchTerm]);

  const fetchSystems = async () => {
    try {
      setLoading(true);
      const data = await systemService.getSystems();
      setSystems(data);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('systems.fetchError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemTypes = async () => {
    try {
      const data = await systemService.getSystemTypes();
      setSystemTypes(data);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('systems.fetchSystemTypesError'),
        variant: 'destructive'
      });
    }
  };

  // Form validation
 const validateForm = (): boolean => {
  const errors: Partial<Record<keyof CreateSystemDto, string>> = {};

  if (typeof formData.systemType !== 'string' || formData.systemType.trim() === '') {
    errors.systemType = t('systems.validation.systemTypeRequired');
  }
  if (typeof formData.language !== 'string' || formData.language.trim() === '') {
    errors.language = t('systems.validation.languageRequired');
  }
  if (typeof formData.systemId !== 'string' || formData.systemId.trim() === '') {
    errors.systemId = t('systems.validation.systemIdRequired');
  }
  if (typeof formData.description !== 'string' || formData.description.trim() === '') {
    errors.description = t('systems.validation.descriptionRequired');
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};


  const handleCreateSystem = async () => {
    if (!validateForm()) {
      toast({
        title: t('common.error'),
        description: t('systems.fixValidationErrors'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await systemService.createSystem(formData);

      toast({
        title: t('common.success'),
        description: t('systems.createSuccess'),
      });

      setIsCreateDialogOpen(false);
      setFormData({
        systemType: '',
        language: '',
        systemId: '',
        description: '',
      });
      setFormErrors({});

      await fetchSystems();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('systems.createError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedSystems.length === 0) return;

    try {
      await systemService.deleteSystems(selectedSystems);

      toast({
        title: t('common.success'),
        description: t('systems.deleteSuccess', { count: selectedSystems.length })
      });

      setSelectedSystems([]);
      await fetchSystems();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('systems.deleteError'),
        variant: 'destructive'
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSystems(filteredSystems.map(system => system.esd_sys_no));
    } else {
      setSelectedSystems([]);
    }
  };

  const handleSelectSystem = (systemId: number, checked: boolean) => {
    if (checked) {
      setSelectedSystems(prev => [...prev, systemId]);
    } else {
      setSelectedSystems(prev => prev.filter(id => id !== systemId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('systems.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('systems.description')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedSystems.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t('systems.deleteSelected', { count: selectedSystems.length })}
            </Button>
          )}

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('systems.createNew')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('systems.createSystem')}</DialogTitle>
                <DialogDescription>{t('systems.createSystemDesc')}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemType">{t('systems.systemType')}</Label>
                    <Select
                      value={formData.systemType}
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, systemType: value }));
                        setFormErrors(prev => ({ ...prev, systemType: undefined }));
                      }}
                      id="systemType"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('systems.selectSystemType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {systemTypes.map((type) => (
                          <SelectItem key={type.est_sys_type} value={type.est_sys_type}>
                            {type.est_desc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.systemType && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.systemType}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">{t('systems.language')}</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, language: value }));
                        setFormErrors(prev => ({ ...prev, language: undefined }));
                      }}
                      id="language"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('systems.selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.language && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.language}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemId">{t('systems.systemId')}</Label>
                  <Input
                    id="systemId"
                    value={formData.systemId}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, systemId: e.target.value }));
                      setFormErrors(prev => ({ ...prev, systemId: undefined }));
                    }}
                    placeholder={t('systems.systemIdPlaceholder')}
                    aria-invalid={!!formErrors.systemId}
                  />
                  {formErrors.systemId && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.systemId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('systems.description')}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, description: e.target.value }));
                      setFormErrors(prev => ({ ...prev, description: undefined }));
                    }}
                    placeholder={t('systems.descriptionPlaceholder')}
                    aria-invalid={!!formErrors.description}
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setFormErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateSystem} disabled={isSubmitting}>
                  {isSubmitting ? t('common.creating') : t('common.create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('systems.searchTitle')}</CardTitle>
          <CardDescription>{t('systems.searchDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('systems.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Systems Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{t('systems.systemsList')}</CardTitle>
              <CardDescription>
                {t('systems.totalSystems', { count: filteredSystems.length })}
              </CardDescription>
            </div>

            {filteredSystems.length > 0 && (
              <Badge variant="secondary">
                {selectedSystems.length} {t('systems.selected')}
              </Badge>
            )}
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
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedSystems.length === filteredSystems.length && filteredSystems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t('systems.systemId')}</TableHead>
                  <TableHead>{t('systems.systemType')}</TableHead>
                  <TableHead>{t('systems.language')}</TableHead>
                  <TableHead>{t('systems.description')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSystems.map((system) => (
                  <TableRow key={system.esd_sys_no}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSystems.includes(system.esd_sys_no)}
                        onCheckedChange={(checked) => handleSelectSystem(system.esd_sys_no, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{system.esd_sys_no}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{system.esd_sys_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{system.esd_lang}</Badge>
                    </TableCell>
                    <TableCell>{system.esd_sys_desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
