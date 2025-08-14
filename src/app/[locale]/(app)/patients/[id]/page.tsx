import { dummyPatients, dummyAppointments } from "@/lib/dummy-data";
import { notFound } from "next/navigation";
import { parseISO } from "date-fns"; 
import type { Locale } from '@/types'; 
import { PatientDetailContent } from '@/components/patients/patient-detail-content';

// Helper function to calculate age
function differenceInYears(dateLeft: Date, dateRight: Date): number {
    let years = dateLeft.getFullYear() - dateRight.getFullYear();
    const monthDiff = dateLeft.getMonth() - dateRight.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && dateLeft.getDate() < dateRight.getDate())) {
        years--;
    }
    return years;
}

export default async function PatientDetailPage({
    params,
}: {
    params: Promise<{ id: string; locale: Locale }>;
}) {
    const { id /* , locale */ } = await params; // await لأن params الآن Promise, وlocale غير مستخدم حاليًا

    const patient = dummyPatients.find((p) => p.id === id);

    if (!patient) {
        notFound();
    }

    const age = differenceInYears(new Date(), parseISO(patient.dateOfBirth));

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
