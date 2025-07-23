import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { userRoleService } from '@/services/userRoleService';
import { UserDto, CreateUserDto } from '@/lib/dto/user.dto';
import { UserRoleDto } from '@/lib/dto/userRole.dto';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  Shield,
  User,
  Building,
  Download
} from 'lucide-react';

const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userType: z.string().min(1, 'User type is required'),
  roles: z.array(z.string()).optional().default([]),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<UserRoleDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [migrateDialogOpen, setMigrateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      userType: '',
      roles: []
    }
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error: any) {
      toast({
        title: t('users.error.fetchFailed'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await userRoleService.getAllUserRoles();
      setRoles(rolesData);
    } catch (error: any) {
      console.error('Error loading roles:', error);
    }
  };

  const handleCreateUser = async (data: CreateUserFormData) => {
    try {
      const createData: CreateUserDto = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: parseInt(data.userType),
        roles: data.roles || []
      };

      await userService.createUser(createData);
      
      toast({
        title: t('users.success.created'),
        description: t('users.success.createdDescription')
      });
      
      setCreateDialogOpen(false);
      form.reset();
      loadUsers();
    } catch (error: any) {
      toast({
        title: t('users.error.createFailed'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete);
      
      toast({
        title: t('users.success.deleted'),
        description: t('users.success.deletedDescription')
      });
      
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error: any) {
      toast({
        title: t('users.error.deleteFailed'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleBlockUser = async (userId: string, block: boolean) => {
    try {
      if (block) {
        await userService.blockUser(userId);
      } else {
        await userService.unblockUser(userId);
      }
      
      toast({
        title: block ? t('users.success.blocked') : t('users.success.unblocked'),
        description: block ? t('users.success.blockedDescription') : t('users.success.unblockedDescription')
      });
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: t('users.error.updateFailed'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleMigrateUsers = async () => {
    try {
      const result = await userService.migrateExistingUsers();
      
      toast({
        title: t('users.success.migrated'),
        description: result.message || t('users.success.migratedDescription')
      });
      
      setMigrateDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      toast({
        title: t('users.error.migrateFailed'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.eu_id));
    }
  };

  const getUserTypeLabel = (type: number) => {
    switch (type) {
      case 1: return { label: t('users.types.admin'), icon: Shield, color: 'bg-red-100 text-red-700' };
      case 2: return { label: t('users.types.internal'), icon: User, color: 'bg-blue-100 text-blue-700' };
      case 3: return { label: t('users.types.customer'), icon: Building, color: 'bg-green-100 text-green-700' };
      default: return { label: t('users.types.unknown'), icon: User, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const filteredUsers = users.filter(user =>
    user.eu_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.eu_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.eu_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.eu_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
            <p className="text-muted-foreground">{t('users.description')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setMigrateDialogOpen(true)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {t('users.migrate')}
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('users.create')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('users.createTitle')}</DialogTitle>
                <DialogDescription>{t('users.createDescription')}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('users.fields.email')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="user@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('users.fields.firstName')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('users.fields.firstNamePlaceholder')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('users.fields.lastName')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('users.fields.lastNamePlaceholder')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('users.fields.userType')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('users.fields.userTypePlaceholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">{t('users.types.admin')}</SelectItem>
                            <SelectItem value="2">{t('users.types.internal')}</SelectItem>
                            <SelectItem value="3">{t('users.types.customer')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('users.fields.roles')}</FormLabel>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                          {roles.map((role) => (
                            <div key={role.eurRoleNr} className="flex items-center space-x-2">
                              <Checkbox
                                id={role.eurRoleNr}
                                checked={field.value?.includes(role.eurRoleNr) || false}
                                onCheckedChange={(checked) => {
                                  const currentRoles = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentRoles, role.eurRoleNr]);
                                  } else {
                                    field.onChange(currentRoles.filter(r => r !== role.eurRoleNr));
                                  }
                                }}
                              />
                              <Label htmlFor={role.eurRoleNr} className="text-sm">
                                {role.eurRoleDescription}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">
                      {t('users.create')}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>{t('users.filters')}</CardTitle>
          <CardDescription>{t('users.filtersDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('users.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedUsers.length} {t('users.selected')}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedUsers.forEach(userId => handleBlockUser(userId, true));
                    setSelectedUsers([]);
                  }}
                  className="gap-1"
                >
                  <Ban className="h-3 w-3" />
                  {t('users.blockSelected')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t('users.table.id')}</TableHead>
                  <TableHead>{t('users.table.name')}</TableHead>
                  <TableHead>{t('users.table.email')}</TableHead>
                  <TableHead>{t('users.table.type')}</TableHead>
                  <TableHead>{t('users.table.status')}</TableHead>
                  <TableHead>{t('users.table.lastLogin')}</TableHead>
                  <TableHead className="text-right">{t('users.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      {t('users.noUsers')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const userType = getUserTypeLabel(user.eu_type);
                    const IconComponent = userType.icon;
                    const isBlocked = user.eu_deletion_flag === 'Y';

                    return (
                      <TableRow key={user.eu_id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.eu_id)}
                            onCheckedChange={() => handleSelectUser(user.eu_id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.eu_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {user.eu_first_name} {user.eu_last_name}
                          </div>
                        </TableCell>
                        <TableCell>{user.eu_email}</TableCell>
                        <TableCell>
                          <Badge className={userType.color}>
                            {userType.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isBlocked ? 'destructive' : 'secondary'}>
                            {isBlocked ? t('users.status.blocked') : t('users.status.active')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.eu_last_login_date ? (
                            <div className="text-sm">
                              <div>{user.eu_last_login_date}</div>
                              <div className="text-muted-foreground">{user.eu_last_login_time}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">{t('users.neverLoggedIn')}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('users.actions.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleBlockUser(user.eu_id, !isBlocked)}
                              >
                                {isBlocked ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t('users.actions.unblock')}
                                  </>
                                ) : (
                                  <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    {t('users.actions.block')}
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToDelete(user.eu_id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('users.actions.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Migrate Users Dialog */}
      <AlertDialog open={migrateDialogOpen} onOpenChange={setMigrateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.migrate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.migrateDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleMigrateUsers}>
              {t('users.migrate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              {t('users.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}