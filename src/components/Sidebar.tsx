'use client';

import { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, LayoutDashboard, Users, Calendar, FileText, DollarSign, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';


export default function Sidebar() {
  const t = useTranslations('Sidbar');
  const menuItems = [
    { name: t('Dashboard'), icon: LayoutDashboard, link: '/' },
    { name: t('patients'), icon: Users, link: '/patients' },
    { name: t('appointments'), icon: Calendar, link: '/appointments' },
    { name: t('Medical-Records'), icon: FileText, link: '/records' },
    { name: t('Payments'), icon: DollarSign, link: '/payments' }
  ];
  
  const menuItemstwo = [
    { name: t('Notifications'), icon: Bell, link: '/notifications', hasNotification: true },
    { name: t('Settings'), icon: Settings, link: '/settings' },
    { name: t('Support'), icon: HelpCircle, link: '/support' }
  ];
  
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white p-3 flex flex-col justify-between transition-all duration-300 ${collapsed ? 'w-12' : 'w-52'}`}>
        {/* Logo */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img src="/logo/logo.svg" alt="Logo" className="h-6 w-6" />
            <h1 className={`ml-1 text-lg font-bold transition-all pr-4 pl-4 ${collapsed ? 'hidden' : 'block'}`}>TeleCare</h1>
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md hover:bg-[#0582EB] bg-gray-700">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <hr className="my-3 border-gray-700" />

        {/* Menu Items */}
        <nav className="space-y-3 pb-3">
          {menuItems.map((item) => (
            <Link href={item.link} key={item.name} className="flex items-center space-x-3 p-1.5 rounded-md hover:bg-[#0582EB]">
              <item.icon className={`transition-all ${collapsed ? 'w-5 h-5 rounded-full' : 'w-4 h-4'}`} />
              {!collapsed && <span className="text-sm pr-2">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <hr className="my-3 border-gray-700" />

        {/* Second Set of Menu Items */}
        <nav className="space-y-3 pt-3">
          {menuItemstwo.map((item) => (
            <Link href={item.link} key={item.name} className="flex items-center space-x-3 p-1.5 rounded-md hover:bg-[#0582EB]">
              <div className="relative">
                <item.icon className={`transition-all ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                {item.hasNotification && (
                  <span className="absolute top-0 right-0 bg-orange-500 w-2.5 h-2.5 rounded-full"></span>
                )}
              </div>
              {!collapsed && <span className="text-sm pr-2">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-3">
          <div className="p-3 rounded-lg text-center">
            <img src="/sidbar/sidbar.svg" alt="Upgrade" className="mx-auto mb-1.5 w-16 h-16" />
            {!collapsed && <button className="bg-[#0582EB] text-white py-1.5 px-3 rounded-lg w-full text-sm">{t('Upgrade')}</button>}
          </div>
          <hr className="my-3 border-gray-700" />
          <div className="flex items-center space-x-1.5 p-1.5 rounded-md cursor-pointer">
            <img src="/sidbar/avatar.svg" alt="User" className="w-8 h-8 rounded-full" />
            {!collapsed && <span className="text-xs pr-2"> {t('Welcome-back')}👋<br></br> <strong>Nabil Deraz</strong></span>}
          </div>
        </div>
      </div>
    </div>
  );
}