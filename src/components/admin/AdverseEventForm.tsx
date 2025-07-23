
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
import { adverseEventSchema, AdverseEvent, AdverseEventDto } from '@/lib/dto/adverseEvent.dto';

interface AdverseEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdverseEvent) => void;
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

  const form = useForm<AdverseEvent>({
    resolver: zodResolver(adverseEventSchema),
    defaultValues: {
      eaei_patient_first_name: '',
      eaei_patient_last_name: '',
      eaei_patient_middle_initial: '',
      eaei_patient_dob: '',
      eaei_age_at_vaccination_in_months: undefined,
      eaei_sex: '',
      eaei_weight_at_birth: undefined,
      eaei_adverse_events_description: '',
      eaei_adverse_event_onset: '',
      eaei_form_filled_by_name: '',
      eaei_form_filled_by_occupation: '',
      eaei_relation_to_patient: '',
      eaei_patient_recovered: undefined,
      eaei_is_emergency_room_or_dr_visit_reqd: undefined,
      eaei_is_life_threat_illness: undefined,
      eaei_result_permanent_disability: undefined,
      eaei_result_prolong_hospitalization: undefined,
      eaei_hospitalization_days: undefined,
      eaei_illness_at_vaccination_time: '',
      eaei_other_medications: '',
      eaei_vaccine_purchased_with: '',
      eaei_diag_tests_lab_data: '',
      eaei_pre_conditions: '',
      eaei_reported_previously_to: '',
      eaei_is_15_day_report: undefined,
      eaei_report_type: '',
      eaei_assigned_to: '',
      eaei_status: 'Draft',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        eaei_patient_first_name: initialData.eaei_patient_first_name || '',
        eaei_patient_last_name: initialData.eaei_patient_last_name || '',
        eaei_patient_middle_initial: initialData.eaei_patient_middle_initial || '',
        eaei_patient_dob: initialData.eaei_patient_dob || '',
        eaei_age_at_vaccination_in_months: initialData.eaei_age_at_vaccination_in_months || undefined,
        eaei_sex: initialData.eaei_sex || '',
        eaei_weight_at_birth: initialData.eaei_weight_at_birth || undefined,
        eaei_adverse_events_description: initialData.eaei_adverse_events_description || '',
        eaei_adverse_event_onset: initialData.eaei_adverse_event_onset || '',
        eaei_form_filled_by_name: initialData.eaei_form_filled_by_name || '',
        eaei_form_filled_by_occupation: initialData.eaei_form_filled_by_occupation || '',
        eaei_relation_to_patient: initialData.eaei_relation_to_patient || '',
        eaei_patient_recovered: initialData.eaei_patient_recovered as any,
        eaei_is_emergency_room_or_dr_visit_reqd: initialData.eaei_is_emergency_room_or_dr_visit_reqd as any,
        eaei_is_life_threat_illness: initialData.eaei_is_life_threat_illness as any,
        eaei_result_permanent_disability: initialData.eaei_result_permanent_disability as any,
        eaei_result_prolong_hospitalization: initialData.eaei_result_prolong_hospitalization as any,
        eaei_hospitalization_days: initialData.eaei_hospitalization_days || undefined,
        eaei_illness_at_vaccination_time: initialData.eaei_illness_at_vaccination_time || '',
        eaei_other_medications: initialData.eaei_other_medications || '',
        eaei_vaccine_purchased_with: initialData.eaei_vaccine_purchased_with || '',
        eaei_diag_tests_lab_data: initialData.eaei_diag_tests_lab_data || '',
        eaei_pre_conditions: initialData.eaei_pre_conditions || '',
        eaei_reported_previously_to: initialData.eaei_reported_previously_to || '',
        eaei_is_15_day_report: initialData.eaei_is_15_day_report as any,
        eaei_report_type: initialData.eaei_report_type || '',
        eaei_assigned_to: initialData.eaei_assigned_to || '',
        eaei_status: (initialData.eaei_status as any) || 'Draft',
      });
    } else {
      form.reset();
    }
  }, [initialData, form]);

  const handleSubmit = (data: AdverseEvent) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                      name="eaei_pre_conditions"
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
                      name="eaei_diag_tests_lab_data"
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
              <Button type="button" variant="outline" onClick={onClose}>
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
