'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bell, ChevronLeft, ChevronRight, LayoutDashboard, Users, Calendar, FileText, DollarSign, Settings, HelpCircle, Hospital, ShieldAlert } from 'lucide-react';
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
  const [collapsed, setCollapsed] = useState(false);

  // ---------------------------------------------------------
  // 1. تحديد الـ Context الحالي
  // ---------------------------------------------------------
  const currentContext = useMemo(() => {
    if (pathname.includes('/reception')) return 'reception';
    if (pathname.includes('/admin')) return 'admin';
    if (pathname.includes('/lab')) return 'lab';
    return 'default'; // الديفولت (الدكتور)
  }, [pathname]);

  // ---------------------------------------------------------
  // 2. تكوين القوائم (Menus Configuration)
  // ---------------------------------------------------------
  const menuConfig = useMemo(() => {
    
    // --- قائمة الدكتور ---
    const doctorMenu = {
      title: 'Clinica',
      homeLink: '/dashboard',
      userTitle: 'Dr. Nabil',
      items: [
        { name: t('Dashboard'), icon: LayoutDashboard, link: '/dashboard', hasNotification: false },
        { name: t('patients'), icon: Users, link: '/patients', hasNotification: false },
        { name: t('appointments'), icon: Calendar, link: '/appointments', hasNotification: true },
        { name: t('Medical-Records'), icon: FileText, link: '/records', hasNotification: false },
        { name: t('Financials'), icon: DollarSign, link: '/financials', hasNotification: false },
        { name: t('Clinics'), icon: Hospital, link: '/clinics', hasNotification: false }
      ],
      bottomItems: [
        { name: t('Notifications'), icon: Bell, link: '/notifications', hasNotification: true },
        { name: t('Settings'), icon: Settings, link: '/settings', hasNotification: false },
        { name: t('Support'), icon: HelpCircle, link: '/support', hasNotification: false }
      ]
    };

    // --- قائمة الريسيبشن ---
    const receptionMenu = {
      title: 'Reception',
      homeLink: '/reception/appointments',
      userTitle: 'Front Desk',
      items: [
        { name: t('appointments'), icon: Calendar, link: '/reception/appointments', hasNotification: true },
        { name: t('patients'), icon: Users, link: '/reception/patients', hasNotification: false },
        { name: t('Clinics'), icon: Hospital, link: '/reception/clinics', hasNotification: false } ,
        { name: t('Chat'), icon: Hospital, link: '/reception/chat', hasNotification: false } ,
      ],
      bottomItems: [
        { name: t('Notifications'), icon: Bell, link: '/reception/notifications', hasNotification: true },
        { name: t('Settings'), icon: Settings, link: '/reception/settings', hasNotification: true },
        { name: t('Support'), icon: HelpCircle, link: '/reception/support', hasNotification: false }
      ]
    };

    // --- قائمة الأدمن ---
    const adminMenu = {
      title: 'Admin Panel',
      homeLink: '/admin/dashboard',
      userTitle: 'System Admin',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, link: '/admin/dashboard', hasNotification: false },
        { name: 'Users Management', icon: Users, link: '/admin/users', hasNotification: false },
        { name: 'System Logs', icon: ShieldAlert, link: '/admin/logs', hasNotification: false },
      ],
      bottomItems: [
        { name: 'Settings', icon: Settings, link: '/admin/settings', hasNotification: false },
      ]
    };

    return {
      default: doctorMenu,
      reception: receptionMenu,
      admin: adminMenu,
    };

  }, [t]);

  // ---------------------------------------------------------
  // 3. اختيار القائمة المعروضة حالياً
  // ---------------------------------------------------------
  const activeMenu = menuConfig[currentContext as keyof typeof menuConfig] || menuConfig.default;

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) setCollapsed(false); 
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <aside className={`h-full bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out z-50 relative border-gray-800 ${isRTL ? 'border-l' : 'border-r'} ${collapsed ? 'w-16' : 'w-full md:w-60'}`}>
      
      {/* Header Section */}
      <div className="flex-shrink-0 relative">
        <div className={`flex items-center h-14 px-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link href={activeMenu.homeLink} onClick={handleItemClick} className="flex items-center gap-2 overflow-hidden whitespace-nowrap cursor-pointer">
              <img src="/logo/logo.svg" alt="Logo" className="h-7 w-7 min-w-[28px]" />
              <h1 className="text-lg font-bold tracking-wide">{activeMenu.title}</h1>
            </Link>
          )}
          
          {collapsed && (
             <Link href={activeMenu.homeLink} onClick={handleItemClick}>
                <img src="/logo/logo.svg" alt="Logo" className="h-7 w-7 cursor-pointer" />
             </Link>
          )}

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

      {/* Main Menu Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-2 space-y-4">
        <nav className="space-y-0.5 px-2">
          {activeMenu.items.map((item) => {
            
            // 🔥 التعديل هنا: بنشيل أي لغة من حرفين (ar, en, de) من الرابط عشان المقارنة تظبط
            const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
            
            // بنقارن الرابط "النضيف" بالرابط اللي في القائمة
            const isActive = 
                pathnameWithoutLocale === item.link || 
                pathnameWithoutLocale.startsWith(`${item.link}/`);

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

        {/* Bottom Menu Items */}
        <nav className="space-y-0.5 px-2">
          {activeMenu.bottomItems.map((item) => {
            
            // 🔥 نفس التعديل للقائمة السفلية عشان الدعم والاعدادات
            const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
            const isActive = pathnameWithoutLocale === item.link || pathnameWithoutLocale.startsWith(`${item.link}/`);

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

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-3 bg-gray-900 border-t border-gray-800 z-10">
        <Link href={`${activeMenu.homeLink.replace('/dashboard', '').replace('/appointments', '')}/account` || '/account'} onClick={handleItemClick}>
          <div className={`flex items-center rounded-lg p-1.5 transition-colors hover:bg-gray-800 cursor-pointer ${collapsed ? 'justify-center' : 'space-x-2 rtl:space-x-reverse'}`}>
            <img src="/sidbar/avatar.svg" alt="User" className="w-8 h-8 rounded-full border border-[#0582EB]" />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] text-gray-400">{t('Welcome-back')}</span>
                <span className="text-xs font-bold text-white truncate">
                   {activeMenu.userTitle}
                </span>
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