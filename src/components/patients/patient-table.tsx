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
import { Search } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';

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
    <div className="space-y-4 w-full px-2 sm:px-4 md:px-0">
      {/* Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchPatients')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 rtl:pr-8 w-full"
          />
        </div>
      </div>

      {/* Table Container with Responsive Overflow */}
      <div className="rounded-md border shadow-sm bg-card overflow-hidden">
        <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* 
            min-w-[1000px] on desktop, min-w-[800px] on mobile
            This ensures the table maintains structure but scrolls horizontally on small screens
          */}
          <Table className="min-w-[800px] lg:min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('patientID')}</TableHead>
                <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('name')}</TableHead>
                <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('dateOfBirth')}</TableHead>
                <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('gender')}</TableHead>
                <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('contactPhone')}</TableHead>
                <TableHead className="text-right ltr:text-left whitespace-nowrap px-2 sm:px-4">{t('lastVisit')}</TableHead>
                <TableHead className="text-right rtl:text-left whitespace-nowrap px-2 sm:px-4">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium whitespace-nowrap px-2 sm:px-4">{patient.id}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{patient.name}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{format(parseISO(patient.dateOfBirth), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined })}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{t(patient.gender.toLowerCase())}</TableCell>
                    <TableCell className="whitespace-nowrap dir-ltr text-right rtl:text-left px-2 sm:px-4">{patient.contactPhone}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 sm:px-4">{patient.lastVisit ? format(parseISO(patient.lastVisit), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined }) : t('no')}</TableCell>
                    <TableCell className="text-right rtl:text-left whitespace-nowrap px-2 sm:px-4">
                      <PatientTableActions patient={patient} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {t('noPatientsFound')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}