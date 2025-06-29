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
// Button is not used directly here, PatientTableActions uses it
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
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
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right ltr:text-left">{t('patientID')}</TableHead>
              <TableHead className="text-right ltr:text-left">{t('name')}</TableHead>
              <TableHead className="text-right ltr:text-left">{t('dateOfBirth')}</TableHead>
              <TableHead className="text-right ltr:text-left">{t('gender')}</TableHead>
              <TableHead className="text-right ltr:text-left">{t('contactPhone')}</TableHead>
              <TableHead className="text-right ltr:text-left">{t('lastVisit')}</TableHead>
              <TableHead className="text-right rtl:text-left">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{format(parseISO(patient.dateOfBirth), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined })}</TableCell>
                  <TableCell>{t(patient.gender.toLowerCase())}</TableCell>
                  <TableCell>{patient.contactPhone}</TableCell>
                  <TableCell>{patient.lastVisit ? format(parseISO(patient.lastVisit), 'MM/dd/yyyy', { locale: locale === 'ar' ? arSA : undefined }) : t('no')}</TableCell>
                  <TableCell className="text-right rtl:text-left">
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
  );
}
