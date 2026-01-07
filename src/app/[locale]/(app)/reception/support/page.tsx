"use client";

import React, { useState } from "react";
import {
  LifeBuoy,
  MessageSquare,
  Phone,
  Mail,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Send,
  MonitorSmartphone,
  CheckCircle2,
  AlertCircle,
  Headphones
} from "lucide-react";
import { useTranslations } from "next-intl";

// --- Mock Data: FAQs ---
const faqs = [
  {
    question: "طابعة الفواتير لا تعمل، ماذا أفعل؟",
    answer: "تأكد أولاً من توصيل كابل USB والكهرباء. إذا كانت اللمبة حمراء، تأكد من وجود ورق. جرب إعادة تشغيل الطابعة من الزر الخلفي."
  },
  {
    question: "كيف يمكنني تغيير كلمة المرور؟",
    answer: "اذهب إلى صفحة 'الإعدادات' من القائمة الجانبية، ثم اختر تبويب 'الأمان'. ستجد خيار تغيير كلمة المرور هناك."
  },
  {
    question: "السيستم بطيء جداً، هل المشكلة من عندي؟",
    answer: "غالباً المشكلة في اتصال الإنترنت. حاول فتح موقع آخر (مثل Google) للتأكد. إذا استمرت المشكلة، اتصل بالدعم الفني."
  },
  {
    question: "أدخلت بيانات مريض بالخطأ، كيف أحذفها؟",
    answer: "لا يمكنك حذف مريض بالكامل لأسباب قانونية، ولكن يمكنك تعديل بياناته أو تغيير حالته إلى 'غير نشط' من صفحة المرضى."
  },
];

// --- Components ---

// 1. FAQ Item
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-right bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-bold text-gray-800 dark:text-white text-sm md:text-base">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

// 2. Contact Card
const ContactCard = ({ icon: Icon, title, value, action, color }: any) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:shadow-md dark:hover:shadow-none transition-shadow">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white dir-ltr text-right">{value}</p>
    </div>
    {action && (
      <button className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg transition-colors">
        {action}
      </button>
    )}
  </div>
);

// --- Main Page ---
export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({ subject: "", description: "", priority: "normal" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTicketForm({ subject: "", description: "", priority: "normal" });
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8 font-sans text-gray-900 dark:text-white">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Headphones className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          مركز المساعدة والدعم
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">هل تواجه مشكلة؟ نحن هنا لمساعدتك على حلها بأسرع وقت.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Contact & Remote Support */}
        <div className="space-y-6 lg:col-span-1">

          {/* Contact Methods */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 px-1">تواصل معنا</h3>
            <ContactCard
              icon={Phone}
              title="الخط الساخن"
              value="19000"
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              action="اتصال"
            />
            <ContactCard
              icon={MessageSquare}
              title="واتساب الدعم"
              value="+20 100 000 0000"
              color="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              action="محادثة"
            />
            <ContactCard
              icon={Mail}
              title="البريد الإلكتروني"
              value="support@clinica.com"
              color="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
            />
          </div>

          {/* Remote Access Helper */}
          <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <MonitorSmartphone className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold">الدعم عن بعد</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                قد يطلب منك موظف الدعم تحميل برنامج AnyDesk للدخول على جهازك وحل المشكلة.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold transition-colors">
                تحميل AnyDesk
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
          </div>

        </div>

        {/* Middle & Right Column: FAQ & Ticket Form */}
        <div className="lg:col-span-2 space-y-8">

          {/* Submit Ticket Form */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <LifeBuoy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">إبلاغ عن مشكلة (تذكرة دعم)</h2>
            </div>

            {showSuccess ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 dark:text-green-300 text-lg">تم استلام طلبك بنجاح!</h3>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">رقم التذكرة: #TR-9982. سيتم التواصل معك خلال 30 دقيقة.</p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-4 text-sm text-green-700 dark:text-green-400 font-medium hover:underline"
                >
                  إرسال تذكرة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان المشكلة</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الطابعة لا تطبع..."
                      value={ticketForm.subject}
                      onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الأهمية</label>
                    <select
                      value={ticketForm.priority}
                      onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">عادية</option>
                      <option value="normal">متوسطة</option>
                      <option value="high">عاجلة جداً</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وصف المشكلة بالتفصيل</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="اشرح المشكلة وماذا حدث قبل ظهورها..."
                    value={ticketForm.description}
                    onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    سيتم إرسال إشعار للمدير التقني فوراً
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !ticketForm.subject}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 ml-1" />
                        إرسال الطلب
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* FAQs Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-1">
              <FileQuestion className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">الأسئلة الشائعة (FAQ)</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}