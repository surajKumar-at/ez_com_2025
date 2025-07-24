import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit2, MapPin } from 'lucide-react';
import { salesAreaService } from '@/services/salesAreaService';
import { systemService } from '@/services/systemService';
import { SalesArea, CreateSalesAreaDto } from '@/lib/dto/salesArea.dto';
import { System } from '@/lib/dto/system.dto';

export default function SalesAreas() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [salesAreas, setSalesAreas] = useState<SalesArea[]>([]);
  const [filteredSalesAreas, setFilteredSalesAreas] = useState<SalesArea[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSalesArea, setEditingSalesArea] = useState<SalesArea | null>(null);

  const [formData, setFormData] = useState<CreateSalesAreaDto>({
    systemNo: 0,
    code: '',
    language: '',
    description: '',
    synchronizable: 'N'
  });

  const languages = [
    { value: 'EN', label: 'English' },
    { value: 'ES', label: 'Spanish' },
    { value: 'FR', label: 'French' },
    { value: 'DE', label: 'German' }
  ];

  useEffect(() => {
    fetchSalesAreas();
    fetchSystems();
  }, []);

  useEffect(() => {
    const filtered = salesAreas.filter(salesArea =>
      salesArea.eskd_sys_key_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salesArea.eskd_sys_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salesArea.eskd_sys_no.toString().includes(searchTerm)
    );
    setFilteredSalesAreas(filtered);
  }, [salesAreas, searchTerm]);

  const fetchSalesAreas = async () => {
    try {
      setLoading(true);
      const data = await salesAreaService.getSalesAreas();
      setSalesAreas(data);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to fetch sales areas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSystems = async () => {
    try {
      const data = await systemService.getSystems();
      setSystems(data);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to fetch systems',
        variant: 'destructive'
      });
    }
  };

  const handleCreateSalesArea = async () => {
    try {
      setIsSubmitting(true);
      await salesAreaService.createSalesArea(formData);
      
      toast({
        title: t('common.success'),
        description: 'Sales area created successfully'
      });

      setIsCreateDialogOpen(false);
      resetForm();
      await fetchSalesAreas();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to create sales area',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSalesArea = async () => {
    if (!editingSalesArea) return;

    try {
      setIsSubmitting(true);
      await salesAreaService.updateSalesArea({
        ...formData,
        eskd_sys_no: editingSalesArea.eskd_sys_no
      });
      
      toast({
        title: t('common.success'),
        description: 'Sales area updated successfully'
      });

      setIsEditDialogOpen(false);
      setEditingSalesArea(null);
      resetForm();
      await fetchSalesAreas();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to update sales area',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      systemNo: 0,
      code: '',
      language: '',
      description: '',
      synchronizable: 'N'
    });
  };

  const handleEdit = (salesArea: SalesArea) => {
    setEditingSalesArea(salesArea);
    setFormData({
      systemNo: salesArea.eskd_sys_no,
      code: salesArea.eskd_sys_key,
      language: 'EN', // Default since language info is not in the table
      description: salesArea.eskd_sys_key_desc,
      synchronizable: salesArea.eskd_sync_flag
    });
    setIsEditDialogOpen(true);
  };

  const getSystemDescription = (systemNo: number) => {
    const system = systems.find(s => s.esd_sys_no === systemNo);
    return system ? `${system.esd_sys_no} - ${system.esd_sys_desc}` : systemNo.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Areas</h1>
            <p className="text-sm text-muted-foreground">Manage sales area configurations</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Sales Area
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Sales Area</DialogTitle>
              <DialogDescription>Add a new sales area configuration</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system">System *</Label>
                <Select 
                  value={formData.systemNo.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, systemNo: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="--Select System--" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map((system) => (
                      <SelectItem key={system.esd_sys_no} value={system.esd_sys_no.toString()}>
                        {system.esd_sys_no} - {system.esd_sys_desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter sales area code"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Synchronizable</Label>
                <RadioGroup
                  value={formData.synchronizable}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, synchronizable: value }))}
                  className="flex items-center space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Y" id="sync-yes" />
                    <Label htmlFor="sync-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N" id="sync-no" />
                    <Label htmlFor="sync-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCreateSalesArea} disabled={isSubmitting}>
                {isSubmitting ? t('common.creating') : t('common.create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Sales Areas</CardTitle>
          <CardDescription>Search by system, code, or description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sales areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Areas Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">List of Sales Area</CardTitle>
              <CardDescription>
                Total sales areas: {filteredSalesAreas.length}
              </CardDescription>
            </div>
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
                  <TableHead>System</TableHead>
                  <TableHead>Sales Area</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Synchronize</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalesAreas.map((salesArea) => (
                  <TableRow key={`${salesArea.eskd_sys_no}-${salesArea.eskd_sys_key}`}>
                    <TableCell className="font-medium">
                      {getSystemDescription(salesArea.eskd_sys_no)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{salesArea.eskd_sys_key}</Badge>
                    </TableCell>
                    <TableCell>{salesArea.eskd_sys_key_desc}</TableCell>
                    <TableCell>
                      <Badge variant={salesArea.eskd_sync_flag === 'Y' ? 'default' : 'secondary'}>
                        {salesArea.eskd_sync_flag === 'Y' ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(salesArea)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
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
            <DialogTitle>Edit Sales Area</DialogTitle>
            <DialogDescription>Update sales area configuration</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-system">System *</Label>
              <Select 
                value={formData.systemNo.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, systemNo: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="--Select System--" />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.esd_sys_no} value={system.esd_sys_no.toString()}>
                      {system.esd_sys_no} - {system.esd_sys_desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-code">Code *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter sales area code"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-language">Language *</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Synchronizable</Label>
              <RadioGroup
                value={formData.synchronizable}
                onValueChange={(value) => setFormData(prev => ({ ...prev, synchronizable: value }))}
                className="flex items-center space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Y" id="edit-sync-yes" />
                  <Label htmlFor="edit-sync-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="N" id="edit-sync-no" />
                  <Label htmlFor="edit-sync-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingSalesArea(null);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdateSalesArea} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}