
import { PageHeader } from "@/components/page-header";
import { PatientForm } from "@/components/patients/patient-form";
import { dummyPatients } from "@/lib/dummy-data";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { Button } from "@/components/ui/button";
import { Trans } from "@/components/trans";
import type { Locale } from '@/types';

interface EditPatientPageProps {
  params: { id: string; locale: Locale };
}

export default async function EditPatientPage({ params }: EditPatientPageProps) {
  const patient = dummyPatients.find((p) => p.id === params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="p-5">
      <PageHeader 
        titleKey="editPatientPageTitle"
        title="Edit Patient: {{name}}"
        descriptionKey="editPatientPageDescription"
        descriptionValues={{ name: patient.name }}
      >
        <Button variant="outline" asChild>
          {/* The Link component from next-intl handles locale automatically */}
          <Link href={`/patients/${patient.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Trans k="backToPatientDetails" />
          </Link>
        </Button>
      </PageHeader>
      <PatientForm patient={patient} />
    </div>
  );
}
