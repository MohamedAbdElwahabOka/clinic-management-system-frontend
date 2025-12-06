'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
  User, Building2, CreditCard, Camera, Mail, Phone, MapPin, 
  ShieldCheck, Save, CheckCircle2, Calendar, Lock, Eye, EyeOff, 
  LogOut, X, KeyRound, Bell, Smartphone, FileText, Upload, 
  Laptop, Globe, Trash2, AlertTriangle, Fingerprint
} from 'lucide-react';
import { Switch } from '@/components/ui/switch'; // مفترض وجود هذا المكون أو سنستخدم Checkbox عادي

// --- Types ---
type Locale = 'en' | 'ar' | 'de';

interface LocalizedString {
  en: string;
  ar: string;
  de: string;
}

// --- Mock Data Expanded ---
const dummyUser = {
  id: "usr_123",
  name: "Dr. Nabil Deraz",
  email: "nabil@clinica.com",
  phone: "+20 123 456 7890",
  role: "DOCTOR",
  avatarUrl: "/sidbar/avatar.svg", 
  signatureUrl: "/signature-placeholder.png", // New: Signature for prescriptions
  bio: {
    en: "Specialist in internal medicine with 10 years of experience.",
    ar: "أخصائي باطنة بخبرة ١٠ سنوات في علاج الأمراض المزمنة.",
    de: "Facharzt für Innere Medizin mit 10 Jahren Erfahrung."
  } as LocalizedString,
  specialty: {
    en: "Cardiology",
    ar: "أمراض القلب",
    de: "Kardiologie"
  } as LocalizedString,
  clinic: {
    name: "Tanta Elite Clinic",
    licenseNumber: "EG-99281",
    address: "El-Bahr St, Tanta, Egypt",
    documents: [ // New: Legal Docs
       { name: "Medical License.pdf", status: "Verified", date: "2023-01-15" },
       { name: "Tax Registration.pdf", status: "Pending", date: "2023-11-20" }
    ],
    subscription: {
      plan: "Premium",
      status: "Active",
      nextBilling: "2025-12-01"
    }
  },
  activeSessions: [ // New: Security Feature
    { id: 1, device: "MacBook Pro", location: "Tanta, Egypt", ip: "192.168.1.1", current: true, icon: Laptop },
    { id: 2, device: "iPhone 14", location: "Cairo, Egypt", ip: "10.0.0.45", current: false, icon: Smartphone },
  ]
};

export default function AccountPage() {
  const locale = useLocale() as Locale;
  const isRTL = locale === 'ar';
  
  // --- States ---
  const [activeTab, setActiveTab] = useState<'general' | 'clinic' | 'notifications' | 'subscription' | 'security'>('general');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '']); 
  
  // Notification States
  const [notifSettings, setNotifSettings] = useState({
     emailAppt: true,
     smsAppt: false,
     marketing: true,
     security: true
  });

  const getLocalizedContent = (data: LocalizedString) => data[locale] || data['en'];

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value && index < 4) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const tabs = [
    { id: 'general', label: isRTL ? 'بياناتي' : 'General', icon: User },
    { id: 'clinic', label: isRTL ? 'العيادة' : 'Clinic Info', icon: Building2 },
    { id: 'notifications', label: isRTL ? 'الإشعارات' : 'Notifications', icon: Bell }, // New Tab
    { id: 'subscription', label: isRTL ? 'الاشتراك' : 'Subscription', icon: CreditCard },
    { id: 'security', label: isRTL ? 'الأمان' : 'Security', icon: Lock },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 w-full sm:px-4 md:px-0">
      
      {/* 1. Header & Banner Section (Unchanged) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative mx-0.5">
        <div className="h-28 md:h-40 w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-gray-900">
           <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        </div>

        <div className="px-4 pb-6 pt-0 relative flex flex-col items-center gap-4">
           {/* Avatar */}
           <div className="relative -mt-12 group shrink-0">
             <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md">
               <img src={dummyUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
             </div>
             <button className="absolute bottom-0 right-0 p-1.5 bg-[#0582EB] rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors border-2 border-white dark:border-gray-900">
               <Camera className="w-4 h-4" />
             </button>
           </div>

           {/* Name & Role */}
           <div className="text-center w-full px-2">
             <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
               {dummyUser.name}
             </h1>
             <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
               <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-[#0582EB] font-medium whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3" />
                  {getLocalizedContent(dummyUser.specialty)}
               </span>
               <span className="flex items-center gap-1 max-w-[180px] truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{dummyUser.email}</span>
               </span>
             </div>
           </div>

           {/* Tabs */}
           <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
             <div className="flex gap-2 min-w-max mx-auto md:mx-0">
               {tabs.map((tab) => {
                 const isActive = activeTab === tab.id;
                 const Icon = tab.icon;
                 return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`
                       flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                       ${isActive 
                         ? 'bg-[#0582EB] text-white shadow-md shadow-blue-500/20' 
                         : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                       }
                     `}
                   >
                     <Icon className="w-3.5 h-3.5" />
                     {tab.label}
                   </button>
                 );
               })}
             </div>
           </div>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="w-full">
        
        {/* --- TAB: GENERAL --- */}
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 animate-in fade-in slide-in-from-bottom-2 mx-0.5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
               {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                <input type="text" defaultValue={dummyUser.name} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#0582EB] outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'التخصص' : 'Specialty'}</label>
                <input type="text" readOnly defaultValue={getLocalizedContent(dummyUser.specialty)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input type="email" defaultValue={dummyUser.email} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#0582EB] outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
                <input type="tel" defaultValue={dummyUser.phone} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#0582EB] outline-none" />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'نبذة تعريفية' : 'Doctor Bio'}</label>
                <textarea rows={3} defaultValue={getLocalizedContent(dummyUser.bio)} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#0582EB] outline-none resize-none" />
              </div>
              
              {/* New: Digital Signature */}
              <div className="md:col-span-2 space-y-2 pt-2">
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    {isRTL ? 'التوقيع الرقمي (للروشتات)' : 'Digital Signature (For Prescriptions)'}
                 </label>
                 <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                    <div className="w-32 h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                       <span className="text-xs italic">Signature Preview</span>
                    </div>
                    <p className="text-xs text-gray-500">{isRTL ? 'اضغط لرفع صورة التوقيع أو الختم' : 'Click to upload signature or stamp image'}</p>
                 </div>
              </div>
            </div>

            <div className="mt-6 pt-2 border-t border-gray-100 dark:border-gray-800 ">
              <button className="w-full flex items-center justify-center gap-2 bg-[#0582EB] hover:bg-blue-600 text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                <Save className="w-4 h-4" />
                {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* --- TAB: CLINIC INFO --- */}
        {activeTab === 'clinic' && (
           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 animate-in fade-in slide-in-from-bottom-2 mx-0.5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{isRTL ? 'بيانات العيادة' : 'Clinic Info'}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-[#0582EB] shrink-0"><Building2 className="w-5 h-5" /></div>
                        <div className="min-w-0 flex-1"><h3 className="text-xs font-semibold uppercase text-gray-500">{isRTL ? 'اسم العيادة' : 'Name'}</h3><p className="text-sm font-bold dark:text-white truncate">{dummyUser.clinic.name}</p></div>
                    </div>
                    <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 shrink-0"><MapPin className="w-5 h-5" /></div>
                        <div className="min-w-0 flex-1"><h3 className="text-xs font-semibold uppercase text-gray-500">{isRTL ? 'العنوان' : 'Address'}</h3><p className="text-sm font-bold dark:text-white truncate">{dummyUser.clinic.address}</p></div>
                    </div>
                </div>

                {/* Legal Documents Section (New) */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                   <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      {isRTL ? 'المستندات القانونية' : 'Legal Documents'}
                   </h3>
                   <div className="space-y-3">
                      {dummyUser.clinic.documents.map((doc, idx) => (
                         <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                            <div className="flex items-center gap-2">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                               <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{doc.name}</span>
                            </div>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{doc.status}</span>
                         </div>
                      ))}
                      <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1">
                         <Upload className="w-3 h-3" /> {isRTL ? 'رفع مستند جديد' : 'Upload Document'}
                      </button>
                   </div>
                </div>
              </div>
           </div>
        )}

        {/* --- TAB: NOTIFICATIONS (New) --- */}
        {activeTab === 'notifications' && (
           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 animate-in fade-in slide-in-from-bottom-2 mx-0.5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{isRTL ? 'تفضيلات الإشعارات' : 'Notification Preferences'}</h2>
              <div className="space-y-4">
                 {[
                    { id: 'emailAppt', label: isRTL ? 'تنبيهات المواعيد (بريد)' : 'Email Appointment Alerts', desc: isRTL ? 'استلام إيميل عند حجز موعد جديد' : 'Get emails for new bookings' },
                    { id: 'smsAppt', label: isRTL ? 'تنبيهات المواعيد (SMS)' : 'SMS Appointment Alerts', desc: isRTL ? 'استلام رسالة نصية عند الحجز' : 'Get SMS for new bookings' },
                    { id: 'marketing', label: isRTL ? 'أخبار وتحديثات' : 'News & Updates', desc: isRTL ? 'تحديثات النظام والميزات الجديدة' : 'System updates and new features' },
                    { id: 'security', label: isRTL ? 'تنبيهات الأمان' : 'Security Alerts', desc: isRTL ? 'تنبيه عند تسجيل الدخول من جهاز جديد' : 'Alert on new device login' },
                 ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                       <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{setting.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{setting.desc}</p>
                       </div>
                       {/* Mock Toggle Switch */}
                       <div 
                         onClick={() => setNotifSettings(prev => ({...prev, [setting.id]: !prev[setting.id as keyof typeof notifSettings]}))}
                         className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifSettings[setting.id as keyof typeof notifSettings] ? 'bg-[#0582EB]' : 'bg-gray-300 dark:bg-gray-600'}`}
                       >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifSettings[setting.id as keyof typeof notifSettings] ? 'translate-x-5 rtl:-translate-x-5' : ''}`}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- TAB: SUBSCRIPTION --- */}
        {activeTab === 'subscription' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 mx-0.5">
            <div className="bg-gradient-to-r from-[#0582EB] to-blue-600 p-6 text-white relative">
              <CreditCard className="absolute right-0 top-0 opacity-10 w-24 h-24 transform rotate-12" />
               <div className="relative z-10">
                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-[10px] font-bold mb-2">
                     <CheckCircle2 className="w-3 h-3" /> 
                     {dummyUser.clinic.subscription.status}
                 </span>
                 <h2 className="text-xl font-bold">{dummyUser.clinic.subscription.plan} Plan</h2>
              </div>
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? 'تاريخ التجديد القادم' : 'Next Billing Date'}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{dummyUser.clinic.subscription.nextBilling}</p>
                        </div>
                    </div>
                    <button className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm">
                        {isRTL ? 'إدارة الفواتير' : 'Manage Billing'}
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* --- TAB: SECURITY --- */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 animate-in fade-in slide-in-from-bottom-2 mx-0.5">
              
              {/* Change Password */}
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-500 shrink-0">
                    <KeyRound className="w-5 h-5" />
                </div>
                <div><h2 className="text-base font-bold text-gray-900 dark:text-white">{isRTL ? 'كلمة المرور' : 'Password'}</h2></div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                        <div className="relative">
                            <input 
                                type={showCurrentPass ? "text" : "password"}
                                className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#0582EB] outline-none transition-all pr-10 rtl:pl-10 rtl:pr-4"
                            />
                            <button onClick={() => setShowCurrentPass(!showCurrentPass)} className={`absolute top-3 text-gray-400 p-1 ${isRTL ? 'left-2' : 'right-2'}`}>
                                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                        <div className="relative">
                            <input 
                                type={showNewPass ? "text" : "password"}
                                className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#0582EB] outline-none transition-all pr-10 rtl:pl-10 rtl:pr-4"
                            />
                             <button onClick={() => setShowNewPass(!showNewPass)} className={`absolute top-3 text-gray-400 p-1 ${isRTL ? 'left-2' : 'right-2'}`}>
                                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOtpOpen(true)} className="w-full md:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg active:scale-95">
                    {isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
                </button>
              </div>

              {/* Active Sessions (New) */}
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3 mt-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-500 shrink-0">
                    <Fingerprint className="w-5 h-5" />
                </div>
                <div><h2 className="text-base font-bold text-gray-900 dark:text-white">{isRTL ? 'الجلسات النشطة' : 'Active Sessions'}</h2></div>
              </div>
              
              <div className="space-y-3 mb-8">
                 {dummyUser.activeSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                       <div className="flex items-center gap-3">
                          <session.icon className="w-5 h-5 text-gray-400" />
                          <div>
                             <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {session.device} 
                                {session.current && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 rounded-full">{isRTL ? 'الحالية' : 'Current'}</span>}
                             </p>
                             <p className="text-xs text-gray-500">{session.location} • {session.ip}</p>
                          </div>
                       </div>
                       {!session.current && (
                          <button className="text-xs text-red-600 font-medium hover:underline">{isRTL ? 'إنهاء' : 'Revoke'}</button>
                       )}
                    </div>
                 ))}
              </div>

              {/* Danger Zone (New) */}
              <div className="mt-8 pt-6 border-t border-red-100 dark:border-red-900/30">
                <h3 className="text-red-600 font-bold mb-2 text-sm">{isRTL ? 'منطقة الخطر' : 'Danger Zone'}</h3>
                <div className="flex flex-col md:flex-row gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100 dark:border-red-900/30">
                        <LogOut className="w-4 h-4" />
                        {isRTL ? 'تسجيل الخروج' : 'Log Out'}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-transparent text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        {isRTL ? 'حذف الحساب' : 'Delete Account'}
                    </button>
                </div>
              </div>
          </div>
        )}
      </div>

      {/* 3. OTP Verification Modal (Unchanged) */}
      {isOtpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 fade-in duration-200 border border-gray-200 dark:border-gray-800">
                <button onClick={() => setIsOtpOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="text-center mb-6 mt-2">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-[#0582EB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isRTL ? 'تأكيد الهوية' : 'Verify Identity'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 px-4">{isRTL ? `تم إرسال الرمز إلى ${dummyUser.email}` : `Code sent to ${dummyUser.email}`}</p>
                </div>
                <div className="flex justify-center gap-2 mb-8" dir="ltr">
                    {otpCode.map((digit, index) => (
                        <input key={index} id={`otp-${index}`} type="tel" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} className="w-12 h-14 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-center text-xl font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#0582EB] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                    ))}
                </div>
                <button className="w-full bg-[#0582EB] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 mb-2 active:scale-95" onClick={() => { alert('Success!'); setIsOtpOpen(false); }}>
                    {isRTL ? 'تأكيد وتغيير' : 'Verify & Change'}
                </button>
            </div>
        </div>
      )}
    </div>
  );
}





















// 'use client';

// import { useState } from 'react';
// import { useLocale } from 'next-intl';
// import { 
//   User, Building2, CreditCard, Camera, Mail, Phone, MapPin, 
//   ShieldCheck, Save, CheckCircle2, Calendar, Lock, Eye, EyeOff, 
//   LogOut, X, KeyRound 
// } from 'lucide-react';

// // --- Types ---
// type Locale = 'en' | 'ar' | 'de';

// interface LocalizedString {
//   en: string;
//   ar: string;
//   de: string;
// }

// // --- Mock Data ---
// const dummyUser = {
//   id: "usr_123",
//   name: "Dr. Nabil Deraz",
//   email: "nabil@clinica.com",
//   phone: "+20 123 456 7890",
//   role: "DOCTOR",
//   avatarUrl: "/sidbar/avatar.svg", 
//   bio: {
//     en: "Specialist in internal medicine with 10 years of experience.",
//     ar: "أخصائي باطنة بخبرة ١٠ سنوات في علاج الأمراض المزمنة.",
//     de: "Facharzt für Innere Medizin mit 10 Jahren Erfahrung."
//   } as LocalizedString,
//   specialty: {
//     en: "Cardiology",
//     ar: "أمراض القلب",
//     de: "Kardiologie"
//   } as LocalizedString,
//   clinic: {
//     name: "Tanta Elite Clinic",
//     licenseNumber: "EG-99281",
//     address: "El-Bahr St, Tanta, Egypt",
//     subscription: {
//       plan: "Premium",
//       status: "Active",
//       nextBilling: "2025-12-01"
//     }
//   }
// };

// export default function AccountPage() {
//   const locale = useLocale() as Locale;
//   const isRTL = locale === 'ar';
  
//   // --- States ---
//   const [activeTab, setActiveTab] = useState<'general' | 'clinic' | 'subscription' | 'security'>('general');
//   const [showCurrentPass, setShowCurrentPass] = useState(false);
//   const [showNewPass, setShowNewPass] = useState(false);
//   const [isOtpOpen, setIsOtpOpen] = useState(false);
//   const [otpCode, setOtpCode] = useState(['', '', '', '', '']); 

//   const getLocalizedContent = (data: LocalizedString) => data[locale] || data['en'];

//   const handleOtpChange = (index: number, value: string) => {
//     if (value.length > 1) return;
//     const newOtp = [...otpCode];
//     newOtp[index] = value;
//     setOtpCode(newOtp);
//     if (value && index < 4) document.getElementById(`otp-${index + 1}`)?.focus();
//   };

//   const tabs = [
//     { id: 'general', label: isRTL ? 'بياناتي' : 'General', icon: User },
//     { id: 'clinic', label: isRTL ? 'العيادة' : 'Clinic Info', icon: Building2 },
//     { id: 'subscription', label: isRTL ? 'الاشتراك' : 'Subscription', icon: CreditCard },
//     { id: 'security', label: isRTL ? 'الأمان' : 'Security', icon: Lock },
//   ] as const;

//   return (
//     // التعديل 1: إضافة overflow-x-hidden لمنع الصفحة كلها من التحرك يميناً ويساراً
//     <div className="grid grid-cols-1 gap-4 w-full sm:px-4 md:px-0" >
      
//       {/* 1. Header & Banner Section */}
//       <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative mx-0.5">
//         <div className="h-28 md:h-40 w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-gray-900">
//            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
//         </div>

//         {/* التعديل 2: تنسيق المحتوى ليكون عمودياً في الموبايل ومتوسطاً تماماً */}
//         <div className="px-4 pb-6 pt-0 relative flex flex-col items-center gap-4">
            
//             {/* Avatar - Centered */}
//             <div className="relative -mt-12 group shrink-0">
//               <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md">
//                 <img src={dummyUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
//               </div>
//               <button className="absolute bottom-0 right-0 p-1.5 bg-[#0582EB] rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors border-2 border-white dark:border-gray-900">
//                 <Camera className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Name & Role - Centered & Width Constraints */}
//             <div className="text-center w-full px-2">
//               <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
//                 {dummyUser.name}
//               </h1>
              
//               <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
//                 <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-[#0582EB] font-medium whitespace-nowrap">
//                    <ShieldCheck className="w-3 h-3" />
//                    {getLocalizedContent(dummyUser.specialty)}
//                 </span>
                
//                 {/* Truncate long emails so they don't break layout */}
//                 <span className="flex items-center gap-1 max-w-[180px] truncate">
//                    <Mail className="w-3.5 h-3.5 shrink-0" />
//                    <span className="truncate">{dummyUser.email}</span>
//                 </span>
//               </div>
//             </div>

//             {/* Tabs - Scrollable Container Fixed */}
//             {/* التعديل 3: جعل التبويبات سكرول أفقي سلس مع التأكد أن الحاوية لا تتجاوز عرض الشاشة */}
//             <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
//               <div className="flex gap-2 min-w-max mx-auto md:mx-0">
//                 {tabs.map((tab) => {
//                   const isActive = activeTab === tab.id;
//                   const Icon = tab.icon;
//                   return (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id as any)}
//                       className={`
//                         flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap
//                         ${isActive 
//                           ? 'bg-[#0582EB] text-white shadow-md shadow-blue-500/20' 
//                           : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                         }
//                       `}
//                     >
//                       <Icon className="w-3.5 h-3.5" />
//                       {tab.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//         </div>
//       </div>

//       {/* 2. Content Area */}
//       {/* التعديل 4: الحاوية الرئيسية للكروت تأخذ عرض 100% بدون هوامش زائدة */}
//       <div className="w-full">
        
//         {/* --- TAB: GENERAL --- */}
//         {activeTab === 'general' && (
//           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 animate-in fade-in slide-in-from-bottom-2 mx-0.5">
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
//                {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
//             </h2>
            
//             <div className="space-y-1.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
//                 <input type="text" defaultValue={dummyUser.name} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none text-sm" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'التخصص' : 'Specialty'}</label>
//                 <input type="text" readOnly defaultValue={getLocalizedContent(dummyUser.specialty)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
//                 <input type="email" defaultValue={dummyUser.email} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none text-sm" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
//                 <input type="tel" defaultValue={dummyUser.phone} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none text-sm" />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'نبذة تعريفية' : 'Doctor Bio'}</label>
//                 <textarea rows={4} defaultValue={getLocalizedContent(dummyUser.bio)} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none resize-none text-sm" />
//               </div>
//             </div>

//             {/* التعديل 5: إصلاح زر الحفظ ليظهر بالكامل */}
//             <div className="mt-6 pt-2 border-t border-gray-100 dark:border-gray-800 ">
//               <button className="w-full flex items-center justify-center gap-2 bg-[#0582EB] hover:bg-blue-600 text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
//                 <Save className="w-4 h-4" />
//                 {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* --- TAB: CLINIC INFO --- */}
//         {activeTab === 'clinic' && (
//            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 animate-in fade-in slide-in-from-bottom-2 mx-0.5">
//               <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{isRTL ? 'بيانات العيادة' : 'Clinic Info'}</h2>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//                 <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3 w-full overflow-hidden">
//                   <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-[#0582EB] shrink-0"><Building2 className="w-5 h-5" /></div>
//                   <div className="min-w-0 flex-1"><h3 className="text-xs font-semibold uppercase text-gray-500">{isRTL ? 'اسم العيادة' : 'Name'}</h3><p className="text-sm font-bold dark:text-white truncate">{dummyUser.clinic.name}</p></div>
//                 </div>
//                 <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3 w-full overflow-hidden">
//                   <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 shrink-0"><ShieldCheck className="w-5 h-5" /></div>
//                   <div className="min-w-0 flex-1"><h3 className="text-xs font-semibold uppercase text-gray-500">{isRTL ? 'الترخيص' : 'License'}</h3><p className="text-sm font-bold dark:text-white truncate">{dummyUser.clinic.licenseNumber}</p></div>
//                 </div>

//                 <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3 w-full overflow-hidden">
//                   <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 shrink-0"><MapPin className="w-5 h-5" /></div>
//                   <div className="min-w-0 flex-1"><h3 className="text-xs font-semibold uppercase text-gray-500">{isRTL ? 'العنوان' : 'Address'}</h3><p className="text-sm font-bold dark:text-white truncate">{dummyUser.clinic.address}</p></div>
//                 </div>
//               </div>
//            </div>
//         )}

//         {/* --- TAB: SUBSCRIPTION --- */}
//         {activeTab === 'subscription' && (
//           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 mx-0.5">
//             <div className="bg-gradient-to-r from-[#0582EB] to-blue-600 p-6 text-white relative">
//                 <CreditCard className="absolute right-0 top-0 opacity-10 w-24 h-24 transform rotate-12" />
//                  <div className="relative z-10">
//                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-[10px] font-bold mb-2">
//                         <CheckCircle2 className="w-3 h-3" /> 
//                         {dummyUser.clinic.subscription.status}
//                     </span>
//                     <h2 className="text-xl font-bold">{dummyUser.clinic.subscription.plan} Plan</h2>
//                  </div>
//             </div>
//             <div className="p-4">
//                 <div className="flex flex-col gap-4">
//                     <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
//                         <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
//                             <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? 'تاريخ التجديد القادم' : 'Next Billing Date'}</p>
//                             <p className="text-sm font-bold text-gray-900 dark:text-white">{dummyUser.clinic.subscription.nextBilling}</p>
//                         </div>
//                     </div>
//                     <button className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm">
//                         {isRTL ? 'إدارة الفواتير' : 'Manage Billing'}
//                     </button>
//                 </div>
//             </div>
//           </div>
//         )}

//         {/* --- TAB: SECURITY --- */}
//         {activeTab === 'security' && (
//           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 animate-in fade-in slide-in-from-bottom-2 mx-0.5">
//               <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
//                 <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-500 shrink-0">
//                     <KeyRound className="w-5 h-5" />
//                 </div>
//                 <div>
//                     <h2 className="text-base font-bold text-gray-900 dark:text-white">{isRTL ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'كلمة المرور الحالية' : 'Current Password'}</label>
//                     <div className="relative">
//                         <input 
//                             type={showCurrentPass ? "text" : "password"}
//                             className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none transition-all pr-10 rtl:pl-10 rtl:pr-4 text-sm"
//                         />
//                         <button onClick={() => setShowCurrentPass(!showCurrentPass)} className={`absolute top-3 text-gray-400 p-1 ${isRTL ? 'left-2' : 'right-2'}`}>
//                             {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                         </button>
//                     </div>
//                 </div>
//                 <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{isRTL ? 'كلمة المرور الجديدة' : 'New Password'}</label>
//                     <div className="relative">
//                         <input 
//                             type={showNewPass ? "text" : "password"}
//                             className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none transition-all pr-10 rtl:pl-10 rtl:pr-4 text-sm"
//                         />
//                          <button onClick={() => setShowNewPass(!showNewPass)} className={`absolute top-3 text-gray-400 p-1 ${isRTL ? 'left-2' : 'right-2'}`}>
//                             {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                         </button>
//                     </div>
//                 </div>
                
//                 <button onClick={() => setIsOtpOpen(true)} className="w-full mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg active:scale-95">
//                     {isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
//                 </button>
//               </div>

//               <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
//                 <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors active:scale-95 border border-red-100 dark:border-red-900/30">
//                     <LogOut className="w-4 h-4" />
//                     {isRTL ? 'تسجيل الخروج' : 'Log Out'}
//                 </button>
//               </div>
//           </div>
//         )}
//       </div>

//       {/* 3. OTP Verification Modal */}
//       {isOtpOpen && (
//         // التعديل 1: استخدام items-center بدلاً من items-end لتوسيط النافذة عمودياً
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            
//             {/* التعديل 2: 
//                 - تغيير rounded-t-2xl إلى rounded-2xl (حواف دائرية كاملة)
//                 - تغيير الانيميشن من slide-in-from-bottom إلى zoom-in-95 (ظهور من المنتصف)
//             */}
//             <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 fade-in duration-200 border border-gray-200 dark:border-gray-800">
                
//                 {/* Close Button */}
//                 <button 
//                     onClick={() => setIsOtpOpen(false)} 
//                     className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
//                 >
//                     <X className="w-5 h-5" />
//                 </button>

//                 {/* Header */}
//                 <div className="text-center mb-6 mt-2">
//                     <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-[#0582EB] rounded-full flex items-center justify-center mx-auto mb-4">
//                         <ShieldCheck className="w-8 h-8" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                         {isRTL ? 'تأكيد الهوية' : 'Verify Identity'}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 px-4">
//                         {isRTL ? `تم إرسال الرمز إلى ${dummyUser.email}` : `Code sent to ${dummyUser.email}`}
//                     </p>
//                 </div>

//                 {/* OTP Inputs */}
//                 <div className="flex justify-center gap-2 mb-8" dir="ltr">
//                     {otpCode.map((digit, index) => (
//                         <input
//                             key={index}
//                             id={`otp-${index}`}
//                             type="tel" 
//                             maxLength={1}
//                             value={digit}
//                             onChange={(e) => handleOtpChange(index, e.target.value)}
//                             className="w-12 h-14 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-center text-xl font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#0582EB] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
//                         />
//                     ))}
//                 </div>

//                 {/* Submit Button */}
//                 <button 
//                     className="w-full bg-[#0582EB] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 mb-2 active:scale-95"
//                     onClick={() => { alert('Success!'); setIsOtpOpen(false); }}
//                 >
//                     {isRTL ? 'تأكيد وتغيير' : 'Verify & Change'}
//                 </button>
//             </div>
//         </div>
//       )}
//     </div>
//   );
// }













// 'use client';

// import { useState } from 'react';
// import { useLocale, useTranslations } from 'next-intl';
// import { 
//   User, 
//   Building2, 
//   CreditCard, 
//   Camera, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   ShieldCheck, 
//   Save,
//   CheckCircle2,
//   Calendar,
//   Globe
// } from 'lucide-react';

// // --- Types ---
// type Locale = 'en' | 'ar' | 'de';

// interface LocalizedString {
//   en: string;
//   ar: string;
//   de: string;
// }

// // --- Mock Data ---
// const dummyUser = {
//   id: "usr_123",
//   name: "Dr. Nabil Deraz",
//   email: "nabil@clinica.com",
//   phone: "+20 123 456 7890",
//   role: "DOCTOR",
//   avatarUrl: "/sidbar/avatar.svg", 
//   bio: {
//     en: "Specialist in internal medicine with 10 years of experience.",
//     ar: "أخصائي باطنة بخبرة ١٠ سنوات في علاج الأمراض المزمنة.",
//     de: "Facharzt für Innere Medizin mit 10 Jahren Erfahrung."
//   } as LocalizedString,
//   specialty: {
//     en: "Cardiology",
//     ar: "أمراض القلب",
//     de: "Kardiologie"
//   } as LocalizedString,
//   clinic: {
//     name: "Tanta Elite Clinic",
//     licenseNumber: "EG-99281",
//     address: "El-Bahr St, Tanta, Egypt",
//     subscription: {
//       plan: "Premium",
//       status: "Active",
//       nextBilling: "2025-12-01"
//     }
//   }
// };

// export default function AccountPage() {
//   const locale = useLocale() as Locale;
//   // const t = useTranslations('Account'); // Uncomment when you have json files
//   const isRTL = locale === 'ar';
  
//   const [activeTab, setActiveTab] = useState<'general' | 'clinic' | 'subscription'>('general');

//   // --- Helper: JSONB Localization Logic ---
//   const getLocalizedContent = (data: LocalizedString) => {
//     return data[locale] || data['en'];
//   };

//   // --- Tabs Configuration ---
//   const tabs = [
//     { id: 'general', label: isRTL ? 'بياناتي' : 'General', icon: User },
//     { id: 'clinic', label: isRTL ? 'العيادة' : 'Clinic Info', icon: Building2 },
//     { id: 'subscription', label: isRTL ? 'الاشتراك' : 'Subscription', icon: CreditCard },
//   ] as const;

//   return (
//     // Main Container: Fits inside the dashboard layout (White/Gray based on theme)
//     <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
//       {/* 1. Header & Banner Section */}
//       <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden relative">
//         {/* Banner Cover */}
//         <div className="h-40 w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-gray-900">
//            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
//         </div>

//         {/* Profile Info Bar */}
//         <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-start md:items-end gap-5">
//             {/* Avatar */}
//             <div className="relative -mt-12 group">
//               <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md">
//                 <img src={dummyUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
//               </div>
//               <button className="absolute bottom-1 right-1 p-1.5 bg-[#0582EB] rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors border-2 border-white dark:border-gray-900">
//                 <Camera className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Name & Role */}
//             <div className="flex-1 text-center md:text-start w-full md:w-auto">
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{dummyUser.name}</h1>
//               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
//                 <span className="flex items-center gap-1">
//                    <ShieldCheck className="w-4 h-4 text-[#0582EB]" />
//                    {getLocalizedContent(dummyUser.specialty)}
//                 </span>
//                 <span className="hidden md:block w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
//                 <span className="flex items-center gap-1">
//                    <Mail className="w-3.5 h-3.5" />
//                    {dummyUser.email}
//                 </span>
//               </div>
//             </div>

//             {/* Tabs Navigation (Desktop & Mobile) */}
//             <div className="flex overflow-x-auto custom-scrollbar w-full md:w-auto gap-2 pb-1 md:pb-0">
//               {tabs.map((tab) => {
//                 const isActive = activeTab === tab.id;
//                 const Icon = tab.icon;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`
//                       flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
//                       ${isActive 
//                         ? 'bg-[#0582EB] text-white shadow-md shadow-blue-500/20' 
//                         : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                       }
//                     `}
//                   >
//                     <Icon className="w-4 h-4" />
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </div>
//         </div>
//       </div>

//       {/* 2. Content Area */}
//       <div className="grid grid-cols-1 gap-6">
        
//         {/* --- TAB: GENERAL --- */}
//         {activeTab === 'general' && (
//           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 animate-in fade-in slide-in-from-bottom-2">
//             <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
//               <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//                 {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   {isRTL ? 'الاسم بالكامل' : 'Full Name'}
//                 </label>
//                 <input 
//                   type="text" 
//                   defaultValue={dummyUser.name}
//                   className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
//                 />
//               </div>

//               {/* Specialty (Read Only) */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   {isRTL ? 'التخصص' : 'Specialty'}
//                 </label>
//                 <input 
//                   type="text" 
//                   readOnly
//                   defaultValue={getLocalizedContent(dummyUser.specialty)}
//                   className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 cursor-not-allowed"
//                 />
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
//                 </label>
//                 <div className="relative">
//                   <Mail className={`absolute top-3 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
//                   <input 
//                     type="email" 
//                     defaultValue={dummyUser.email}
//                     className={`w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none transition-all ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
//                   />
//                 </div>
//               </div>

//               {/* Phone */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   {isRTL ? 'رقم الهاتف' : 'Phone Number'}
//                 </label>
//                 <div className="relative">
//                   <Phone className={`absolute top-3 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
//                   <input 
//                     type="tel" 
//                     defaultValue={dummyUser.phone}
//                     className={`w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none transition-all ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
//                   />
//                 </div>
//               </div>

//               {/* Bio */}
//               <div className="col-span-1 md:col-span-2 space-y-2">
//                 <div className="flex justify-between">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     {isRTL ? 'نبذة تعريفية' : 'Doctor Bio'}
//                     </label>
//                     <span className="text-xs text-[#0582EB] flex items-center gap-1">
//                         <Globe className="w-3 h-3" /> 
//                         {isRTL ? 'تلقائي (عربي)' : 'Auto (English)'}
//                     </span>
//                 </div>
//                 <textarea 
//                   rows={4}
//                   defaultValue={getLocalizedContent(dummyUser.bio)}
//                   className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0582EB] outline-none transition-all resize-none"
//                 />
//               </div>
//             </div>

//             <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
//               <button className="flex items-center gap-2 bg-[#0582EB] hover:bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-500/20">
//                 <Save className="w-4 h-4" />
//                 {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* --- TAB: CLINIC INFO --- */}
//         {activeTab === 'clinic' && (
//           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 animate-in fade-in slide-in-from-bottom-2">
//              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
//                 {isRTL ? 'بيانات العيادة المسجلة' : 'Registered Clinic Details'}
//              </h2>
             
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Clinic Card */}
//                 <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-start gap-4 hover:border-[#0582EB]/50 transition-colors">
//                   <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-[#0582EB]">
//                     <Building2 className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
//                         {isRTL ? 'اسم العيادة' : 'Clinic Name'}
//                     </h3>
//                     <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{dummyUser.clinic.name}</p>
//                   </div>
//                 </div>

//                 {/* License Card */}
//                 <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-start gap-4 hover:border-emerald-500/50 transition-colors">
//                   <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-500">
//                     <ShieldCheck className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
//                         {isRTL ? 'الترخيص' : 'License ID'}
//                     </h3>
//                     <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{dummyUser.clinic.licenseNumber}</p>
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div className="col-span-1 md:col-span-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-start gap-4">
//                   <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-500">
//                     <MapPin className="w-6 h-6" />
//                   </div>
//                   <div>
//                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
//                         {isRTL ? 'العنوان' : 'Address'}
//                     </h3>
//                     <p className="text-base font-medium text-gray-900 dark:text-white mt-1">{dummyUser.clinic.address}</p>
//                   </div>
//                 </div>
//              </div>
//           </div>
//         )}

//         {/* --- TAB: SUBSCRIPTION --- */}
//         {activeTab === 'subscription' && (
//           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
//             <div className="bg-gradient-to-r from-[#0582EB] to-[#0461b0] p-8 text-white relative">
//                  <div className="absolute right-0 top-0 opacity-10 p-4">
//                      <CreditCard className="w-40 h-40 transform rotate-12" />
//                  </div>
//                  <div className="relative z-10">
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold mb-4">
//                         <CheckCircle2 className="w-3.5 h-3.5" /> 
//                         {dummyUser.clinic.subscription.status}
//                     </span>
//                     <h2 className="text-3xl font-bold">{dummyUser.clinic.subscription.plan} Plan</h2>
//                     <p className="text-blue-100 mt-2 max-w-lg">
//                         {isRTL 
//                            ? 'استمتع بكامل مميزات النظام لإدارة عيادتك بكفاءة.' 
//                            : 'You have full access to manage your clinic efficiently with premium features.'}
//                     </p>
//                  </div>
//             </div>

//             <div className="p-8">
//                 <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
//                     <div className="flex items-center gap-4 mb-4 md:mb-0">
//                         <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
//                             <Calendar className="w-6 h-6 text-gray-500 dark:text-gray-400" />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {isRTL ? 'تاريخ التجديد القادم' : 'Next Billing Date'}
//                             </p>
//                             <p className="text-xl font-bold text-gray-900 dark:text-white">
//                                 {dummyUser.clinic.subscription.nextBilling}
//                             </p>
//                         </div>
//                     </div>
//                     <button className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
//                         {isRTL ? 'إدارة الفواتير' : 'Manage Billing'}
//                     </button>
//                 </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }