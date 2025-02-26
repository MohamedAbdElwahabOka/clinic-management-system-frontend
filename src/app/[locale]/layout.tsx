import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import LocalSwitcher from '@/components/local-switcher';
import "./globals.css";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

   // Determine the direction of the document
   const dir = locale === 'ar' ? 'rtl' : 'ltr';

  console.log("messages   "+locale);

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LocalSwitcher/>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { routing } from '@/i18n/routing';
// import LocalSwitcher from '@/components/local-switcher';
// import "./globals.css";

// export default async function LocaleLayout({
//   children,
//   params
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;

//   // Ensure that the incoming `locale` is valid
//   if (!routing.locales.includes(locale as any)) {
//     notFound();
//   }

//   // Providing all messages to the client
//   // side is the easiest way to get started
//   const messages = await getMessages();

//   // Determine the direction of the document
//   const dir = locale === 'ar' ? 'rtl' : 'ltr';
//   const langClass = locale === 'ar' ? 'rtl' : 'ltr';

//   console.log("messages   " + locale);

//   return (
//     <html lang={locale} dir={dir} className={langClass}>
//       <body>
//         <NextIntlClientProvider messages={messages}>
//           <LocalSwitcher />
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }



