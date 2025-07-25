import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { masterDefaultsService } from '@/services/masterDefaultsService';
import { salesAreaService } from '@/services/salesAreaService';
import { MasterDefault, MasterDefaultCreate, MasterDefaultUpdate, defaultLevelOptions, languageOptions } from '@/lib/dto/masterDefaults.dto';
import { SalesArea } from '@/lib/dto/salesArea.dto';

export default function MasterDefaults() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [masterDefaults, setMasterDefaults] = useState<MasterDefault[]>([]);
  const [salesAreas, setSalesAreas] = useState<SalesArea[]>([]);
  const [selectedSalesArea, setSelectedSalesArea] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMasterDefault, setEditingMasterDefault] = useState<MasterDefault | null>(null);
  const [formData, setFormData] = useState<MasterDefaultCreate>({
    eudd_key: '',
    eudd_defaults_desc: '',
    eudd_sys_key: '999002',
    eudd_lang: 'EN',
    eudd_default_type: '1',
  });

  useEffect(() => {
    fetchSalesAreas();
  }, []);

  useEffect(() => {
    if (selectedSalesArea) {
      fetchMasterDefaults();
    }
  }, [selectedSalesArea]);

  const fetchSalesAreas = async () => {
    try {
      const areas = await salesAreaService.getSalesAreas();
      setSalesAreas(areas);
      if (areas.length > 0) {
        setSelectedSalesArea(areas[0].eskd_sys_key);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to fetch sales areas',
        variant: 'destructive',
      });
    }
  };

  const fetchMasterDefaults = async () => {
    try {
      setLoading(true);
      const response = await masterDefaultsService.getAll(selectedSalesArea);
      if (response.success && response.data) {
        setMasterDefaults(response.data);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to fetch master defaults',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await masterDefaultsService.create({ ...formData, eudd_sys_key: selectedSalesArea });
      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || 'Master default created successfully',
        });
        setIsCreateDialogOpen(false);
        setFormData({
          eudd_key: '',
          eudd_defaults_desc: '',
          eudd_sys_key: selectedSalesArea,
          eudd_lang: 'EN',
          eudd_default_type: '1',
        });
        fetchMasterDefaults();
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to create master default',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (masterDefault: MasterDefault) => {
    setEditingMasterDefault(masterDefault);
    setFormData({
      eudd_key: masterDefault.eudd_key,
      eudd_defaults_desc: masterDefault.eudd_defaults_desc,
      eudd_sys_key: masterDefault.eudd_sys_key || selectedSalesArea,
      eudd_lang: masterDefault.eudd_lang || 'EN',
      eudd_default_type: masterDefault.eudd_default_type,
      eudd_is_master: masterDefault.eudd_is_master,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingMasterDefault) return;

    try {
      const updateData: MasterDefaultUpdate = {
        eudd_defaults_desc: formData.eudd_defaults_desc,
        eudd_default_type: formData.eudd_default_type,
        eudd_is_master: formData.eudd_is_master,
      };

      const response = await masterDefaultsService.update(editingMasterDefault.eudd_key, updateData);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || 'Master default updated successfully',
        });
        setIsEditDialogOpen(false);
        setEditingMasterDefault(null);
        fetchMasterDefaults();
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to update master default',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this master default?')) return;

    try {
      const response = await masterDefaultsService.delete(key);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || 'Master default deleted successfully',
        });
        fetchMasterDefaults();
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to delete master default',
        variant: 'destructive',
      });
    }
  };

  if (loading && !selectedSalesArea) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('common.loading')}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Master Defaults</h1>
        </div>

        {/* Business Area Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Business Area Selection</CardTitle>
            <CardDescription>
              Select a business area to view and manage its master defaults
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessArea" className="text-right">
                Business Area
              </Label>
              <Select value={selectedSalesArea} onValueChange={setSelectedSalesArea}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select business area" />
                </SelectTrigger>
                <SelectContent>
                  {salesAreas.map((area) => (
                    <SelectItem key={area.eskd_sys_key} value={area.eskd_sys_key}>
                      {area.eskd_sys_key} - {area.eskd_sys_key_desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedSalesArea && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">List of Master Defaults</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Master Default
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Master Default</DialogTitle>
                    <DialogDescription>
                      Add a new master default configuration.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="key" className="text-right">
                        Default Key
                      </Label>
                      <Input
                        id="key"
                        value={formData.eudd_key}
                        onChange={(e) => setFormData({ ...formData, eudd_key: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={formData.eudd_defaults_desc}
                        onChange={(e) => setFormData({ ...formData, eudd_defaults_desc: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="defaultLevel" className="text-right">
                        Default Level
                      </Label>
                      <Select
                        value={formData.eudd_default_type}
                        onValueChange={(value) => setFormData({ ...formData, eudd_default_type: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select default level" />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="language" className="text-right">
                        Language
                      </Label>
                      <Select
                        value={formData.eudd_lang}
                        onValueChange={(value) => setFormData({ ...formData, eudd_lang: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={handleCreate}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-lg">{t('common.loading')}</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Default</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {masterDefaults.map((masterDefault) => (
                        <TableRow key={masterDefault.eudd_key}>
                          <TableCell className="font-medium">{masterDefault.eudd_key}</TableCell>
                          <TableCell>{masterDefault.eudd_defaults_desc}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(masterDefault)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(masterDefault.eudd_key)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Master Default</DialogTitle>
                  <DialogDescription>
                    Update the master default configuration.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-key" className="text-right">
                      Default Key
                    </Label>
                    <Input
                      id="edit-key"
                      value={formData.eudd_key}
                      disabled
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="edit-description"
                      value={formData.eudd_defaults_desc}
                      onChange={(e) => setFormData({ ...formData, eudd_defaults_desc: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-defaultLevel" className="text-right">
                      Default Level
                    </Label>
                    <Select
                      value={formData.eudd_default_type}
                      onValueChange={(value) => setFormData({ ...formData, eudd_default_type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select default level" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-language" className="text-right">
                      Language
                    </Label>
                    <Select
                      value={formData.eudd_lang}
                      onValueChange={(value) => setFormData({ ...formData, eudd_lang: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleUpdate}>Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </AdminLayout>
  );
}