import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import "../globals.css";
// import { LandingHeader } from '@/components/landing/landing-header';
import DynamicHeader from '@/components/dynamic-header'; // Import the dynamic header component
import { ThemeProvider } from '@/components/theme-provider';
// Remove server headers import, use client component for header switching

// export default async function LocaleLayout({
//   children,
//   params: paramsPromise
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: "en" | "ar" | "de" }>;
// }) {
//   const params = await paramsPromise;
//   const { locale } = params;
export default async function LocaleLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "ar" | "de" }>;
}) {
  const { locale } = await paramsPromise;


  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });


  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/logo/logo.svg" />
        <title>Clinica</title>
      </head>
      <body className="flex h-screen overflow-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col flex-1">
              <DynamicHeader />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
