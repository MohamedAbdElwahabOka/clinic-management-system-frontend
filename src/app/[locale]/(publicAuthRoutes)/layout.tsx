import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../../globals.css';
import { HeartPulse } from 'lucide-react';

export default async function AuthLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "ar" }>;
}) {
  const params = await paramsPromise;
  const locale = params.locale;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    // <html lang={locale} dir={direction}>
    <body className="min-h-screen p-4 bg-background flex items-center justify-center">
      <div dir={direction} lang={locale} className="min-h-screen p-4 bg-background flex items-center justify-center">

        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="w-full max-w-7xl lg:grid lg:grid-cols-2 shadow-xl rounded-lg overflow-hidden">
            {/* Form Section */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10">
              {children}
            </div>
            {/* Branding Panel - Hidden on small screens, visible on lg and up */}
            <div className={`hidden lg:flex flex-col items-center justify-center bg-primary text-primary-foreground p-12 ${direction === 'rtl' ? 'lg:order-first' : ''}`}>
              <div className="flex flex-col items-center text-center">
                <HeartPulse className="h-24 w-24 mb-6" />
                {/* <img src="/logo/logo.svg" alt="Logo" className="h-20 w- bg-white text-white" /> */}
                <h1 className="text-5xl font-bold">
                  Clinica
                </h1>
                {/* You can add more branding or translated text here if needed */}
              </div>
            </div>
          </div>
        </NextIntlClientProvider>
      </div>
    </body>
    // </html>
  );
}
