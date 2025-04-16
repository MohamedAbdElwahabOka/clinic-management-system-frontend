import OfficialHeader from '@/components/official/officialHeader';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react'


export default async function OfficialLayout({children, params }:{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
  // const t = useTranslations('Dashboard');
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
  
  return (
   <html lang={locale} dir={dir}>
         <body className="flex h-screen overflow-hidden">
           <NextIntlClientProvider messages={messages}>
             {/* <Sidebar /> */}
             <div className="flex flex-col flex-1">
               <OfficialHeader />
               <main className="flex-1 overflow-auto">
                 {children}
               </main>
             </div>
           </NextIntlClientProvider>
         </body>
       </html>
  )
}
