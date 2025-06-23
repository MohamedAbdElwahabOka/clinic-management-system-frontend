
import { PageHeader } from "@/components/page-header";
import { PatientTable } from "@/components/patients/patient-table";
import { Button } from "@/components/ui/button";
import { dummyPatients } from "@/lib/dummy-data";
import { PlusCircle } from "lucide-react";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { Trans } from "@/components/trans";
import type { Locale } from '@/types';

interface PatientsPageProps {
  params: { locale: Locale };
}

export default async function PatientsPage({ params }: PatientsPageProps) {
  const patients = dummyPatients;

  return (
    <div className="p-5">
      <PageHeader 
        titleKey="patientRecords" 
        descriptionKey="patientRecordsDescription"
        translation="Patient"
      >
        <Button asChild>
          <Link href="/patients/new">
            <PlusCircle className="mr-2 h-4 w-4" /> <Trans k="addNewPatient" />
          </Link>
        </Button>
      </PageHeader>
      <PatientTable patients={patients} />
    </div>
  );
}
