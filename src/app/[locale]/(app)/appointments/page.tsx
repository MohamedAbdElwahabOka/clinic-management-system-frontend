


import type { Locale } from "@/types";
import Appointments from "./Appointments";

// في التحديث الجديد params لازم يكون Promise
export default async function DashboardPage({
  // params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // const { locale } = await params; // await لأن params Promise
  // return <Appointments locale={locale} />;
  return <Appointments />;
}




