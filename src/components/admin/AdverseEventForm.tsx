
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdverseEventDto } from '@/lib/dto/adverseEvent.dto';
import { z } from 'zod';

// Create a form schema that matches the actual database fields
const formSchema = z.object({
  eaei_patient_first_name: z.string().min(1, 'First name is required'),
  eaei_patient_last_name: z.string().min(1, 'Last name is required'),
  eaei_patient_middle_initial: z.string().optional(),
  eaei_patient_dob: z.string().optional(),
  eaei_patient_age: z.number().min(0).optional(),
  eaei_sex: z.string().optional(),
  eaei_patient_weight: z.number().min(0).optional(),
  eaei_patient_height: z.number().min(0).optional(),
  eaei_adverse_events_description: z.string().min(1, 'Event description is required'),
  eaei_adverse_event_onset: z.string().optional(),
  eaei_event_location: z.string().optional(),
  eaei_event_severity: z.string().optional(),
  eaei_medication_name: z.string().optional(),
  eaei_medical_history: z.string().optional(),
  eaei_actions_taken: z.string().optional(),
  eaei_reporter_name: z.string().min(1, 'Reporter name is required'),
  eaei_reporter_title: z.string().optional(),
  eaei_assigned_to: z.string().optional(),
  eaei_status: z.enum(['Draft', 'Submitted', 'Under Review', 'Closed']).default('Draft'),
});

type FormData = z.infer<typeof formSchema>;

interface AdverseEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: AdverseEventDto | null;
  isLoading?: boolean;
}

export const AdverseEventForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: AdverseEventFormProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('patient');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eaei_patient_first_name: '',
      eaei_patient_last_name: '',
      eaei_patient_middle_initial: '',
      eaei_patient_dob: '',
      eaei_patient_age: undefined,
      eaei_sex: '',
      eaei_patient_weight: undefined,
      eaei_patient_height: undefined,
      eaei_adverse_events_description: '',
      eaei_adverse_event_onset: '',
      eaei_event_location: '',
      eaei_event_severity: '',
      eaei_medication_name: '',
      eaei_medical_history: '',
      eaei_actions_taken: '',
      eaei_reporter_name: '',
      eaei_reporter_title: '',
      eaei_assigned_to: '',
      eaei_status: 'Draft',
    },
  });

  useEffect(() => {
    if (initialData) {
      console.log('Setting form data with initialData:', initialData);
      form.reset({
        eaei_patient_first_name: initialData.eaei_patient_first_name || '',
        eaei_patient_last_name: initialData.eaei_patient_last_name || '',
        eaei_patient_middle_initial: initialData.eaei_patient_middle_initial || '',
        eaei_patient_dob: initialData.eaei_patient_dob || '',
        eaei_patient_age: initialData.eaei_patient_age || undefined,
        eaei_sex: initialData.eaei_sex || '',
        eaei_patient_weight: initialData.eaei_patient_weight || undefined,
        eaei_patient_height: initialData.eaei_patient_height || undefined,
        eaei_adverse_events_description: initialData.eaei_adverse_events_description || '',
        eaei_adverse_event_onset: initialData.eaei_adverse_event_onset || '',
        eaei_event_location: initialData.eaei_event_location || '',
        eaei_event_severity: initialData.eaei_event_severity || '',
        eaei_medication_name: initialData.eaei_medication_name || '',
        eaei_medical_history: initialData.eaei_medical_history || '',
        eaei_actions_taken: initialData.eaei_actions_taken || '',
        eaei_reporter_name: initialData.eaei_reporter_name || '',
        eaei_reporter_title: initialData.eaei_reporter_title || '',
        eaei_assigned_to: initialData.eaei_assigned_to || '',
        eaei_status: (initialData.eaei_status as any) || 'Draft',
      });
    } else {
      console.log('Resetting form to defaults');
      form.reset();
    }
  }, [initialData, form]);

  const handleSubmit = (data: FormData) => {
    console.log('Form submitted with data:', data);
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t('adverseEvents.updateEvent') : t('adverseEvents.createEvent')}
          </DialogTitle>
          <DialogDescription>
            {initialData ? t('adverseEvents.updateDescription') : t('adverseEvents.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="patient">{t('adverseEvents.patientInfo')}</TabsTrigger>
                <TabsTrigger value="event">{t('adverseEvents.eventDetails')}</TabsTrigger>
                <TabsTrigger value="medical">{t('adverseEvents.medicalInfo')}</TabsTrigger>
                <TabsTrigger value="reporting">{t('adverseEvents.reportingInfo')}</TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('adverseEvents.patientInformation')}</CardTitle>
                    <CardDescription>{t('adverseEvents.patientInfoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eaei_patient_first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.firstName')} *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.lastName')} *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_middle_initial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.middleName')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.dateOfBirth')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.age')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.gender')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('adverseEvents.selectGender')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="event" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('adverseEvents.eventInformation')}</CardTitle>
                    <CardDescription>{t('adverseEvents.eventInfoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="eaei_adverse_events_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.eventDescription')} *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_adverse_event_onset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.eventDate')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_event_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_event_severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Severity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mild">Mild</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="Severe">Severe</SelectItem>
                              <SelectItem value="Life-threatening">Life-threatening</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('adverseEvents.medicalInformation')}</CardTitle>
                    <CardDescription>{t('adverseEvents.medicalInfoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="eaei_medication_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.medicationName')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_medical_history"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.medicalHistory')}</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_actions_taken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.actionsTaken')}</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reporting" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('adverseEvents.reportingInformation')}</CardTitle>
                    <CardDescription>{t('adverseEvents.reportingInfoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="eaei_reporter_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.reporterName')} *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eaei_reporter_title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.reporterTitle')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="eaei_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.status')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Under Review">Under Review</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eaei_assigned_to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.assignedTo')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t('common.creating')
                  : initialData
                  ? t('adverseEvents.updateEvent')
                  : t('adverseEvents.createEvent')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
