"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PatientTableActions } from "./patient-table-actions";
import type { Patient } from "@/types";
import { format, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale/ar-SA';
import { ListFilter, Search } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients: initialPatients }: PatientTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [patients, setPatients] = React.useState<Patient[]>(initialPatients);
  const t = useTranslations('Patient');
  const locale = useLocale();

  React.useEffect(() => {
    setPatients(initialPatients);
  }, [initialPatients]);

  const translate = React.useCallback(
      (key: string, defaultValue?: string) => {
        const translation = t(key);
        return translation === key && defaultValue ? defaultValue : translation;
      },
      [t]
    );
  

  const filteredPatients = React.useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.contactEmail && patient.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (patient.contactPhone && patient.contactPhone.includes(searchTerm))
    );
  }, [searchTerm, patients]);

  return (
    // <div className="space-y-4 w-full px-2 sm:px-4 md:px-0">
    //   {/* Search Bar */}
    //   <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    //     <div className="relative w-full md:max-w-sm">
    //       <Search className="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    //       <Input
    //         type="search"
    //         placeholder={t('searchPatients')}
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //         className="pl-8 rtl:pr-8 w-full"
    //       />
    //     </div>
    //   </div>

    //   {/* Table Container with Responsive Overflow */}
    //   <div className="rounded-md border shadow-sm bg-card overflow-hidden">
    //     <div className="overflow-x-auto w-full">
    //        {/* overflow-x-auto w-full w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full */}
    //       {/* 
    //         min-w-[1000px] on desktop, min-w-[800px] on mobile
    //         This ensures the table maintains structure but scrolls horizontally on small screens
    //       */}
    //       <Table className="min-w-[600px]">
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('patientID')}</TableHead>
    //             <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('name')}</TableHead>
    //             <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('dateOfBirth')}</TableHead>
    //             <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('gender')}</TableHead>
    //             <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('contactPhone')}</TableHead>
    //             <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('lastVisit')}</TableHead>
    //             <TableHead className="text-right rtl:text-left whitespace-nowrap px-2 sm:px-4">{t('actions')}</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {filteredPatients.length > 0 ? (
    //             filteredPatients.map((patient) => (
    //               <TableRow key={patient.id}>
    //                 <TableCell className="font-medium whitespace-nowrap px-2 sm:px-4">{patient.id}</TableCell>
    //                 <TableCell className="whitespace-nowrap px-2 sm:px-4">{patient.name}</TableCell>
    //                 <TableCell className="whitespace-nowrap px-2 sm:px-4">{format(parseISO(patient.dateOfBirth), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined })}</TableCell>
    //                 <TableCell className="whitespace-nowrap px-2 sm:px-4">{t(patient.gender.toLowerCase())}</TableCell>
    //                 <TableCell className="whitespace-nowrap dir-ltr text-right rtl:text-left px-2 sm:px-4">{patient.contactPhone}</TableCell>
    //                 <TableCell className="whitespace-nowrap px-2 sm:px-4">{patient.lastVisit ? format(parseISO(patient.lastVisit), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined }) : t('no')}</TableCell>
    //                 <TableCell className="text-right rtl:text-left whitespace-nowrap px-2 sm:px-4">
    //                   <PatientTableActions patient={patient} />
    //                 </TableCell>
    //               </TableRow>
    //             ))
    //           ) : (
    //             <TableRow>
    //               <TableCell colSpan={7} className="h-24 text-center">
    //                 {t('noPatientsFound')}
    //               </TableCell>
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </div>
    //   </div>
    // </div>
    <div className="grid grid-cols-1 gap-4 w-full sm:px-4 md:px-0">

   
    <Card className="shadow-lg w-full overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">      
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={translate("searchPatients", "searchPatients")} className="pl-8 rtl:pr-8 w-full" />
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ListFilter className="mr-2 h-4 w-4" />
                    {translate("filterButton", "Filter")}
                  </Button>
                
          </div>
        
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto w-full">
          <Table>
          {/* <Table className="min-w-[600px]"> */}
            <TableHeader>
              <TableRow>
                <TableHead className="text-right ltr:text-left">{translate('patientID', 'Patient ID')}</TableHead>
                <TableHead className="text-right ltr:text-left">{translate('name', 'Name')}</TableHead>
                <TableHead className="text-right ltr:text-left">{translate('dateOfBirth', 'Date of Birth')}</TableHead>
                <TableHead className="text-right ltr:text-left">{translate('gender', 'Gender')}</TableHead>        
                <TableHead className="text-right ltr:text-left">{translate('contactPhone', 'Contact Phone')}</TableHead>
                <TableHead className="text-right ltr:text-left">{translate('lastVisit', 'Last Visit')}</TableHead>
                <TableHead className="text-right ltr:text-left">{translate('actions', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{patient.name}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{format(parseISO(patient.dateOfBirth), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined })}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{translate(patient.gender.toLowerCase(), patient.gender)}</TableCell>
                    <TableCell className="whitespace-nowrap dir-ltr text-right rtl:text-left px-2 sm:px-4">{patient.contactPhone}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{patient.lastVisit ? format(parseISO(patient.lastVisit), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined }) : translate('no', 'No')}</TableCell>
                    <TableCell className="text-right rtl:text-left whitespace-nowrap px-2 sm:px-4">
                      <PatientTableActions patient={patient} />     
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">

                    {translate('noPatientsFound', 'No patients found')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>

      </CardContent>
      
    </Card>
     </div>


  );
}