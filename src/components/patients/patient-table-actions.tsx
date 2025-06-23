"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { useToast } from "@/hooks/use-toast"; 
import type { Patient } from "@/types";
import { useTranslations } from 'next-intl';

interface PatientTableActionsProps {
  patient: Patient;
}

export function PatientTableActions({ patient }: PatientTableActionsProps) {
  const { toast } = useToast();
  const t = useTranslations('Patient');

  const handleDelete = async () => {
    console.log("Deleting patient:", patient.id);
    toast({
      title: t('patientDeletedToast'),
      description: t('patientDeletedDesc', { name: patient.name }),
    });
    // router.refresh(); // Consider if refresh is needed or how it interacts with next-intl
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t('actions')}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/patients/${patient.id}`} className="flex items-center w-full">
              <Eye className="mr-2 h-4 w-4" />
              {t('viewDetails')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/patients/${patient.id}/edit`} className="flex items-center w-full">
              <Edit3 className="mr-2 h-4 w-4" />
              {t('editPatientButton')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full" >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('delete')}
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmDeletePatientTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmDeletePatientDesc', { name: patient.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
