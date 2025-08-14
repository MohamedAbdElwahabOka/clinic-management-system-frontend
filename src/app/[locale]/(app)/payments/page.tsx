import * as React from "react";
import type { Locale } from "@/types";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { /* locale */ } = await params;
  
  return (
    <div className="p-5">
      <h1>Payments</h1>
    </div>
  );
}
