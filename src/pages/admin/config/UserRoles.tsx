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
import { userRoleSchema } from '@/lib/db/schema';

const roleTypeOptions = [
  { value: 'E', label: 'Extranet (System Independent Role)' },
  { value: 'S', label: 'Supplier (System Independent Role)' },
  { value: 'C', label: 'Internet (System Dependent Role)' },
];

export default function UserRoles() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRoleDto | null>(null);

  const form = useForm<CreateUserRoleDto>({
    resolver: zodResolver(userRoleSchema),
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
        title: t('error'),
        description: t('Failed to load user roles'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserRoles();
  }, []);

  // Handle form submission
  const onSubmit = async (data: CreateUserRoleDto) => {
    try {
      setActionLoading(true);
      
      if (editingRole) {
        await userRoleService.updateUserRole(editingRole.eurRoleNr!, data);
        toast({
          title: t('success'),
          description: t('User role updated successfully'),
        });
      } else {
        await userRoleService.createUserRole(data);
        toast({
          title: t('success'),
          description: t('User role created successfully'),
        });
      }
      
      setIsDialogOpen(false);
      setEditingRole(null);
      form.reset();
      loadUserRoles();
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('An error occurred'),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit role
  const handleEditRole = (role: UserRoleDto) => {
    setEditingRole(role);
    form.reset({
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
        title: t('success'),
        description: t('User role deleted successfully'),
      });
      loadUserRoles();
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('An error occurred'),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle create new role
  const handleCreateNew = () => {
    setEditingRole(null);
    form.reset({
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
                {editingRole ? t('Update Role') : t('Create New Role')}
              </DialogTitle>
              <DialogDescription>
                {editingRole 
                  ? t('Update the role details below') 
                  : t('Fill in the details to create a new user role')
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="eurRoleNr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Role')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!!editingRole}
                          placeholder={t('Enter role name')} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eurRoleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Role Type')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Select role type')} />
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
                  control={form.control}
                  name="eurRoleDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Description')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('Enter role description')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eurBusDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Business Domain')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sales" />
                      </FormControl>
                      <FormDescription>
                        {t('Default value is "Sales"')}
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
                    {t('Cancel')}
                  </Button>
                  <Button type="submit" disabled={actionLoading}>
                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingRole ? t('Update Role') : t('Create Role')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('Existing User Roles')}</CardTitle>
          <CardDescription>
            {t('List of all user roles in the system')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRoles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('No user roles found')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Role')}</TableHead>
                  <TableHead>{t('Type')}</TableHead>
                  <TableHead>{t('Description')}</TableHead>
                  <TableHead>{t('Business Domain')}</TableHead>
                  <TableHead className="text-right">{t('Actions')}</TableHead>
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
                              <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('This will delete the user role')} "{role.eurRoleNr}". {t('This action cannot be undone')}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRole(role.eurRoleNr!)}
                                disabled={actionLoading}
                              >
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('Delete')}
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