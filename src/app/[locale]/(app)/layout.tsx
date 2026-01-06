import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/header"; // الهيدر ده جواه زرار الموبايل والبحث وكل حاجة
import Sidebar from "@/components/Sidebar";
// لاحظ: شيلنا MobileNav من هنا لأننا خلاص حطيناه جوه الـ Header في الخطوة اللي فاتت
import "../../globals.css";

export default async function LocaleLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "ar" | "de" }>;
}) {
  const { locale } = await paramsPromise;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <NextIntlClientProvider messages={messages}>
        {/* 1. Desktop Sidebar 
            - hidden md:block: يختفي في الموبايل ويظهر في الشاشات الأكبر
            - z-30: عشان يظهر تحت الـ Modal بتاع الموبايل لو فتح
        */}
        <aside className=" hidden md:block h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-30 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* 2. Main Content Wrapper 
            - ده الكونتينر اللي شايل الهيدر والمحتوى
        */}
        <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
          {/* Header 
             - شيلنا الـ div اللي كان بيعمل mobile header لوحده
             - الهيدر ده دلوقتي ذكي (Responsive) وهيظهر كل حاجة صح
          */}
          <Header />

          {/* Main Content Area 
             - flex-1: ياخد باقي المساحة
             - overflow-auto: ده اللي بيعمل سكرول للمحتوى لما يطول
          */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scroll-smooth w-full relative">
            {children}
          </main>
        </div>
      </NextIntlClientProvider>
    </div>
  );
}

// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { routing } from '@/i18n/routing';
// import Header from '@/components/header';
// import Sidebar from '@/components/Sidebar';
// import MobileNav from '@/components/layout/mobile-nav';
// import "../../globals.css";

// export default async function LocaleLayout({
//   children,
//   params: paramsPromise
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: "en" | "ar" | "de" }>;
// }) {
//   const { locale } = await paramsPromise;

//   if (!routing.locales.includes(locale)) {
//     notFound();
//   }

//   const messages = await getMessages({ locale });

//   return (
//     <div className="flex h-screen overflow-hidden bg-background">
//       <NextIntlClientProvider messages={messages}>

//         {/* Desktop Sidebar: Hidden on mobile, visible on md+ */}
//         <div className="hidden md:block h-full border-r bg-card">
//            <Sidebar />
//         </div>

//         <div className="flex flex-col flex-1 overflow-hidden min-w-0">
//           {/* Mobile Header: Visible only on small screens */}
//           <div className="flex items-center justify-between p-4 border-b md:hidden bg-card">
//              <div className="flex items-center gap-2">
//                 <MobileNav />
//                 <span className="font-bold text-lg">Clinica</span>
//              </div>
//           </div>

//           {/* Desktop Header: Hidden on mobile if you want, or keep visible.
//               Usually Header contains UserProfile which we want on Desktop. */}
//           <div className="hidden md:block">
//             <Header />
//           </div>

//           {/* Main Content Area */}
//           <main className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth w-full">
//             {children}
//           </main>
//         </div>
//       </NextIntlClientProvider>
//     </div>
//   );
// }

// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { routing } from '@/i18n/routing';
// import Header from '@/components/header';
// import Sidebar from '@/components/Sidebar';
// import "../../globals.css";

// // export default async function LocaleLayout({
// //   children,
// //   params
// // }: {
// //   children: React.ReactNode;
// //   params: { locale: "en" | "ar" | "de" }; // Explicitly type the locale
// // }) {
// //   const { locale } = params;
// export default async function LocaleLayout({
//   children,
//   params: paramsPromise
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: "en" | "ar" | "de" }>;
// }) {
//   const { locale } = await paramsPromise;

//   // Ensure that the incoming `locale` is valid
//   if (!routing.locales.includes(locale)) {
//     notFound();
//   }

//   // Providing all messages to the client
//   // side is the easiest way to get started
//   const messages = await getMessages({ locale });

//   // Determine the direction of the document
//   // const dir = locale === 'ar' ? 'rtl' : 'ltr';

//   return (
//     // <html lang={locale} dir={dir}>
//     <div  className="flex h-screen overflow-hidden">
//       {/* <body className="flex h-screen overflow-hidden"> */}

//         <NextIntlClientProvider messages={messages}>
//           <Sidebar />
//           <div className="flex flex-col flex-1">
//             <Header />
//             <main className="flex-1 overflow-auto">
//               {children}
//             </main>
//           </div>
//         </NextIntlClientProvider>
//       {/* </body> */}
//     </div>
//   // </html>
//   );
// }
