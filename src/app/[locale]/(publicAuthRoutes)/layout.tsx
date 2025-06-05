
"use client";

import * as React from 'react';
import { Link } from '@/i18n/navigation';
import { HeartPulse } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { Locale } from '@/types';

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>; // Changed to Promise
}

export default function AuthLayout({
  children,
  params: paramsPromise // Renamed to paramsPromise for clarity
}: AuthLayoutProps) {
  const { translate, direction } = useLanguage();
  const params = React.use(paramsPromise); // Resolve the params promise

  React.useEffect(() => {
    document.title = translate('authTitle', 'Clinica - Authentication');
  }, [translate, params.locale]); // Use resolved params.locale

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-4xl lg:grid lg:grid-cols-2 shadow-xl rounded-lg overflow-hidden">
        {/* Form Section */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-10">
          {children}
        </div>

        {/* Branding Panel - Hidden on small screens, visible on lg and up */}
        <div className={`hidden lg:flex flex-col items-center justify-center bg-primary text-primary-foreground p-12 ${direction === 'rtl' ? 'lg:order-first' : ''}`}>
          <div className="flex flex-col items-center text-center">
            <HeartPulse className="h-24 w-24 mb-6" />
            <h1 className="text-5xl font-bold">
              {translate('clinicaName', 'Clinica')}
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              {translate('authSmartManagementCare', 'Smart management, exceptional care.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
