"use client";

import React, { useState } from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LifeBuoy, MessageSquare, Phone, Mail, 
  Upload, AlertCircle, CheckCircle2, Clock, HelpCircle, 
  ChevronDown, ChevronUp, History, Send, Search, Download,
  BookOpen, PlayCircle, MonitorPlay, X, Globe,
  FileText
} from "lucide-react";
import { useLocale } from "next-intl";

// --- 1. Dictionaries for UI Text (AR, EN, DE) ---
const TEXTS = {
  ar: {
    header: {
      title: "مركز الدعم والمساعدة",
      subtitle: "واجهتك مشكلة؟ لا تقلق، فريقنا جاهز لمساعدتك. تصفح الدليل أو افتح تذكرة وسنقوم بالحل فوراً.",
      systemStatus: "النظام يعمل بكفاءة",
      userGuide: "دليل المستخدم"
    },
    tabs: {
      newTicket: "طلب دعم جديد",
      history: "تذاكري السابقة"
    },
    form: {
      title: "تفاصيل المشكلة",
      desc: "ساعدنا في فهم المشكلة لحلها بشكل أسرع.",
      category: "نوع المشكلة",
      categoryPh: "اختر التصنيف",
      module: "الجزء المتأثر (الموديول)",
      modulePh: "مثال: الروشتة، المخزون...",
      subject: "عنوان المشكلة",
      subjectPh: "اكتب عنوان مختصر...",
      message: "وصف المشكلة بالتفصيل",
      messagePh: "يرجى ذكر الخطوات التي أدت للمشكلة...",
      bestTime: "أفضل وقت للاتصال بك",
      priority: "الأهمية",
      attachments: "المرفقات",
      dragDrop: "اسحب الملفات هنا أو اضغط للرفع",
      submit: "إرسال الطلب",
      priorities: { low: "منخفض", medium: "متوسط", high: "عالي" }
    },
    actions: {
      videos: "فيديوهات تعليمية",
      videosDesc: "شاهد شرح للميزات",
      remote: "السماح بالدخول عن بعد",
      remoteDesc: "للدعم الفني فقط",
      contact: "تواصل مباشر",
      hours: "ساعات العمل: 9 ص - 5 م"
    },
    faq: {
      title: "الأسئلة الشائعة",
      search: "ابحث عن سؤال...",
      noResults: "لا توجد نتائج"
    },
    modal: {
      successTitle: "اطمئن، رسالتك وصلتنا!",
      successDesc: "تم إنشاء تذكرة رقم #8920 بنجاح. فريقنا الفني يراجع المشكلة حالياً وسنقوم بالرد عليك خلال ساعتين كحد أقصى.",
      btnOk: "حسناً، شكراً",
      btnTrack: "متابعة التذكرة",
      guideTitle: "دليل استخدام النظام v2.0",
      contents: "الفهرس",
      download: "تحميل PDF",
      welcome: "مرحباً بك في نظام العيادة الذكي",
      welcomeDesc: "هذا الدليل سيساعدك على فهم كل جزء في النظام لضمان أفضل تجربة استخدام.",
      tip: "نصيحة: يمكنك مشاهدة فيديو شرح لهذا القسم."
    }
  },
  en: {
    header: {
      title: "Help & Support Center",
      subtitle: "Facing an issue? Don't worry. Browse our docs or open a ticket and we'll fix it immediately.",
      systemStatus: "System Operational",
      userGuide: "User Guide"
    },
    tabs: {
      newTicket: "New Request",
      history: "My Tickets"
    },
    form: {
      title: "Issue Details",
      desc: "Help us understand the issue to solve it faster.",
      category: "Category",
      categoryPh: "Select Category",
      module: "Affected Module",
      modulePh: "Ex: Rx, Inventory...",
      subject: "Subject",
      subjectPh: "Brief summary...",
      message: "Detailed Description",
      messagePh: "Please list steps to reproduce...",
      bestTime: "Best Time to Call",
      priority: "Priority",
      attachments: "Attachments",
      dragDrop: "Drag files here or click to upload",
      submit: "Submit Ticket",
      priorities: { low: "Low", medium: "Medium", high: "High" }
    },
    actions: {
      videos: "Video Tutorials",
      videosDesc: "Watch how-to videos",
      remote: "Grant Remote Access",
      remoteDesc: "For support team only",
      contact: "Direct Contact",
      hours: "Hours: 9 AM - 5 PM"
    },
    faq: {
      title: "Frequently Asked Questions",
      search: "Search questions...",
      noResults: "No results found"
    },
    modal: {
      successTitle: "Rest assured, we got it!",
      successDesc: "Ticket #8920 created successfully. Our tech team is reviewing it and will reply within 2 hours max.",
      btnOk: "Okay, Thanks",
      btnTrack: "Track Ticket",
      guideTitle: "System User Guide v2.0",
      contents: "Contents",
      download: "Download PDF",
      welcome: "Welcome to Smart Clinic System",
      welcomeDesc: "This guide helps you understand every part of the system for the best experience.",
      tip: "Tip: Watch a video tutorial for this section."
    }
  },
  de: {
    header: {
      title: "Hilfe- & Support-Center",
      subtitle: "Haben Sie ein Problem? Keine Sorge. Durchsuchen Sie unsere Dokumentation oder erstellen Sie ein Ticket.",
      systemStatus: "System Betriebsbereit",
      userGuide: "Benutzerhandbuch"
    },
    tabs: {
      newTicket: "Neue Anfrage",
      history: "Meine Tickets"
    },
    form: {
      title: "Problem-Details",
      desc: "Helfen Sie uns, das Problem zu verstehen, um es schneller zu lösen.",
      category: "Kategorie",
      categoryPh: "Kategorie wählen",
      module: "Betroffenes Modul",
      modulePh: "z.B. Rezepte, Inventar...",
      subject: "Betreff",
      subjectPh: "Kurze Zusammenfassung...",
      message: "Detaillierte Beschreibung",
      messagePh: "Bitte Schritte zur Reproduktion auflisten...",
      bestTime: "Beste Anrufzeit",
      priority: "Priorität",
      attachments: "Anhänge",
      dragDrop: "Dateien hierher ziehen oder klicken",
      submit: "Ticket absenden",
      priorities: { low: "Niedrig", medium: "Mittel", high: "Hoch" }
    },
    actions: {
      videos: "Video-Anleitungen",
      videosDesc: "Erklärvideos ansehen",
      remote: "Fernzugriff gewähren",
      remoteDesc: "Nur für Support-Team",
      contact: "Direktkontakt",
      hours: "Zeiten: 09:00 - 17:00"
    },
    faq: {
      title: "Häufig gestellte Fragen (FAQ)",
      search: "Fragen suchen...",
      noResults: "Keine Ergebnisse gefunden"
    },
    modal: {
      successTitle: "Keine Sorge, wir kümmern uns!",
      successDesc: "Ticket #8920 erfolgreich erstellt. Unser Technik-Team prüft es und antwortet innerhalb von 2 Stunden.",
      btnOk: "Alles klar, danke",
      btnTrack: "Ticket verfolgen",
      guideTitle: "System-Benutzerhandbuch v2.0",
      contents: "Inhalt",
      download: "PDF herunterladen",
      welcome: "Willkommen beim Smart Clinic System",
      welcomeDesc: "Dieser Leitfaden hilft Ihnen, jeden Teil des Systems für die beste Erfahrung zu verstehen.",
      tip: "Tipp: Sehen Sie sich ein Video-Tutorial zu diesem Abschnitt an."
    }
  }
};

// --- 2. Data Content (Dynamic based on Locale) ---
const FAQ_DATA = {
  ar: [
    { q: "كيف أقوم بتغيير كلمة المرور؟", a: "اذهب إلى صفحة الحساب > الأمان > تغيير كلمة المرور." },
    { q: "هل التطبيق يعمل بدون إنترنت؟", a: "لا، يتطلب النظام اتصالاً بالإنترنت لحفظ البيانات سحابياً." },
    { q: "كيف أقوم بترقية الباقة؟", a: "من صفحة الحساب > الاشتراك، اضغط على 'ترقية الخطة'." },
    { q: "الطابعة لا تطبع الروشتة؟", a: "تأكد من تثبيت تعريف الطابعة وتحديد حجم الورق A5 من الإعدادات." },
  ],
  en: [
    { q: "How do I change my password?", a: "Go to Account Page > Security > Change Password." },
    { q: "Does the app work offline?", a: "No, an internet connection is required to sync data to the cloud." },
    { q: "How do I upgrade my plan?", a: "From Account Page > Subscription, click on 'Upgrade Plan'." },
    { q: "Printer not printing Rx?", a: "Ensure printer drivers are installed and A5 paper size is selected in settings." },
  ],
  de: [
    { q: "Wie ändere ich mein Passwort?", a: "Gehen Sie zu Konto > Sicherheit > Passwort ändern." },
    { q: "Funktioniert die App offline?", a: "Nein, eine Internetverbindung ist erforderlich." },
    { q: "Wie aktualisiere ich meinen Plan?", a: "Unter Konto > Abonnement, klicken Sie auf 'Plan upgraden'." },
    { q: "Drucker druckt kein Rezept?", a: "Stellen Sie sicher, dass der Treiber installiert ist und das Format A5 gewählt wurde." },
  ]
};

const GUIDE_SECTIONS = {
  ar: [
    { id: 'start', title: 'البداية السريعة', content: 'شرح كيفية إنشاء حساب وإعداد العيادة لأول مرة...' },
    { id: 'patients', title: 'إدارة المرضى', content: 'كيفية إضافة ملف مريض جديد، وتسجيل التاريخ المرضي...' },
    { id: 'appointments', title: 'المواعيد والحجوزات', content: 'طريقة تنظيم الجدول، الحجز السريع، وإلغاء المواعيد...' },
  ],
  en: [
    { id: 'start', title: 'Quick Start', content: 'How to create an account and set up the clinic for the first time...' },
    { id: 'patients', title: 'Patient Management', content: 'How to add a new patient file and record medical history...' },
    { id: 'appointments', title: 'Appointments', content: 'Organizing the schedule, quick booking, and cancellations...' },
  ],
  de: [
    { id: 'start', title: 'Schnellstart', content: 'So erstellen Sie ein Konto und richten die Klinik ein...' },
    { id: 'patients', title: 'Patientenverwaltung', content: 'Hinzufügen einer neuen Patientenakte und Anamnese...' },
    { id: 'appointments', title: 'Termine', content: 'Organisation des Zeitplans, Schnellbuchung und Stornierungen...' },
  ]
};

export default function SupportPage() {
  const locale = useLocale(); // 'ar', 'en', or 'de'
  const isRTL = locale === 'ar';
  
  // Select the correct translation object based on locale, fallback to English
  // @ts-ignore
  const t = TEXTS[locale] || TEXTS.en;
  // @ts-ignore
  const currentFaqs = FAQ_DATA[locale] || FAQ_DATA.en;
  // @ts-ignore
  const currentGuide = GUIDE_SECTIONS[locale] || GUIDE_SECTIONS.en;

  const [activeTab, setActiveTab] = useState("new-ticket");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => { setShowSuccessModal(true); }, 800);
  };

  const filteredFaqs = currentFaqs.filter((item: any) => 
     item.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
     item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen pb-20" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* 1. Header Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <LifeBuoy className="h-8 w-8 text-blue-400" />
                    {t.header.title}
                </h1>
                <p className="text-blue-200 max-w-xl">
                    {t.header.subtitle}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => setShowDocsModal(true)} className="bg-white text-blue-900 hover:bg-blue-50 gap-2 font-bold shadow-lg transition-transform active:scale-95">
                    <BookOpen className="h-4 w-4" /> {t.header.userGuide}
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg backdrop-blur-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-emerald-100">{t.header.systemStatus}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TICKET SYSTEM */}
        <div className="xl:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700 w-full md:w-auto flex">
                    <TabsTrigger value="new-ticket" className="flex-1 gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                        <MessageSquare className="h-4 w-4" /> {t.tabs.newTicket}
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 gap-2">
                        <History className="h-4 w-4" /> {t.tabs.history}
                    </TabsTrigger>
                </TabsList>

                {/* New Ticket Form */}
                <TabsContent value="new-ticket" className="mt-4">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>{t.form.title}</CardTitle>
                            <CardDescription>{t.form.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleTicketSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.form.category}</label>
                                        <Select required>
                                            <SelectTrigger><SelectValue placeholder={t.form.categoryPh} /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tech">Technical Issue</SelectItem>
                                                <SelectItem value="bill">Billing</SelectItem>
                                                <SelectItem value="account">Account Access</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.form.module}</label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder={t.form.modulePh} /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rx">Prescriptions (Rx)</SelectItem>
                                                <SelectItem value="appointments">Appointments</SelectItem>
                                                <SelectItem value="inventory">Inventory</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t.form.subject}</label>
                                    <Input required placeholder={t.form.subjectPh} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t.form.message}</label>
                                    <Textarea required rows={5} placeholder={t.form.messagePh} />
                                </div>

                                {/* Advanced Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" /> 
                                            {t.form.bestTime}
                                        </label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="--:--" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="morning">09:00 - 12:00</SelectItem>
                                                <SelectItem value="afternoon">12:00 - 16:00</SelectItem>
                                                <SelectItem value="evening">16:00 - 20:00</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-gray-500" />
                                            {t.form.priority}
                                        </label>
                                        <div className="flex gap-2">
                                            {['low', 'medium', 'high'].map((p) => (
                                                <div key={p} className="flex-1 text-center">
                                                    <input type="radio" name="priority" id={p} className="peer hidden" />
                                                    <label htmlFor={p} className="block p-2 text-xs font-bold border rounded-lg cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:bg-gray-100 transition-all">
                                                        {/* @ts-ignore */}
                                                        {t.form.priorities[p]}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t.form.attachments}</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">{t.form.dragDrop}</p>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 text-lg bg-[#0582EB] hover:bg-blue-600 shadow-lg shadow-blue-500/20">
                                    <Send className={`h-5 w-5 mx-2 ${isRTL ? 'rotate-180' : ''}`} /> {t.form.submit}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <Card><CardContent className="p-8 text-center text-gray-500">{t.faq.noResults}</CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>

        {/* RIGHT COLUMN: RESOURCES */}
        <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card className="border-none shadow-md bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-lg">{isRTL ? "إجراءات سريعة" : (locale === 'de' ? "Schnellaktionen" : "Quick Actions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => window.open('https://youtube.com', '_blank')}>
                        <PlayCircle className="h-5 w-5 text-red-500" />
                        <div className="text-start">
                            <div className="text-sm font-bold text-gray-800 dark:text-white">{t.actions.videos}</div>
                            <div className="text-[10px] text-gray-500">{t.actions.videosDesc}</div>
                        </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12 border-blue-200 bg-blue-50 hover:bg-blue-100">
                        <MonitorPlay className="h-5 w-5 text-[#0582EB]" />
                        <div className="text-start">
                            <div className="text-sm font-bold text-blue-900">{t.actions.remote}</div>
                            <div className="text-[10px] text-blue-700">{t.actions.remoteDesc}</div>
                        </div>
                    </Button>
                </CardContent>
            </Card>

            {/* Smart FAQ */}
            <Card className="border-gray-200 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-[#0582EB]" />
                        {t.faq.title}
                    </CardTitle>
                    <div className="relative mt-2">
                        <Search className={`absolute top-2.5 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                        <Input 
                            className={`${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} bg-gray-50`} 
                            placeholder={t.faq.search} 
                            onChange={(e) => setFaqSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {filteredFaqs.length > 0 ? filteredFaqs.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded-lg overflow-hidden">
                            <button 
                                onClick={() => setExpandedFaq(expandedFaq === item.q ? null : item.q)}
                                className="w-full p-3 text-start text-sm font-medium hover:bg-gray-50 flex justify-between items-center"
                            >
                                {item.q}
                                {expandedFaq === item.q ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                            {expandedFaq === item.q && (
                                <div className="p-3 bg-gray-50 text-xs text-gray-600 leading-relaxed border-t animate-in slide-in-from-top-1">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    )) : (
                        <p className="text-center text-sm text-gray-400 py-4">{t.faq.noResults}</p>
                    )}
                </CardContent>
            </Card>

            {/* Direct Contact */}
            <div className="bg-slate-900 text-slate-300 rounded-xl p-5 shadow-lg">
                <h3 className="text-white font-bold mb-4">{t.actions.contact}</h3>
                <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-400" />
                        <span>+20 123 456 7890</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-blue-400" />
                        <span>support@clinica.com</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 border-t border-slate-700 pt-2">
                        {t.actions.hours}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MODAL 1: SUCCESS POPUP --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.modal.successTitle}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{t.modal.successDesc}</p>
                <div className="flex flex-col gap-2">
                    <Button onClick={() => setShowSuccessModal(false)} className="w-full bg-green-600 hover:bg-green-700 text-white">{t.modal.btnOk}</Button>
                    <Button variant="ghost" onClick={() => setShowSuccessModal(false)} className="text-gray-400">{t.modal.btnTrack}</Button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL 2: USER GUIDE --- */}
      {showDocsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden animate-in slide-in-from-bottom-5">
                
                {/* Sidebar */}
                <div className="w-1/3 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto hidden md:block">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 px-2">{t.modal.contents}</h3>
                    <div className="space-y-1">
                        {currentGuide.map((sec: any) => (
                            <button key={sec.id} className="w-full text-start px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
                                <FileText className="h-3 w-3" /> {sec.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full">
                    <div className="p-4 border-b flex justify-between items-center bg-white dark:bg-gray-900">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-[#0582EB]" />
                            {t.modal.guideTitle}
                        </h2>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => alert("Downloading...")} className="gap-2">
                                <Download className="h-4 w-4" /> PDF
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setShowDocsModal(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
                        <div className="prose dark:prose-invert max-w-none">
                            <h1>{t.modal.welcome}</h1>
                            <p className="text-gray-600">{t.modal.welcomeDesc}</p>
                            <hr className="my-6" />
                            {currentGuide.map((sec: any) => (
                                <div key={sec.id} className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{sec.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{sec.content}</p>
                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
                                        💡 {t.modal.tip}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}