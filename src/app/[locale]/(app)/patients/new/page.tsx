
import { PageHeader } from "@/components/page-header";
import { PatientForm } from "@/components/patients/patient-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { Button } from "@/components/ui/button";
import { Trans } from "@/components/trans";
import type { Locale } from '@/types';

interface NewPatientPageProps {
  params: { locale: Locale };
}

export default function NewPatientPage({ params }: NewPatientPageProps) {
  return (
    <div className="p-5">
      <PageHeader 
        titleKey="newPatientPageTitle" 
        descriptionKey="newPatientPageDescription"
      >
        <Button variant="outline" asChild>
          <Link href="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Trans k="backToList" />
          </Link>
        </Button>
      </PageHeader>
      <PatientForm />
    </div>
  );
}
