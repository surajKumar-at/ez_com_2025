
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { adverseEventService } from '@/services/adverseEventService';
import { AdverseEventDto } from '@/lib/dto/adverseEvent.dto';
import { AdverseEventForm } from '@/components/admin/AdverseEventForm';

const AdverseEvents = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdverseEventDto | null>(null);

  // Fetch adverse events
  const { data: adverseEvents = [], isLoading, error } = useQuery({
    queryKey: ['adverseEvents'],
    queryFn: adverseEventService.getAllAdverseEvents,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: adverseEventService.createAdverseEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adverseEvents'] });
      toast({ title: t('adverseEvents.created') });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('adverseEvents.genericError'),
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      adverseEventService.updateAdverseEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adverseEvents'] });
      toast({ title: t('adverseEvents.updated') });
      setIsFormOpen(false);
      setEditingEvent(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('adverseEvents.genericError'),
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: adverseEventService.deleteAdverseEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adverseEvents'] });
      toast({ title: t('adverseEvents.deleted') });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('adverseEvents.genericError'),
        variant: 'destructive',
      });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: adverseEventService.deleteMultipleAdverseEvents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adverseEvents'] });
      toast({ title: t('adverseEvents.bulkDeleted') });
      setSelectedEvents([]);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('adverseEvents.genericError'),
        variant: 'destructive',
      });
    },
  });

  const filteredEvents = adverseEvents.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.eaei_patient_fname?.toLowerCase().includes(searchLower) ||
      event.eaei_patient_lname?.toLowerCase().includes(searchLower) ||
      event.eaei_event_description?.toLowerCase().includes(searchLower) ||
      event.eaei_status?.toLowerCase().includes(searchLower) ||
      event.eaei_reporter_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(filteredEvents.map(event => event.eaei_id!));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId: number, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId]);
    } else {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    }
  };

  const handleEdit = (event: AdverseEventDto) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Submitted': return 'default';
      case 'Under Review': return 'outline';
      case 'Closed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority?: string) => {
    switch (priority) {
      case 'Low': return 'secondary';
      case 'Medium': return 'default';
      case 'High': return 'outline';
      case 'Critical': return 'destructive';
      default: return 'secondary';
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          {t('adverseEvents.loadError')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('adverseEvents.title')}</h1>
        <p className="text-muted-foreground">{t('adverseEvents.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('adverseEvents.searchTitle')}
            <Button onClick={handleCreate} className="ml-4">
              <Plus className="h-4 w-4 mr-2" />
              {t('adverseEvents.createNew')}
            </Button>
          </CardTitle>
          <CardDescription>{t('adverseEvents.searchDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('adverseEvents.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('adverseEvents.eventsList')}</CardTitle>
              <CardDescription>
                {t('adverseEvents.totalEvents', { count: filteredEvents.length })}
                {selectedEvents.length > 0 && (
                  <span className="ml-2">
                    ({selectedEvents.length} {t('adverseEvents.selected')})
                  </span>
                )}
              </CardDescription>
            </div>
            {selectedEvents.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('adverseEvents.deleteSelected')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('adverseEvents.confirmBulkDelete')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('adverseEvents.bulkDeleteMessage')} {selectedEvents.length} {t('adverseEvents.events')}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => bulkDeleteMutation.mutate(selectedEvents)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('adverseEvents.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t('common.loading')}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? t('adverseEvents.noEventsFound') : t('adverseEvents.noEvents')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label={t('adverseEvents.selectAll')}
                    />
                  </TableHead>
                  <TableHead>{t('adverseEvents.patientName')}</TableHead>
                  <TableHead>{t('adverseEvents.eventDescription')}</TableHead>
                  <TableHead>{t('adverseEvents.status')}</TableHead>
                  <TableHead>{t('adverseEvents.priority')}</TableHead>
                  <TableHead>{t('adverseEvents.reporter')}</TableHead>
                  <TableHead>{t('adverseEvents.eventDate')}</TableHead>
                  <TableHead className="text-right">{t('adverseEvents.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.eaei_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEvents.includes(event.eaei_id!)}
                        onCheckedChange={(checked) => handleSelectEvent(event.eaei_id!, checked as boolean)}
                        aria-label={t('adverseEvents.select')}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.eaei_patient_fname} {event.eaei_patient_lname}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {event.eaei_event_description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(event.eaei_status)}>
                        {event.eaei_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(event.eaei_priority)}>
                        {event.eaei_priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.eaei_reporter_name}</TableCell>
                    <TableCell>{event.eaei_event_date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
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
                              <AlertDialogTitle>{t('adverseEvents.confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('adverseEvents.deleteMessage')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(event.eaei_id!)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t('adverseEvents.delete')}
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

      <AdverseEventForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={(data) => {
          if (editingEvent) {
            updateMutation.mutate({ id: editingEvent.eaei_id!, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        initialData={editingEvent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default AdverseEvents;
