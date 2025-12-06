"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { 
  Settings, Globe, Bell, Moon, Sun, Clock, Printer, 
  Database, Shield, Save, Building, Smartphone, FileText, 
  CreditCard, CalendarClock, Lock, RefreshCw, Mail
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// --- Translation Dictionary ---
const TEXTS = {
  ar: {
    title: "إعدادات النظام",
    subtitle: "تحكم في كل تفاصيل عيادتك من مكان واحد",
    save: "حفظ التغييرات",
    tabs: {
      general: "عام",
      appointments: "المواعيد",
      printing: "الطباعة والروشتة",
      notifications: "الإشعارات",
      security: "الأمان والبيانات"
    },
    sections: {
      appearance: "المظهر واللغة",
      clinicInfo: "بيانات العمل",
      schedule: "قواعد الحجز",
      prescription: "تخصيص الروشتة",
      backup: "النسخ الاحتياطي"
    },
    labels: {
      language: "لغة النظام",
      theme: "الوضع الليلي",
      currency: "العملة الافتراضية",
      timezone: "المنطقة الزمنية",
      slotDuration: "مدة الكشف (دقيقة)",
      bufferTime: "وقت راحة بين الكشوفات",
      paperSize: "حجم ورق الطباعة",
      showLogo: "طباعة الشعار على الروشتة",
      autoBackup: "نسخ احتياطي يومي",
      smsReminders: "تذكير SMS للمرضى",
      emailReminders: "تذكير بريد إلكتروني",
      marketing: "رسائل تسويقية",
      sessionTimeout: "تسجيل خروج تلقائي (للأمان)"
    }
  },
  en: {
    title: "System Settings",
    subtitle: "Manage all your clinic details in one place",
    save: "Save Changes",
    tabs: {
      general: "General",
      appointments: "Appointments",
      printing: "Rx & Printing",
      notifications: "Notifications",
      security: "Security & Data"
    },
    sections: {
      appearance: "Appearance & Locale",
      clinicInfo: "Business Info",
      schedule: "Booking Rules",
      prescription: "Rx Customization",
      backup: "Data Backup"
    },
    labels: {
      language: "System Language",
      theme: "Dark Mode",
      currency: "Default Currency",
      timezone: "Timezone",
      slotDuration: "Slot Duration (min)",
      bufferTime: "Buffer Time (min)",
      paperSize: "Paper Size",
      showLogo: "Print Logo on Rx",
      autoBackup: "Daily Auto-Backup",
      smsReminders: "SMS Reminders",
      emailReminders: "Email Reminders",
      marketing: "Marketing Messages",
      sessionTimeout: "Auto Logout (Security)"
    }
  },
  de: {
    title: "Systemeinstellungen",
    subtitle: "Verwalten Sie alle Klinikdetails an einem Ort",
    save: "Änderungen speichern",
    tabs: {
      general: "Allgemein",
      appointments: "Termine",
      printing: "Drucken & Rx",
      notifications: "Benachrichtigungen",
      security: "Sicherheit & Daten"
    },
    sections: {
      appearance: "Aussehen & Sprache",
      clinicInfo: "Geschäftsdaten",
      schedule: "Buchungsregeln",
      prescription: "Rezeptanpassung",
      backup: "Datensicherung"
    },
    labels: {
      language: "Systemsprache",
      theme: "Dunkelmodus",
      currency: "Standardwährung",
      timezone: "Zeitzone",
      slotDuration: "Dauer (Min)",
      bufferTime: "Pufferzeit (Min)",
      paperSize: "Papierformat",
      showLogo: "Logo drucken",
      autoBackup: "Tägliches Backup",
      smsReminders: "SMS-Erinnerungen",
      emailReminders: "E-Mail-Erinnerungen",
      marketing: "Marketing-Nachrichten",
      sessionTimeout: "Autom. Abmeldung"
    }
  }
};

export default function SettingsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  // @ts-ignore
  const t = TEXTS[locale] || TEXTS.en;

  // --- States ---
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState(locale);
  const [currency, setCurrency] = useState("EGP");
  const [slotDuration, setSlotDuration] = useState("20");
  const [paperSize, setPaperSize] = useState("A5");
  const [autoBackup, setAutoBackup] = useState(true);
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    marketing: false
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full pb-20" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-gray-600 dark:text-gray-300" />
            {t.title}
          </h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        <Button className="bg-[#0582EB] hover:bg-blue-600 text-white gap-2 shadow-lg">
          <Save className="h-4 w-4" /> {t.save}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="bg-white dark:bg-gray-800 p-1.5 h-auto rounded-xl border border-gray-200 dark:border-gray-700 w-full flex flex-wrap md:flex-nowrap mb-6">
          <TabsTrigger value="general" className="flex-1 gap-2 py-2.5 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Globe className="h-4 w-4" /> {t.tabs.general}
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex-1 gap-2 py-2.5 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
            <CalendarClock className="h-4 w-4" /> {t.tabs.appointments}
          </TabsTrigger>
          <TabsTrigger value="printing" className="flex-1 gap-2 py-2.5 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
            <Printer className="h-4 w-4" /> {t.tabs.printing}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 gap-2 py-2.5 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Bell className="h-4 w-4" /> {t.tabs.notifications}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 gap-2 py-2.5 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800">
            <Shield className="h-4 w-4" /> {t.tabs.security}
          </TabsTrigger>
        </TabsList>

        {/* --- 1. GENERAL TAB --- */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-500" /> {t.sections.appearance}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t.labels.language}</Label>
                  <Select value={lang} onValueChange={setLang}>
                    <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label>{t.labels.timezone}</Label>
                   <Select defaultValue="cairo">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cairo">(GMT+03:00) Cairo</SelectItem>
                      <SelectItem value="riyadh">(GMT+03:00) Riyadh</SelectItem>
                      <SelectItem value="london">(GMT+00:00) London</SelectItem>
                      <SelectItem value="berlin">(GMT+01:00) Berlin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.labels.theme}</Label>
                  <p className="text-xs text-gray-500">{darkMode ? "Dark mode active" : "Light mode active"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-gray-400" />
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  <Moon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-500" /> {t.sections.clinicInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label>{t.labels.currency}</Label>
                 <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">EGP (Egyptian Pound)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="SAR">SAR (Saudi Riyal)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                 <Label>{isRTL ? "بداية السنة المالية" : "Fiscal Year Start"}</Label>
                 <Select defaultValue="jan">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">{isRTL ? "يناير (01)" : "January (01)"}</SelectItem>
                      <SelectItem value="jul">{isRTL ? "يوليو (07)" : "July (07)"}</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- 2. APPOINTMENTS TAB --- */}
        <TabsContent value="appointments" className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <Clock className="h-5 w-5 text-purple-600" /> {t.sections.schedule}
               </CardTitle>
               <CardDescription>
                  {isRTL ? "تحديد مدة الكشف يؤثر على الجدول الزمني للعيادة" : "Setting slot duration affects the clinic timeline"}
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label>{t.labels.slotDuration}</Label>
                      <div className="flex items-center gap-2">
                         <Input type="number" value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)} />
                         <span className="text-sm text-gray-500">{isRTL ? "دقيقة" : "Min"}</span>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label>{t.labels.bufferTime}</Label>
                      <Select defaultValue="5">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">{isRTL ? "بدون راحة" : "No Buffer"}</SelectItem>
                          <SelectItem value="5">5 {isRTL ? "دقائق" : "Min"}</SelectItem>
                          <SelectItem value="10">10 {isRTL ? "دقائق" : "Min"}</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                   <div className="space-y-1">
                      <Label>{isRTL ? "السماح بالحجز الزائد (Overbooking)" : "Allow Overbooking"}</Label>
                      <p className="text-xs text-gray-500">{isRTL ? "إضافة مواعيد يدوية حتى لو الجدول ممتلئ" : "Add manual appointments even if slots are full"}</p>
                   </div>
                   <Switch />
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* --- 3. PRINTING TAB --- */}
        <TabsContent value="printing" className="space-y-6">
          <Card>
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <Printer className="h-5 w-5 text-emerald-600" /> {t.sections.prescription}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label>{t.labels.paperSize}</Label>
                     <Select value={paperSize} onValueChange={setPaperSize}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4 (Full Page)</SelectItem>
                          <SelectItem value="A5">A5 (Half Page)</SelectItem>
                          <SelectItem value="Thermal">Thermal (Roll)</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                     <Label>{isRTL ? "هامش الطباعة (Padding)" : "Print Padding"}</Label>
                     <Input type="number" placeholder="10px" />
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                     <Label>{t.labels.showLogo}</Label>
                     <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                     <Label>{isRTL ? "إظهار التوقيع الإلكتروني" : "Show Digital Signature"}</Label>
                     <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                     <Label>{isRTL ? "طباعة تذييل الصفحة (Footer)" : "Print Footer"}</Label>
                     <Switch />
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- 4. NOTIFICATIONS TAB --- */}
        <TabsContent value="notifications" className="space-y-6">
           <Card>
             <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-600" /> {t.tabs.notifications}
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-2">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Smartphone className="h-5 w-5"/></div>
                      <div>
                         <Label className="block">{t.labels.smsReminders}</Label>
                         <p className="text-xs text-gray-500">{isRTL ? "رسالة قبل الموعد بـ 24 ساعة" : "Send 24h before appointment"}</p>
                      </div>
                   </div>
                   <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications({...notifications, sms: v})} />
                </div>
                
                <Separator />

                <div className="flex items-center justify-between p-2">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Mail className="h-5 w-5"/></div>
                      <div>
                         <Label className="block">{t.labels.emailReminders}</Label>
                         <p className="text-xs text-gray-500">{isRTL ? "تأكيد الحجز والإلغاء" : "Booking confirmation & cancellation"}</p>
                      </div>
                   </div>
                   <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications({...notifications, email: v})} />
                </div>
                
                <Separator />

                <div className="flex items-center justify-between p-2">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><Building className="h-5 w-5"/></div>
                      <div>
                         <Label className="block">{t.labels.marketing}</Label>
                         <p className="text-xs text-gray-500">{isRTL ? "عروض وخصومات العيادة للمرضى" : "Clinic offers & discounts to patients"}</p>
                      </div>
                   </div>
                   <Switch checked={notifications.marketing} onCheckedChange={(v) => setNotifications({...notifications, marketing: v})} />
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* --- 5. SECURITY & DATA TAB --- */}
        <TabsContent value="security" className="space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5 text-slate-600" /> {t.sections.backup}
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <Label>{t.labels.autoBackup}</Label>
                       <p className="text-xs text-gray-500">{isRTL ? "يتم الحفظ في الساعة 12:00 صباحاً" : "Runs at 12:00 AM daily"}</p>
                    </div>
                    <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                 </div>
                 
                 <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-800">
                    <div>
                       <h4 className="font-bold text-sm">{isRTL ? "تصدير بيانات المرضى" : "Export Patient Data"}</h4>
                       <p className="text-xs text-gray-500">CSV, Excel Format</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                       <Database className="h-4 w-4" /> {isRTL ? "تصدير الآن" : "Export Now"}
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-red-100 dark:border-red-900/30">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                    <Lock className="h-5 w-5" /> {isRTL ? "أمان الجلسة" : "Session Security"}
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>{t.labels.sessionTimeout}</Label>
                    <Select defaultValue="30">
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="15">15 {isRTL ? "دقيقة" : "Min"}</SelectItem>
                          <SelectItem value="30">30 {isRTL ? "دقيقة" : "Min"}</SelectItem>
                          <SelectItem value="60">1 {isRTL ? "ساعة" : "Hour"}</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <Button variant="ghost" className="text-red-500 w-full justify-start hover:bg-red-50 hover:text-red-600 px-0">
                    <RefreshCw className="h-4 w-4 mx-2" /> {isRTL ? "تسجيل الخروج من كل الأجهزة" : "Log out from all devices"}
                 </Button>
              </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}