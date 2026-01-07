"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Printer,
  Globe,
  Moon,
  Save,
  Camera,
  Laptop,
  Volume2,
  CheckCircle2
} from "lucide-react";
import { useTranslations } from "next-intl";

// --- Components ---

// 1. Toggle Switch Component
const Toggle = ({ label, description, checked, onChange }: { label: string, description?: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div>
      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-[-22px]' : 'translate-x-[-2px]'
        } ${checked ? '-translate-x-6' : '-translate-x-1'}`} />
    </button>
  </div>
);

// --- Main Page ---
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Mock States
  const [settings, setSettings] = useState({
    notificationsSound: true,
    desktopNotifications: true,
    autoPrintReceipt: true,
    printerReceipt: "EPSON TM-T20III",
    printerLabel: "Zebra GK420t",
    language: "ar",
    theme: "light"
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "notifications", label: "الإشعارات والتنبيهات", icon: Bell },
    { id: "devices", label: "الطابعات والأجهزة", icon: Printer },
    { id: "security", label: "كلمة المرور والأمان", icon: Lock },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8 font-sans text-gray-900 dark:text-white">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إعدادات الحساب</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">تحكم في ملفك الشخصي وتفضيلات النظام</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>حفظ التغييرات</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">

        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 min-h-[500px]">

          {/* 1. Profile Section */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold border-b dark:border-gray-700 pb-4 mb-6 text-gray-900 dark:text-white">الملف الشخصي</h2>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-md overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Reception+User&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 border-2 border-white dark:border-gray-600 shadow-sm">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">موظف الاستقبال</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reception Desk • Main Branch</p>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم بالكامل</label>
                  <input type="text" defaultValue="أحمد محمد" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                  <input type="email" defaultValue="reception@clinica.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:text-white" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف</label>
                  <input type="tel" defaultValue="01012345678" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اللغة المفضلة</label>
                  <div className="relative">
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    >
                      <option value="ar">العربية (Arabic)</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                    <Globe className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Notifications Section */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold border-b dark:border-gray-700 pb-4 mb-6 text-gray-900 dark:text-white">تفضيلات الإشعارات</h2>

              <div className="space-y-2">
                <Toggle
                  label="أصوات التنبيهات"
                  description="تشغيل صوت عند وصول رسالة جديدة أو إشعار"
                  checked={settings.notificationsSound}
                  onChange={(v) => setSettings({ ...settings, notificationsSound: v })}
                />

                <Toggle
                  label="إشعارات سطح المكتب"
                  description="إظهار نوافذ منبثقة (Popups) حتى لو المتصفح في الخلفية"
                  checked={settings.desktopNotifications}
                  onChange={(v) => setSettings({ ...settings, desktopNotifications: v })}
                />

                <div className="py-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                    نغمة التنبيه
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['Classic', 'Chime', 'Subtle'].map((sound) => (
                      <button key={sound} className="px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm focus:border-blue-500 focus:bg-blue-50 dark:focus:bg-blue-900/30 focus:text-blue-700 dark:focus:text-blue-400 text-gray-600 dark:text-gray-300">
                        {sound}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Devices Section (Printers) - Critical for Reception */}
          {activeTab === "devices" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold border-b dark:border-gray-700 pb-4 mb-6 text-gray-900 dark:text-white">الأجهزة والطابعات</h2>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-3 mb-6">
                <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">هذا الجهاز متصل</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">يتم استخدام الإعدادات المحلية لهذا المتصفح للطباعة المباشرة.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">طابعة الإيصالات (Thermal Printer)</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">تستخدم لطباعة فواتير الكشف وحجز المواعيد</p>
                  <select
                    value={settings.printerReceipt}
                    onChange={(e) => setSettings({ ...settings, printerReceipt: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">اختر طابعة...</option>
                    <option value="EPSON TM-T20III">EPSON TM-T20III (Default)</option>
                    <option value="Xprinter XP-Q200">Xprinter XP-Q200</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">طابعة الباركود (Label Printer)</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">تستخدم لطباعة ملصقات عينات المعامل أو ملفات المرضى</p>
                  <select
                    value={settings.printerLabel}
                    onChange={(e) => setSettings({ ...settings, printerLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">اختر طابعة...</option>
                    <option value="Zebra GK420t">Zebra GK420t</option>
                    <option value="Brother QL-800">Brother QL-800</option>
                  </select>
                </div>

                <Toggle
                  label="طباعة تلقائية"
                  description="طباعة الإيصال فوراً عند تأكيد الدفع بدون سؤال"
                  checked={settings.autoPrintReceipt}
                  onChange={(v) => setSettings({ ...settings, autoPrintReceipt: v })}
                />
              </div>
            </div>
          )}

          {/* 4. Security Section */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold border-b dark:border-gray-700 pb-4 mb-6 text-gray-900 dark:text-white">الأمان</h2>

              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">كلمة المرور الحالية</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">كلمة المرور الجديدة</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تأكيد كلمة المرور</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="pt-2">
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">هل نسيت كلمة المرور؟</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-6 bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span>تم حفظ الإعدادات بنجاح</span>
        </div>
      )}

    </div>
  );
}