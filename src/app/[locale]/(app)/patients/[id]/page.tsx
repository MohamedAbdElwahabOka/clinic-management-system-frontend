import { dummyPatients, dummyAppointments } from "@/lib/dummy-data";
import { notFound } from "next/navigation";
import { parseISO } from "date-fns"; // Removed format as it's handled client-side
import type { Locale } from '@/types';
// Removed getTranslations as it's no longer needed here for passing translateFn
import { PatientDetailContent } from '@/components/patients/patient-detail-content';

interface PatientDetailPageProps {
    params: { id: string; locale: Locale };
}

// Helper function to calculate age (can be moved to utils if needed elsewhere)
function differenceInYears(dateLeft: Date, dateRight: Date): number {
    let years = dateLeft.getFullYear() - dateRight.getFullYear();
    const monthDiff = dateLeft.getMonth() - dateRight.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && dateLeft.getDate() < dateRight.getDate())) {
        years--;
    }
    return years;
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
    const { id } = await params;
    const patient = dummyPatients.find((p) => p.id === id);

    if (!patient) {
        notFound();
    }

    const age = differenceInYears(new Date(), parseISO(patient.dateOfBirth));

    // Fetch patient-specific appointments. This data will be passed to the client component.
    const patientAppointments = dummyAppointments.filter(app => app.patientId === patient.id);

    return (
        <div className="p-5">
            <PatientDetailContent
                patient={patient}
                age={age}
                patientAppointments={patientAppointments}
            />
        </div>
    );
}
