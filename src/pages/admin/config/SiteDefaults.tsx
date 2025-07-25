import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { siteDefaultsService } from '@/services/siteDefaultsService';
import { SiteDefault, SiteDefaultCreate, SiteDefaultUpdate } from '@/lib/dto/siteDefaults.dto';

export default function SiteDefaults() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [siteDefaults, setSiteDefaults] = useState<SiteDefault[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSiteDefault, setEditingSiteDefault] = useState<SiteDefault | null>(null);
  const [formData, setFormData] = useState<SiteDefaultCreate>({
    eudd_key: '',
    eudd_defaults_desc: '',
    eudd_sys_key: 'NOT',
    eudd_lang: 'EN',
  });

  useEffect(() => {
    fetchSiteDefaults();
  }, []);

  const fetchSiteDefaults = async () => {
    try {
      setLoading(true);
      const response = await siteDefaultsService.getAll();
      if (response.success && response.data) {
        setSiteDefaults(response.data);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to fetch site defaults',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await siteDefaultsService.create(formData);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || 'Site default created successfully',
        });
        setIsCreateDialogOpen(false);
        setFormData({
          eudd_key: '',
          eudd_defaults_desc: '',
          eudd_sys_key: 'NOT',
          eudd_lang: 'EN',
        });
        fetchSiteDefaults();
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to create site default',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (siteDefault: SiteDefault) => {
    setEditingSiteDefault(siteDefault);
    setFormData({
      eudd_key: siteDefault.eudd_key,
      eudd_defaults_desc: siteDefault.eudd_defaults_desc,
      eudd_sys_key: siteDefault.eudd_sys_key || 'NOT',
      eudd_lang: siteDefault.eudd_lang || 'EN',
      eudd_default_type: siteDefault.eudd_default_type,
      eudd_is_master: siteDefault.eudd_is_master,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingSiteDefault) return;

    try {
      const updateData: SiteDefaultUpdate = {
        eudd_defaults_desc: formData.eudd_defaults_desc,
        eudd_default_type: formData.eudd_default_type,
        eudd_is_master: formData.eudd_is_master,
      };

      const response = await siteDefaultsService.update(editingSiteDefault.eudd_key, updateData);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || 'Site default updated successfully',
        });
        setIsEditDialogOpen(false);
        setEditingSiteDefault(null);
        fetchSiteDefaults();
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to update site default',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this site default?')) return;

    try {
      const response = await siteDefaultsService.delete(key);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || 'Site default deleted successfully',
        });
        fetchSiteDefaults();
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to delete site default',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold">Site Defaults</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Site Default
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Site Default</DialogTitle>
                <DialogDescription>
                  Add a new site default configuration.
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
          <CardHeader>
            <CardTitle>List of Site Defaults</CardTitle>
            <CardDescription>
              Manage system default configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {siteDefaults.map((siteDefault) => (
                  <TableRow key={siteDefault.eudd_key}>
                    <TableCell className="font-medium">{siteDefault.eudd_key}</TableCell>
                    <TableCell>{siteDefault.eudd_defaults_desc}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(siteDefault)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(siteDefault.eudd_key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Site Default</DialogTitle>
              <DialogDescription>
                Update the site default configuration.
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}