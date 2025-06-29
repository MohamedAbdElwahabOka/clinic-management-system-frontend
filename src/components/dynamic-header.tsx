// --- Client component for dynamic header ---
"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { LandingHeader } from '@/components/landing/landing-header';
// import { Sidebar } from '@/components/Sidebar'; // Uncomment if needed

export default function DynamicHeader() {
  const pathname = usePathname();
  // You can adjust this logic for your app's needs
  // Show LandingHeader only for root and landing pages
  const localeMatch = pathname?.match(/^\/(en|ar)(\/)?$/);
  if (localeMatch) {
    return <LandingHeader />;
  }
  // else if (pathname?.startsWith('/[locale]/app')) {
  //   return <Sidebar />;
  // }
  return null;
}