"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { arSA } from 'date-fns/locale/ar-SA';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/navigation"; // Use next-intl's useRouter
import type { Patient } from "@/types";
import { useTranslations, useLocale } from 'next-intl';

interface PatientFormProps {
  patient?: Patient; 
}

export function PatientForm({ patient }: PatientFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations('Patient');
  const locale = useLocale();

  const genderOptions = [
    { value: "Male", labelKey: "genderMale" },
    { value: "Female", labelKey: "genderFemale" },
    { value: "Other", labelKey: "genderOther" },
  ];

  const getPatientFormSchema = () => z.object({
    name: z.string().min(2, t('errorFullNameMin')),
    dateOfBirth: z.date({ required_error: t('requiredField', { field: t('dateOfBirth') }) }),
    gender: z.enum(["Male", "Female", "Other"], { required_error: t('requiredField', { field: t('gender') }) }),
    contactPhone: z.string().min(10, t('errorPhoneMin')).regex(/^\S+$/, t('errorPhoneNoSpaces')),
    contactEmail: z.string().email(t('errorEmailInvalid')),
    address: z.string().min(5, t('errorAddressMin')),
    allergies: z.string().optional(),
    conditions: z.string().optional(),
    medications: z.string().optional(),
  });
  
  type PatientFormValues = z.infer<ReturnType<typeof getPatientFormSchema>>;


  const defaultValues: Partial<PatientFormValues> = patient
    ? {
        name: patient.name,
        dateOfBirth: new Date(patient.dateOfBirth),
        gender: patient.gender,
        contactPhone: patient.contactPhone,
        contactEmail: patient.contactEmail,
        address: patient.address,
        allergies: patient.personalInfo?.allergies?.join(", "),
        conditions: patient.personalInfo?.chronicConditions?.join(", "),
        medications: patient.generalMedicine?.medications?.join(", "),
      }
    : {
      gender: undefined
    };

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(getPatientFormSchema()),
    defaultValues,
  });
  
  React.useEffect(() => {
    form.reset(undefined, { keepValues: false }); 
  }, [locale, form]);


  async function onSubmit(data: PatientFormValues) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: patient ? t('patientUpdatedToast') : t('patientCreatedToast'),
      description: t(patient ? 'patientRecordUpdateSuccess' : 'patientRecordCreateSuccess', { name: data.name }),
    });

    router.push(patient ? `/patients/${patient.id}` : '/patients');
    router.refresh(); 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('patientFormPersonal')}</CardTitle>
              <CardDescription>{t('patientFormPersonalDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fullName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('fullNamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('dateOfBirth')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: locale === 'ar' ? arSA : undefined })
                              ) : (
                                <span>{t('pickDate')}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                            locale={locale === 'ar' ? arSA : undefined}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('gender')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectGender')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('addressPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('patientFormContact')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contactPhone')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t('phoneNumberPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contactEmail')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('emailPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('patientFormMedical')}</CardTitle>
            <CardDescription>{t('patientFormMedicalDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('allergies')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('allergiesPlaceholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('allergiesDesc')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('conditions')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('conditionsPlaceholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('conditionsDesc')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('medications')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('medicationsPlaceholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('medicationsDesc')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? (patient ? t('updating') : t('creatingAccount')) : (patient ? t('updatePatientButton') : t('createPatientButton'))}
          </Button>
        </div>
      </form>
    </Form>
  );
}
