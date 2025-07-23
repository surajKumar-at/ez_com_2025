
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
      eaei_patient_fname: '',
      eaei_patient_lname: '',
      eaei_patient_mname: '',
      eaei_patient_dob: '',
      eaei_patient_age: undefined,
      eaei_patient_gender: '',
      eaei_patient_weight: undefined,
      eaei_patient_height: undefined,
      eaei_patient_medical_record_no: '',
      eaei_event_description: '',
      eaei_event_date: '',
      eaei_event_time: '',
      eaei_event_location: '',
      eaei_event_severity: undefined,
      eaei_event_outcome: '',
      eaei_reporter_name: '',
      eaei_reporter_title: '',
      eaei_reporter_contact: '',
      eaei_device_name: '',
      eaei_device_model: '',
      eaei_device_serial: '',
      eaei_device_lot: '',
      eaei_medication_name: '',
      eaei_medication_dose: '',
      eaei_medication_route: '',
      eaei_medication_frequency: '',
      eaei_concomitant_meds: '',
      eaei_medical_history: '',
      eaei_lab_values: '',
      eaei_actions_taken: '',
      eaei_followup_required: undefined,
      eaei_report_to_fda: undefined,
      eaei_report_to_manufacturer: undefined,
      eaei_status: 'Draft',
      eaei_assigned_to: '',
      eaei_priority: 'Medium',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        eaei_patient_fname: initialData.eaei_patient_fname || '',
        eaei_patient_lname: initialData.eaei_patient_lname || '',
        eaei_patient_mname: initialData.eaei_patient_mname || '',
        eaei_patient_dob: initialData.eaei_patient_dob || '',
        eaei_patient_age: initialData.eaei_patient_age || undefined,
        eaei_patient_gender: initialData.eaei_patient_gender || '',
        eaei_patient_weight: initialData.eaei_patient_weight || undefined,
        eaei_patient_height: initialData.eaei_patient_height || undefined,
        eaei_patient_medical_record_no: initialData.eaei_patient_medical_record_no || '',
        eaei_event_description: initialData.eaei_event_description || '',
        eaei_event_date: initialData.eaei_event_date || '',
        eaei_event_time: initialData.eaei_event_time || '',
        eaei_event_location: initialData.eaei_event_location || '',
        eaei_event_severity: initialData.eaei_event_severity as any,
        eaei_event_outcome: initialData.eaei_event_outcome || '',
        eaei_reporter_name: initialData.eaei_reporter_name || '',
        eaei_reporter_title: initialData.eaei_reporter_title || '',
        eaei_reporter_contact: initialData.eaei_reporter_contact || '',
        eaei_device_name: initialData.eaei_device_name || '',
        eaei_device_model: initialData.eaei_device_model || '',
        eaei_device_serial: initialData.eaei_device_serial || '',
        eaei_device_lot: initialData.eaei_device_lot || '',
        eaei_medication_name: initialData.eaei_medication_name || '',
        eaei_medication_dose: initialData.eaei_medication_dose || '',
        eaei_medication_route: initialData.eaei_medication_route || '',
        eaei_medication_frequency: initialData.eaei_medication_frequency || '',
        eaei_concomitant_meds: initialData.eaei_concomitant_meds || '',
        eaei_medical_history: initialData.eaei_medical_history || '',
        eaei_lab_values: initialData.eaei_lab_values || '',
        eaei_actions_taken: initialData.eaei_actions_taken || '',
        eaei_followup_required: initialData.eaei_followup_required as any,
        eaei_report_to_fda: initialData.eaei_report_to_fda as any,
        eaei_report_to_manufacturer: initialData.eaei_report_to_manufacturer as any,
        eaei_status: (initialData.eaei_status as any) || 'Draft',
        eaei_assigned_to: initialData.eaei_assigned_to || '',
        eaei_priority: (initialData.eaei_priority as any) || 'Medium',
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
                      name="eaei_patient_fname"
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
                      name="eaei_patient_lname"
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
                      name="eaei_patient_mname"
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
                      name="eaei_patient_gender"
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
                      name="eaei_patient_medical_record_no"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>{t('adverseEvents.medicalRecordNo')}</FormLabel>
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
                      name="eaei_event_description"
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
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="eaei_event_date"
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
                        name="eaei_event_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.eventTime')}</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
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
                            <FormLabel>{t('adverseEvents.eventLocation')}</FormLabel>
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
                        name="eaei_event_severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.severity')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('adverseEvents.selectSeverity')} />
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
                      <FormField
                        control={form.control}
                        name="eaei_event_outcome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.outcome')}</FormLabel>
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

              <TabsContent value="medical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('adverseEvents.medicalInformation')}</CardTitle>
                    <CardDescription>{t('adverseEvents.medicalInfoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                        name="eaei_medication_dose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.dose')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                        name="eaei_priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('adverseEvents.priority')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
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
