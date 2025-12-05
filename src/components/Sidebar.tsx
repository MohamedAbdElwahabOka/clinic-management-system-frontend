'use client';

import { useState, useEffect } from 'react';
import { Bell, ChevronLeft, ChevronRight, LayoutDashboard, Users, Calendar, FileText, DollarSign, Settings, HelpCircle, Hospital } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onMobileClose?: () => void;
}

export default function Sidebar({ onMobileClose }: SidebarProps) {
  const t = useTranslations('Sidebar');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const pathname = usePathname();
  
  const menuItems = [
    { name: t('Dashboard'), icon: LayoutDashboard, link: '/dashboard' },
    { name: t('patients'), icon: Users, link: '/patients' },
    { name: t('appointments'), icon: Calendar, link: '/appointments', hasNotification: true },
    { name: t('Medical-Records'), icon: FileText, link: '/records' },
    { name: t('Financials'), icon: DollarSign, link: '/financials' },
    { name: t('Clinics'), icon: Hospital, link: '/clinics' }
  ];
  
  const menuItemstwo = [
    { name: t('Notifications'), icon: Bell, link: '/notifications', hasNotification: true },
    { name: t('Settings'), icon: Settings, link: '/settings' },
    { name: t('Support'), icon: HelpCircle, link: '/support' }
  ];
  
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setCollapsed(false); 
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <aside className={`h-full bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out z-50 ${collapsed ? 'w-16' : 'w-full md:w-60'}`}>
      
      {/* 1. Top Section 
         - ضفت relative هنا عشان الزرار العائم يعرف مكانه
      */}
      <div className="flex-shrink-0 relative">
        <div className={`flex items-center h-14 px-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <img src="/logo/logo.svg" alt="Logo" className="h-7 w-7 min-w-[28px]" />
              <h1 className="text-lg font-bold tracking-wide">Clinica</h1>
            </div>
          )}
          
          {collapsed && <img src="/logo/logo.svg" alt="Logo" className="h-7 w-7" />}

          {!onMobileClose && (
            <button 
                onClick={() => setCollapsed(!collapsed)} 
                className={`p-1 rounded-lg bg-gray-800 hover:bg-[#0582EB] transition-all duration-200 z-50
                ${collapsed 
                    ? `absolute top-10 shadow-lg border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center p-0 ${isRTL ? '-left-3' : '-right-3'}` 
                    : ''}`}
            >
                {collapsed ? (
                    isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                ) : (
                    isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
                )}
            </button>
          )}
        </div>
        <div className="h-[1px] bg-gray-700 mx-3 my-1 opacity-50" />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-2 space-y-4">
        <nav className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const isActive = pathname.includes(item.link);
            return (
              <Link 
                href={item.link} 
                key={item.name} 
                onClick={handleItemClick}
                className={`group flex items-center px-2 py-2 rounded-lg transition-all duration-200 mb-1
                  ${isActive ? 'bg-[#0582EB] text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.name : ''}
              >
                <div className="relative flex items-center justify-center">
                  <item.icon className={`transition-all ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  {item.hasNotification && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 border border-gray-900"></span>
                    </span>
                  )}
                </div>
                {!collapsed && <span className="mx-3 text-sm font-medium whitespace-nowrap overflow-hidden">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && <div className="h-[1px] bg-gray-700 mx-4 opacity-30" />}

        <nav className="space-y-0.5 px-2">
          {menuItemstwo.map((item) => {
            const isActive = pathname.includes(item.link);
            return (
              <Link 
                href={item.link} 
                key={item.name} 
                onClick={handleItemClick}
                className={`group flex items-center px-2 py-2 rounded-lg transition-all duration-200 mb-1
                  ${isActive ? 'bg-[#0582EB] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.name : ''}
              >
                <div className="relative">
                  <item.icon className={`transition-all ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                </div>
                {!collapsed && <span className="mx-3 text-sm font-medium whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 p-3 bg-gray-900 border-t border-gray-800 z-10">
        {!collapsed ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700 text-center mb-3 shadow-md">
                <div className="w-8 h-8 bg-[#0582EB]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <img src="/sidbar/sidbar.svg" alt="Upgrade" className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{t('Upgrade')}</h4>
                <button className="w-full mt-1 bg-[#0582EB] hover:bg-blue-600 text-white text-[10px] py-1.5 rounded-md transition-colors font-semibold">
                    {t('Upgrade')} Now
                </button>
            </div>
        ) : (
             <div className="flex justify-center mb-3">
                 <button className="p-1.5 bg-[#0582EB] rounded-lg shadow-lg">
                    <img src="/sidbar/sidbar.svg" alt="Upgrade" className="w-4 h-4 invert brightness-0" />
                 </button>
             </div>
        )}

      <Link href="/account" onClick={handleItemClick}>
          <div
            className={`flex items-center rounded-lg p-1.5 transition-colors hover:bg-gray-800 cursor-pointer ${collapsed ? 'justify-center' : 'space-x-2 rtl:space-x-reverse'}`}
          >
            <img src="/sidbar/avatar.svg" alt="User" className="w-8 h-8 rounded-full border border-[#0582EB]" />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] text-gray-400">{t('Welcome-back')}</span>
                <span className="text-xs font-bold text-white truncate">Nabil Deraz</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </aside>
  );
}








// 'use client';

// import { useState } from 'react';
// import { Bell, ChevronLeft, ChevronRight, LayoutDashboard, Users, Calendar, FileText, DollarSign, Settings, HelpCircle, Hospital } from 'lucide-react';
// import {Link} from '@/i18n/navigation';
// import { useTranslations } from 'next-intl';
// import { usePathname } from 'next/navigation';
// export default function Sidebar() {
//   const t = useTranslations('Sidebar');


//   const pathname = usePathname();

//   const parts = pathname.split("/"); 
//   const lastPart = parts.pop();
//   console.log(lastPart)



//   const menuItems = [
//     { name: t('Dashboard'), icon: LayoutDashboard, link: '/dashboard' },
//     { name: t('patients'), icon: Users, link: '/patients' },
//     { name: t('appointments'), icon: Calendar, link: '/appointments', hasNotification: true },
//     { name: t('Medical-Records'), icon: FileText, link: '/records' },
//     { name: t('Financials'), icon: DollarSign, link: '/financials' },
//     { name: t('Clinics'), icon: Hospital, link: '/clinics' }
//   ];
  
//   const menuItemstwo = [
//     { name: t('Notifications'), icon: Bell, link: '/notifications', hasNotification: true },
//     { name: t('Settings'), icon: Settings, link: '/settings' },
//     { name: t('Support'), icon: HelpCircle, link: '/support' }
//   ];
  
//   const [collapsed, setCollapsed] = useState(false);

//   // #A3A7AC

//   return (
//     <div className="h-full flex flex-col">
//       {/* Sidebar */}
//       <div className={`bg-gray-900 text-white p-3 flex flex-col justify-between transition-all duration-300 ${collapsed ? 'w-12' : 'w-52'}`}>
//         {/* Logo */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center">
//             <img src="/logo/logo.svg" alt="Logo" className="h-6 w-6" />
//             <h1 className={`ml-1 text-lg font-bold transition-all pr-4 pl-4 ${collapsed ? 'hidden' : 'block'}`}>TeleCare</h1>
//           </div>
//           <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md hover:bg-[#0582EB] bg-gray-700">
//             {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
//           </button>
//         </div>

//         <hr className="my-3 border-gray-700" />

//         {/* Menu Items */}
//         <nav className="space-y-3 pb-3">
//           {menuItems.map((item) => (
//             <Link href={item.link} key={item.name} className={`flex items-center space-x-3 p-1.5 rounded-md hover:bg-[#0582EB] ${ item.link == "/" + lastPart ? 'bg-[#0582EB]' : ''}`}>
//               <div className="relative">
//               <item.icon className={` transition-all ${collapsed ? 'w-5 h-5 text-center ' : 'w-4 h-4'}`} />
//               {item.hasNotification && (
//                   <span className="absolute bottom-0 right-2.3 bg-orange-500 w-2.5 h-2.5 rounded-full border border-black"></span>
//                 )}
//               </div>
//               {!collapsed && <span className="text-sm pr-2 ">{item.name}</span>}
//             </Link>
//           ))}
//         </nav>

//         <hr className="my-3 border-gray-700" />

//         {/* Second Set of Menu Items */}
//         <nav className="space-y-3 pt-3">
//           {menuItemstwo.map((item) => (
//             <Link href={item.link} key={item.name} className="flex items-center space-x-3 p-1.5 rounded-md hover:bg-[#0582EB]">
//               <div className="relative">
//                 <item.icon className={`  transition-all ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
//                 {item.hasNotification && (
//                   <span className="absolute bottom-0 right-2.3 bg-orange-500 w-2.5 h-2.5 rounded-full border border-black"></span>
//                 )}
//               </div>
//               {!collapsed && <span className="text-sm pr-2 ">{item.name}</span>}
//             </Link>
//           ))}
//         </nav>

//         {/* Bottom Section */}
//         <div className="mt-auto space-y-3">
//           <div className="p-3 rounded-lg text-center">
//             <img src="/sidbar/sidbar.svg" alt="Upgrade" className="mx-auto mb-1.5 w-16 h-16" />
//             {!collapsed && <button className="bg-[#0582EB] text-white py-1.5 px-3 rounded-lg w-full text-sm">{t('Upgrade')}</button>}
//           </div>
//           <hr className="my-3 border-gray-700" />
//           <div className="flex items-center space-x-1.5 p-1.5 rounded-md cursor-pointer">
//             <img src="/sidbar/avatar.svg" alt="User" className="w-8 h-8 rounded-full" />
//             {!collapsed && <span className="text-xs pr-2"> {t('Welcome-back')}👋<br></br> <strong>Nabil Deraz</strong></span>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }