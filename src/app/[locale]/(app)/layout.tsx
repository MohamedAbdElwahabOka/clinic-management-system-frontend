import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/header';
import Sidebar from '@/components/Sidebar';
import "../../globals.css";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: "en" | "ar" }; // Explicitly type the locale
}) {
  const { locale } = params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Determine the direction of the document
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
    {/* <div lang={locale} dir={dir} className="flex h-screen overflow-hidden"> */}
      <body className="flex h-screen overflow-hidden">

        <NextIntlClientProvider messages={messages}>
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    {/* </div> */}
  </html>
  );
}