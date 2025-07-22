import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRoleService } from '@/services/userRoleService';
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleDto } from '@/lib/dto/userRole.dto';
import { CreateUserRoleDto as CreateUserRoleDtoSchema, UpdateUserRoleDto as UpdateUserRoleDtoSchema } from '@/lib/dto/userRole.dto';

const roleTypeOptions = [
  { value: 'E', label: 'Extranet (System Independent Role)' },
  { value: 'S', label: 'Supplier (System Independent Role)' },
  { value: 'C', label: 'Internet (System Dependent Role)' },
];

function UserRoles() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRoleDto | null>(null);

  const createForm = useForm<CreateUserRoleDto>({
    resolver: zodResolver(CreateUserRoleDtoSchema),
    defaultValues: {
      eurRoleNr: '',
      eurRoleType: 'E',
      eurRoleDescription: '',
      eurBusDomain: 'Sales',
    },
  });

  const updateForm = useForm<UpdateUserRoleDto>({
    resolver: zodResolver(UpdateUserRoleDtoSchema),
    defaultValues: {
      eurRoleNr: '',
      eurRoleType: 'E',
      eurRoleDescription: '',
      eurBusDomain: 'Sales',
    },
  });

  // Load user roles
  const loadUserRoles = async () => {
    try {
      setLoading(true);
      const roles = await userRoleService.getAllUserRoles();
      setUserRoles(roles);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('userRoles.loadError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserRoles();
  }, []);

  // Handle create form submission
  const onCreateSubmit = async (data: CreateUserRoleDto) => {
    try {
      setActionLoading(true);
      await userRoleService.createUserRole(data);
      toast({
        title: t('common.success'),
        description: t('userRoles.created'),
      });
      setIsDialogOpen(false);
      setEditingRole(null);
      createForm.reset();
      loadUserRoles();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('userRoles.genericError'),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update form submission
  const onUpdateSubmit = async (data: UpdateUserRoleDto) => {
    try {
      setActionLoading(true);
      if (editingRole) {
        await userRoleService.updateUserRole(editingRole.eurRoleNr!, data);
        toast({
          title: t('common.success'),
          description: t('userRoles.updated'),
        });
        setIsDialogOpen(false);
        setEditingRole(null);
        updateForm.reset();
        loadUserRoles();
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('userRoles.genericError'),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit role
  const handleEditRole = (role: UserRoleDto) => {
    setEditingRole(role);
    updateForm.reset({
      eurRoleNr: role.eurRoleNr || '',
      eurRoleType: role.eurRoleType as 'E' | 'S' | 'C',
      eurRoleDescription: role.eurRoleDescription || '',
      eurBusDomain: role.eurBusDomain || 'Sales',
    });
    setIsDialogOpen(true);
  };

  // Handle delete role
  const handleDeleteRole = async (roleNr: string) => {
    try {
      setActionLoading(true);
      await userRoleService.deleteUserRole(roleNr);
      toast({
        title: t('common.success'),
        description: t('userRoles.deleted'),
      });
      loadUserRoles();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('userRoles.genericError'),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle create new role
  const handleCreateNew = () => {
    setEditingRole(null);
    createForm.reset({
      eurRoleNr: '',
      eurRoleType: 'E',
      eurRoleDescription: '',
      eurBusDomain: 'Sales',
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('userRoles.title')}</h1>
          <p className="text-muted-foreground">{t('userRoles.description')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              {t('userRoles.createNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? t('userRoles.updateRole') : t('userRoles.createRole')}
              </DialogTitle>
              <DialogDescription>
                {editingRole 
                  ? t('userRoles.updateDescription') 
                  : t('userRoles.createDescription')
                }
              </DialogDescription>
            </DialogHeader>
            {editingRole ? (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
                  <FormField
                    control={updateForm.control}
                    name="eurRoleNr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.role')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={true}
                            placeholder={t('userRoles.enterRole')} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={updateForm.control}
                    name="eurRoleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.roleType')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('userRoles.selectRoleType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={updateForm.control}
                    name="eurRoleDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.description')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('userRoles.enterDescription')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={updateForm.control}
                    name="eurBusDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.businessDomain')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sales" />
                        </FormControl>
                        <FormDescription>
                          {t('userRoles.defaultSales')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('userRoles.updateRole')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            ) : (
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="eurRoleNr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.role')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={t('userRoles.enterRole')} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="eurRoleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.roleType')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('userRoles.selectRoleType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="eurRoleDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.description')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('userRoles.enterDescription')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="eurBusDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('userRoles.businessDomain')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sales" />
                        </FormControl>
                        <FormDescription>
                          {t('userRoles.defaultSales')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('userRoles.createRole')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('userRoles.existingRoles')}</CardTitle>
          <CardDescription>
            {t('userRoles.listDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRoles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('userRoles.noRoles')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('userRoles.role')}</TableHead>
                  <TableHead>{t('userRoles.type')}</TableHead>
                  <TableHead>{t('userRoles.description')}</TableHead>
                  <TableHead>{t('userRoles.businessDomain')}</TableHead>
                  <TableHead className="text-right">{t('userRoles.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.map((role) => (
                  <TableRow key={role.eurRoleNr}>
                    <TableCell className="font-medium">{role.eurRoleNr}</TableCell>
                    <TableCell>
                      {roleTypeOptions.find(opt => opt.value === role.eurRoleType)?.label || role.eurRoleType}
                    </TableCell>
                    <TableCell>{role.eurRoleDescription}</TableCell>
                    <TableCell>{role.eurBusDomain}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('userRoles.confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('userRoles.deleteMessage')} "{role.eurRoleNr}". {t('userRoles.undoWarning')}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRole(role.eurRoleNr!)}
                                disabled={actionLoading}
                              >
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('userRoles.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
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

export default UserRoles;