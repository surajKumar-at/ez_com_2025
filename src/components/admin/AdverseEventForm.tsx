
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
  eaei_age_at_vaccination_in_months: z.number().min(0).optional(),
  eaei_sex: z.string().optional(),
  eaei_weight_at_birth: z.number().min(0).optional(),
  eaei_patient_address1: z.string().optional(),
  eaei_patient_address2: z.string().optional(),
  eaei_patient_city: z.string().optional(),
  eaei_patient_state: z.string().optional(),
  eaei_patient_zip: z.string().optional(),
  eaei_patient_telno: z.string().optional(),
  eaei_adverse_events_description: z.string().min(1, 'Event description is required'),
  eaei_adverse_event_onset: z.string().optional(),
  eaei_vaccination_date: z.string().optional(),
  eaei_vaccinated_at: z.string().optional(),
  eaei_administered_by_name: z.string().optional(),
  eaei_form_filled_by_name: z.string().min(1, 'Reporter name is required'),
  eaei_form_filled_by_occupation: z.string().optional(),
  eaei_relation_to_patient: z.string().optional(),
  eaei_assigned_to: z.string().optional(),
  eaei_status: z.enum(['Draft', 'Submitted', 'Under Review', 'Closed']).default('Draft'),
  eaei_other_medications: z.string().optional(),
  eaei_pre_conditions: z.string().optional(),
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
      eaei_age_at_vaccination_in_months: undefined,
      eaei_sex: '',
      eaei_weight_at_birth: undefined,
      eaei_patient_address1: '',
      eaei_patient_address2: '',
      eaei_patient_city: '',
      eaei_patient_state: '',
      eaei_patient_zip: '',
      eaei_patient_telno: '',
      eaei_adverse_events_description: '',
      eaei_adverse_event_onset: '',
      eaei_vaccination_date: '',
      eaei_vaccinated_at: '',
      eaei_administered_by_name: '',
      eaei_form_filled_by_name: '',
      eaei_form_filled_by_occupation: '',
      eaei_relation_to_patient: '',
      eaei_assigned_to: '',
      eaei_status: 'Draft',
      eaei_other_medications: '',
      eaei_pre_conditions: '',
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
        eaei_age_at_vaccination_in_months: initialData.eaei_age_at_vaccination_in_months || undefined,
        eaei_sex: initialData.eaei_sex || '',
        eaei_weight_at_birth: initialData.eaei_weight_at_birth || undefined,
        eaei_patient_address1: initialData.eaei_patient_address1 || '',
        eaei_patient_address2: initialData.eaei_patient_address2 || '',
        eaei_patient_city: initialData.eaei_patient_city || '',
        eaei_patient_state: initialData.eaei_patient_state || '',
        eaei_patient_zip: initialData.eaei_patient_zip || '',
        eaei_patient_telno: initialData.eaei_patient_telno || '',
        eaei_adverse_events_description: initialData.eaei_adverse_events_description || '',
        eaei_adverse_event_onset: initialData.eaei_adverse_event_onset || '',
        eaei_vaccination_date: initialData.eaei_vaccination_date || '',
        eaei_vaccinated_at: initialData.eaei_vaccinated_at || '',
        eaei_administered_by_name: initialData.eaei_administered_by_name || '',
        eaei_form_filled_by_name: initialData.eaei_form_filled_by_name || '',
        eaei_form_filled_by_occupation: initialData.eaei_form_filled_by_occupation || '',
        eaei_relation_to_patient: initialData.eaei_relation_to_patient || '',
        eaei_assigned_to: initialData.eaei_assigned_to || '',
        eaei_status: (initialData.eaei_status as any) || 'Draft',
        eaei_other_medications: initialData.eaei_other_medications || '',
        eaei_pre_conditions: initialData.eaei_pre_conditions || '',
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
                      name="eaei_age_at_vaccination_in_months"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adverseEvents.age')} (in months)</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="eaei_weight_at_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight at Birth</FormLabel>
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
                      name="eaei_patient_address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address 1</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address 2</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_patient_telno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                      name="eaei_vaccination_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vaccination Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_vaccinated_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vaccinated At</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_administered_by_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Administered By</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                      name="eaei_other_medications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Medications</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eaei_pre_conditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pre-existing Conditions</FormLabel>
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
                        name="eaei_form_filled_by_name"
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
                        name="eaei_form_filled_by_occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reporter Occupation</FormLabel>
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
                        name="eaei_relation_to_patient"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relation to Patient</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    </div>
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
