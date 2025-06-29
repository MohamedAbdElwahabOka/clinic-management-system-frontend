"use client";

import * as React from 'react';
import type { Patient, Appointment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit3, ChevronRight, FileText, Plus, Search, ListFilter, Trash2, Info, ClipboardList, Microscope, FileArchive } from "lucide-react";
import { format, parseISO } from "date-fns";
import { arSA, enUS } from 'date-fns/locale'; // Import enUS for specific formatting
import { useTranslations, useLocale } from 'next-intl';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Dummy data for demonstration, matching screenshot structure
const dummyPatientHistoryData = (patientAppointments: Appointment[], t: ReturnType<typeof useTranslations>, locale: string) =>
  patientAppointments.slice(0, 4).map((app, index) => ({
    id: app.id,
    appointmentId: `#A_${app.id.substring(3) || "223081"}`,
    pastTreatment: t('diagnosesNotePlaceholder1'),
    date: format(parseISO(app.dateTime), "dd/MM/yyyy", { locale: locale === 'ar' ? arSA : enUS }),
    time: format(parseISO(app.dateTime), "h:mm a", { locale: locale === 'ar' ? arSA : enUS }), // e.g., 9:45 AM
    paymentStatus: index % 2 === 0 ? "Paid" : "Partially Paid" as "Paid" | "Partially Paid",
  }));

const dummyDiagnosesNotesData = (t: ReturnType<typeof useTranslations>) => [
  { id: "DN1", text: t('diagnosesNotePlaceholder1') },
  { id: "DN2", text: t('diagnosesNotePlaceholder2') },
  { id: "DN3", text: t('diagnosesNotePlaceholder3') },
  { id: "DN4", text: t('diagnosesNotePlaceholder1') },
  { id: "DN5", text: t('diagnosesNotePlaceholder2') },
];

const dummyRecordsHistoryData = (t: ReturnType<typeof useTranslations>, locale: string) => [
  { id: "RH1", name: t('recordFileName1'), date: format(new Date(2024, 1, 22), "dd MMM", { locale: locale === 'ar' ? arSA : enUS }), status: t('labTestStatusReady') },
  { id: "RH2", name: t('recordFileName2'), date: format(new Date(2024, 1, 3), "dd MMM", { locale: locale === 'ar' ? arSA : enUS }), status: null },
  { id: "RH3", name: t('recordFileName3'), date: format(new Date(2024, 0, 28), "dd MMM", { locale: locale === 'ar' ? arSA : enUS }), status: null },
];


interface PatientDetailContentProps {
  patient: Patient;
  age: number;
  patientAppointments: Appointment[];
}

export function PatientDetailContent({
  patient,
  age,
  patientAppointments
}: PatientDetailContentProps) {
  const t = useTranslations('Patient');
  const locale = useLocale();
  const { toast } = useToast();

  const patientHistory = React.useMemo(() => dummyPatientHistoryData(patientAppointments, t, locale), [patientAppointments, t, locale]);
  const diagnosesNotes = React.useMemo(() => dummyDiagnosesNotesData(t), [t]);
  const recordsHistory = React.useMemo(() => dummyRecordsHistoryData(t, locale), [t, locale]);

  // Map payment status to supported badge variants
  const getPaymentStatusVariant = (status: "Paid" | "Partially Paid"): "default" | "secondary" => {
    if (status === "Paid") return "default";
    if (status === "Partially Paid") return "secondary";
    return "default";
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs and Edit Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/patients" className="hover:text-primary">
            {t('patientsList')}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 rtl:rotate-180" />
          <span className="font-semibold text-foreground">{patient.name}</span>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/patients/${patient.id}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" />
            {t('editPatientInfo')}
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Panel: Patient Info & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info Cards: Stack on mobile and md, side-by-side on lg+ */}
          <div className="flex flex-col lg:flex-row gap-5">
            <Card className="w-full lg:w-1/3">
              <CardContent className="pt-6 w-full flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="https://placehold.co/128x128.png?text=AI" alt={patient.name} data-ai-hint="patient avatar" />
                  <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground mb-2">{patient.name}</h2>
                <div className="flex justify-around w-full text-sm text-muted-foreground">
                  <div>
                    <p className="text-xl font-bold text-foreground">3</p>
                    <p>{t('medicalRecordsCount')}</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">5</p>
                    <p>{t('pastVisitsCount')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full lg:w-2/3">
              <CardContent className="pt-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-muted-foreground">{t('ageLabel')}</p>
                    <p className="font-semibold text-foreground">{age}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('gender')}</p>
                    <p className="font-semibold text-foreground">{t(patient.gender.toLowerCase())}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">{t('telephoneNoLabel')}</p>
                    <p className="font-semibold text-foreground">{patient.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('cityLabel')}</p>
                    <p className="font-semibold text-foreground">{t('qenaCity')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('addressStreetLabel')}</p>
                    <p className="font-semibold text-foreground">{patient.address ? patient.address.split(',')[0] : t('elMahataStreet')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">{t('typeOfReservationLabel')}</p>
                    <p className="font-semibold text-foreground">{t('revisitLabel')}</p>
                  </div>
                </div>
                <div className='flex justify-end'>

                  <Button
                    className=" mt-4"
                    onClick={() => toast({ title: t('underDevelopment'), description: t('underDevelopmentMessage') })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> {t('addNewRecordButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* History Table: Full width */}
          <div className="w-full">
            <Card className="h-full w-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  <CardTitle>{t('patientHistoryTitle')}</CardTitle>
                </div>
                <CardDescription>{t('appointmentsPaymentsSubtitle')}</CardDescription>
                <div className="flex items-center gap-2 pt-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('searchHistoryPlaceholder')} className="pl-8 rtl:pr-8 h-9" disabled />
                  </div>
                  <Button variant="outline" className="h-9" disabled>
                    <ListFilter className="mr-2 h-4 w-4" /> {t('filterButton')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right ltr:text-left whitespace-nowrap">{t('appointmentIdCol')}</TableHead>
                      <TableHead className="text-right ltr:text-left whitespace-nowrap">{t('pastTreatmentCol')}</TableHead>
                      <TableHead className="text-right ltr:text-left whitespace-nowrap">{t('dateColumn')}</TableHead>
                      <TableHead className="text-right ltr:text-left whitespace-nowrap">{t('timeColumn')}</TableHead>
                      <TableHead className="text-right ltr:text-left whitespace-nowrap">{t('paymentStatusCol')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.appointmentId}</TableCell>
                        <TableCell>{item.pastTreatment}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>
                          <Badge variant={getPaymentStatusVariant(item.paymentStatus)} className="font-normal">
                            {item.paymentStatus === "Paid" ? t('paymentStatusPaid') : t('paymentStatusPartiallyPaid')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Right/Side Panel: Diagnoses & Records */}
        <div className="lg:col-span-1 flex flex-col gap-4 justify-between">
          <Card className=''>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">{t('diagnosesNotesTitle')}</CardTitle>
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs" disabled>{t('viewAllLink')}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm pt-0">
              <ul className="space-y-1 text-muted-foreground max-h-[150px] overflow-y-auto pr-2">
                {diagnosesNotes.map(note => (
                  <li key={note.id} className="text-xs leading-relaxed list-disc list-inside ml-1 rtl:mr-1 rtl:ml-0">{note.text.startsWith('• ') ? note.text.substring(2) : note.text}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground pt-2">{format(new Date(2023, 10, 24), "dd MMM yyyy", { locale: locale === 'ar' ? arSA : enUS })}</p>
              <div className='flex justify-end'>

                <Button
                  className=" mt-2"
                  onClick={() => toast({ title: t('underDevelopment'), description: t('underDevelopmentMessage') })}
                >
                  <Plus className="mr-2 h-4 w-4" /> {t('addNoteButton')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className='h-full'>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileArchive className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">{t('recordsHistoryTitle')}</CardTitle>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => toast({ title: t('underDevelopment'), description: t('underDevelopmentMessage') })}
                >
                  <Plus className="mr-1 h-3 w-3" />{t('requestLabTestButton')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 max-h-full overflow-y-auto">
              {recordsHistory.map(record => (
                <div key={record.id} className={cn("flex items-center justify-between p-2.5 border rounded-md hover:bg-muted/50", record.status === t('labTestStatusReady') && "border-green-500 border-l-4 rtl:border-r-4 rtl:border-l-0")}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{record.name}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {record.status && (
                      <Badge variant={record.status === t('labTestStatusReady') ? 'default' : 'secondary'} className="text-xs px-1.5 py-0.5 font-normal">
                        {record.status}
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" disabled>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" disabled>
                      <Info className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

