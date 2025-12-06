import { PageHeader } from "@/components/page-header";
import { PatientTable } from "@/components/patients/patient-table";
import { Button } from "@/components/ui/button";
import { dummyPatients } from "@/lib/dummy-data";
import { PlusCircle } from "lucide-react";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { Trans } from "@/components/trans";
import type { Locale } from '@/types';

export default async function PatientsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>; // params الآن Promise
}) {
  const { /* locale */ } = await params; // await لاستخراج params، locale غير مستخدم

  const patients = dummyPatients;

  return (
    // Responsive Layout:
    // 1. flex-col & space-y-6: Ensures header and table stack neatly with gap.
    // 2. p-4 md:p-8: Reduced padding on mobile, original spacious padding on desktop.
    <div className="flex flex-col space-y-6 p-1 md:p-8 w-full max-w-full">
      <PageHeader
        titleKey="patientRecords"
        descriptionKey="patientRecordsDescription"
        translation="Patient"
      >
        <Button asChild className="w-full md:w-auto">
          <Link href="/patients/new">
            <PlusCircle className="mr-2 h-4 w-4" /> <Trans k="addNewPatient" />
          </Link>
        </Button>
      </PageHeader>

      {/* CRITICAL OVERFLOW HANDLING:
         The table is wrapped in a div with 'overflow-x-auto'.
         This allows the table to scroll horizontally on small screens
         instead of breaking the page layout or hiding behind the sidebar.
      */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <PatientTable patients={patients} />
        </div>
      </div>
    </div>
  );
}
// import { PageHeader } from "@/components/page-header";
// import { PatientTable } from "@/components/patients/patient-table";
// import { Button } from "@/components/ui/button";
// import { dummyPatients } from "@/lib/dummy-data";
// import { PlusCircle } from "lucide-react";
// import { Link } from "@/i18n/navigation"; // Use next-intl's Link
// import { Trans } from "@/components/trans";
// import type { Locale } from '@/types';

// interface PatientsPageProps {
//   params: { locale: Locale };
// }
// export default async function PatientsPage({ params }: PatientsPageProps) {
// // export default async function PatientsPage() {
//   const patients = dummyPatients;

//   return (
//     <div className="p-5">
//       <PageHeader 
//         titleKey="patientRecords" 
//         descriptionKey="patientRecordsDescription"
//         translation="Patient"
//       >
//         <Button asChild>
//           <Link href="/patients/new">
//             <PlusCircle className="mr-2 h-4 w-4" /> <Trans k="addNewPatient" />
//           </Link>
//         </Button>
//       </PageHeader>
//       <PatientTable patients={patients} />
//     </div>
//   );
// }
