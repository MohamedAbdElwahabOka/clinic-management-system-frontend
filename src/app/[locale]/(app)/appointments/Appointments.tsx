"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  RefreshCw,
  XCircle,
  CheckCircle,
  Search as SearchIcon,
  ChevronRight,
  ChevronLeft,
  Filter,
  Plus,
  Calendar as CalendarIcon,
  Grid,
  List,
  Clock as ClockIcon,
  Bell
} from "lucide-react";
import { useTranslations } from "next-intl";
// import type { Locale } from "@/types";

interface Appointment {
  id: number;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "Booked" | "Canceled" | "Confirmed" | "Completed";
  type: "consultation" | "follow-up" | "emergency";
  duration: number; // مدة الموعد بالدقائق
  notes?: string;
}

const appointmentsData: Appointment[] = [
  { id: 1, patientName: "محمد علي", date: "2025-08-30", time: "10:00", status: "Booked", type: "consultation", duration: 30 },
  { id: 2, patientName: "سارة محمود", date: "2025-08-31", time: "11:30", status: "Booked", type: "follow-up", duration: 20 },
  { id: 3, patientName: "علي حسن", date: "2025-08-30", time: "09:00", status: "Booked", type: "consultation", duration: 45 },
  { id: 4, patientName: "ليلى محمد", date: "2025-08-31", time: "14:00", status: "Booked", type: "follow-up", duration: 30 },
  { id: 5, patientName: "سلمان علي", date: "2025-08-25", time: "15:30", status: "Confirmed", type: "emergency", duration: 60 },
  { id: 6, patientName: "هالة يوسف", date: "2025-08-26", time: "12:00", status: "Booked", type: "consultation", duration: 30 },
  { id: 7, patientName: "ناصر عبد الله", date: "2025-08-27", time: "16:00", status: "Confirmed", type: "follow-up", duration: 40 },
  { id: 8, patientName: "فاطمة إبراهيم", date: "2025-08-26", time: "10:30", status: "Booked", type: "consultation", duration: 45 },
  { id: 9, patientName: "يوسف أحمد", date: "2025-09-11", time: "09:30", status: "Completed", type: "follow-up", duration: 30, notes: "يحتاج متابعة بعد أسبوعين" },
];

type ViewMode = "day" | "week" | "month" | "list";
type TimeOfDayFilter = "all" | "morning" | "afternoon";
export default function AppointmentsPage() {
// export default function AppointmentsPage({ locale }: { locale: Locale }) {
  const t = useTranslations("Appointments");
  // const translate = React.useCallback(
  //   (key: string, defaultValue?: string) => {
  //     const translation = t(key);
  //     return translation === key && defaultValue ? defaultValue : translation;
  //   },
  //   [t]
  // );


  const [appointments, setAppointments] = useState(appointmentsData);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [searchText, setSearchText] = useState("");
  const [filterStatus] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [timeOfDayFilter] = useState<TimeOfDayFilter>("all");
  // const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [quickAdd, setQuickAdd] = useState(false);
  const [newAppointment, setNewAppointment] = useState({patientName: "", date: selectedDate, time: "09:00"});
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [newApptType, setNewApptType] = useState<"Booked" | "Confirmed">("Booked");



  const [confirmAppt, setConfirmAppt] = useState<Appointment | null>(null);

  // جدول الخدمات بناءً على النوع
const categoryServiceMap: Record<string, string> = {
  consultation: "كشف - 500 جنيه",
  "follow-up": "متابعة - 300 جنيه",
  emergency: "طوارئ - 700 جنيه",
};

// طرق الدفع
const paymentOptions = [
  { value: "كاش", label: "كاش", image: "/paymentOptions/cash.png" },
  { value: "فوري", label: "فوري", image: "/paymentOptions/fawry.png" },
  { value: "فيزا", label: "فيزا", image: "/paymentOptions/visa.png" },
  { value: "محفظة إلكترونية", label: "محفظة إلكترونية", image: "/paymentOptions/wallet.png" },
  { value: "انستا باي", label: "انستا باي", image: "/paymentOptions/instapay.png" },
];


// تحديث الزر لفتح المودال
function handleSaveConfirm(
  type: Appointment["type"],
  service: string,
  paymentMethod: string
) {
  if (!confirmAppt) return;

  setAppointments((prev) =>
    prev.map((a) =>
      a.id === confirmAppt.id
        ? {
            ...a,
            status: "Confirmed",
            type,           // ✅ النوع الجديد
            service,
            paymentMethod,
          }
        : a
    )
  );
  setConfirmAppt(null);
}




const ConfirmModal = () => {
  const [selectedType, setSelectedType] = useState<Appointment["type"]>(
    confirmAppt?.type || "consultation"
  );
  const [paymentMethod, setPaymentMethod] = useState("");

  if (!confirmAppt) return null;

  const service = categoryServiceMap[selectedType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
        <h3 className="text-lg font-bold text-center">تأكيد الموعد</h3>
        <p className="text-sm text-gray-600 text-center">
          المريض: <b>{confirmAppt.patientName}</b>
        </p>

        {/* اختيار نوع الموعد */}
        <div>
          <label className="block mb-1">نوع الموعد</label>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as Appointment["type"])
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="consultation">استشارة</option>
            <option value="follow-up">متابعة</option>
            <option value="emergency">طوارئ</option>
          </select>
        </div>

        {/* الخدمة */}
        <div>
          <label className="block mb-1">الخدمة</label>
          <input
            type="text"
            value={service}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* طريقة الدفع */}
        <div>
          <label className="block mb-1">طريقة الدفع</label>
          <div className="grid grid-cols-2 gap-3">
            {paymentOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentMethod(opt.value)}
                className={`flex flex-col items-center border rounded-lg p-3 hover:shadow-md transition ${
                  paymentMethod === opt.value
                    ? "border-green-500 ring-2 ring-green-400"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={opt.image}
                  alt={opt.label}
                  width={10}
                  height={10}
                  className="w-10 h-10 object-contain mb-2"
                />
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setConfirmAppt(null)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={() =>
              handleSaveConfirm(selectedType, service, paymentMethod)
            }
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            disabled={!paymentMethod}
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
};



  // توليد أيام الأسبوع الحالي
  const weekDays = useMemo(() => {
    if (!selectedDate) return [];
    const currentDate = new Date(selectedDate);
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [selectedDate]);

  // استخراج تواريخ المواعيد (لتقسيم الأيام)
  const dates = useMemo(() => {
    const allDates = Array.from(new Set(appointments.map((a) => a.date))).sort();
    return allDates;
  }, [appointments]);

  // توليد أيام الشهر الحالي
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // أيام الشهر السابق
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayIndex = firstDay.getDay();
    
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        hasAppointments: false
      });
    }
    
    // أيام الشهر الحالي
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        hasAppointments: dates.includes(dateStr)
      });
    }
    
    // أيام الشهر التالي
    const daysNeeded = 42 - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        hasAppointments: false
      });
    }
    
    return days;
  }, [currentMonth, dates]);

  // ضبط التاريخ المختار تلقائيًا ليكون تاريخ اليوم
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [selectedDate]);

  // فلترة البيانات للمواعيد المعروضة
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // في وضع القائمة، لا نطبق فلترة التاريخ
      if (viewMode !== "list" && viewMode !== "month" && selectedDate && appt.date !== selectedDate) return false;

      if (filterStatus.length > 0 && !filterStatus.includes(appt.status)) return false;

      if (timeOfDayFilter !== "all") {
        const hour = parseInt(appt.time.split(':')[0]);
        if (timeOfDayFilter === "morning" && hour >= 12) return false;
        if (timeOfDayFilter === "afternoon" && hour < 12) return false;
      }

      if (searchText) {
        const q = searchText.trim().toLowerCase();
        if (!appt.patientName.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, selectedDate, filterStatus, searchText, timeOfDayFilter, viewMode]);

  // فلترة البيانات للإحصائيات (جميع المواعيد بدون فلترة التاريخ)
  const filteredAppointmentsForStats = useMemo(() => {
    return appointments.filter((appt) => {
      if (filterStatus.length > 0 && !filterStatus.includes(appt.status)) return false;

      if (timeOfDayFilter !== "all") {
        const hour = parseInt(appt.time.split(':')[0]);
        if (timeOfDayFilter === "morning" && hour >= 12) return false;
        if (timeOfDayFilter === "afternoon" && hour < 12) return false;
      }

      if (searchText) {
        const q = searchText.trim().toLowerCase();
        if (!appt.patientName.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, filterStatus, searchText, timeOfDayFilter]);

  // إحصائيات
  const stats = useMemo(() => {
    const total = filteredAppointmentsForStats.length;
    const booked = filteredAppointmentsForStats.filter((a) => a.status === "Booked").length;
    const canceled = filteredAppointmentsForStats.filter((a) => a.status === "Canceled").length;
    const confirmed = filteredAppointmentsForStats.filter((a) => a.status === "Confirmed").length;
    const completed = filteredAppointmentsForStats.filter((a) => a.status === "Completed").length;
    
    // إحصائيات حسب الوقت
    const morning = filteredAppointmentsForStats.filter(a => {
      const hour = parseInt(a.time.split(':')[0]);
      return hour < 12;
    }).length;
    
    const afternoon = filteredAppointmentsForStats.filter(a => {
      const hour = parseInt(a.time.split(':')[0]);
      return hour >= 12;
    }).length;
    
    // إحصائيات حسب النوع
    const consultation = filteredAppointmentsForStats.filter(a => a.type === "consultation").length;
    const followup = filteredAppointmentsForStats.filter(a => a.type === "follow-up").length;
    const emergency = filteredAppointmentsForStats.filter(a => a.type === "emergency").length;
    
    return { total, booked, canceled, confirmed, completed, morning, afternoon, consultation, followup, emergency };
  }, [filteredAppointmentsForStats]);

  // تنبيه للمواعيد القادمة (داخل ساعة من الآن)
  useEffect(() => {
    const now = new Date();
    const soonAppt = appointments.find((a) => {
      if (a.status !== "Booked" && a.status !== "Confirmed") return false;
      const apptDateTime = new Date(`${a.date}T${a.time}:00`);
      const diff = (apptDateTime.getTime() - now.getTime()) / (60 * 1000);
      return diff > 0 && diff <= 60;
    });
    if (soonAppt) {
      setAlertMsg(t("upcomingAlert", { patient: soonAppt.patientName, time: soonAppt.time }));
    } else {
      setAlertMsg(null);
    }
  }, [appointments, t]);

  // إجراءات الموعد
  function handleReschedule(id: number) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    setRescheduleAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleTime(appt.time);
  }

  function handleCancel(id: number) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Canceled" } : a))
    );
    alert(t("canceledAlert", { id }));
  }

  function handleConfirm(id: number) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "Confirmed" }
          : a
      )
    );
    alert(t("confirmedAlert", { id }));
  }

  function handleComplete(id: number) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "Completed" }
          : a
      )
    );
    alert(t("completedAlert", { id }));
  }

  // إعادة جدولة موعد
  function handleRescheduleSubmit() {
    if (!rescheduleAppt || !rescheduleDate || !rescheduleTime) return;
    
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rescheduleAppt.id
          ? { ...a, date: rescheduleDate, time: rescheduleTime }
          : a
      )
    );
    
    setRescheduleAppt(null);
    setRescheduleDate("");
    setRescheduleTime("");
    alert("تم إعادة جدولة الموعد بنجاح");
  }

  // إضافة موعد جديد
  function addNewAppointment() {
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    const newAppt: Appointment = {
      id: appointments.length + 1,
      patientName: newAppointment.patientName,
      date: newAppointment.date,
      time: newAppointment.time,
      status: "Booked",
      type: "consultation",
      duration: 30
    };
    
    setAppointments(prev => [...prev, newAppt]);
    setNewAppointment({patientName: "", date: selectedDate, time: "09:00"});
    setQuickAdd(false);
    alert("تم إضافة الموعد بنجاح");
  }

  // تحديث الموعد من المودال
  // function saveModalChanges(updated: Appointment) {
  //   setAppointments((prev) =>
  //     prev.map((a) => (a.id === updated.id ? { ...updated, status: updated.status } : a))
  //   );
  //   setModalAppt(null);
  // }

  // أزرار تصدير
  // function exportData(type: "pdf" | "excel") {
  //   alert(`تم تصدير البيانات كـ ${type.toUpperCase()} (هذا تنبيه توضيحي فقط)`);
  // }

  // التبديل بين الأشهر في التقويم
  const changeMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // اختيار تاريخ من التقويم
  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  // تنسيق التاريخ للعرض
  function formatDateToDay(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
  }

  // تنسيق الوقت للعرض
  // function formatTime(timeStr: string) {
  //   const [hours, minutes] = timeStr.split(':');
  //   return `${hours}:${minutes}`;
  // }

  // عرض المواعيد حسب طريقة العرض المختارة
  const renderAppointments = () => {
    switch(viewMode) {
      case "day":
        return renderDayView();
      case "week":
        return renderWeekView();
      case "month":
        return renderMonthView();
      case "list":
        return renderListView();
      default:
        return renderDayView();
    }
  };

  // عرض اليوم
  const renderDayView = () => {
    const hours = Array.from({length: 12}, (_, i) => i + 8); // من 8 صباحاً إلى 8 مساءً
    
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{selectedDate ? formatDateToDay(selectedDate) : "—"}</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setQuickAdd(true)}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              إضافة موعد
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
          {hours.map(hour => {
            const hourStart = `${hour.toString().padStart(2, '0')}:00`;
            const hourEnd = `${hour === 23 ? '00' : (hour + 1).toString().padStart(2, '0')}:00`;
            
            const hourAppointments = filteredAppointments.filter(appt => {
              const apptHour = parseInt(appt.time.split(':')[0]);
              return apptHour === hour;
            });
            
            return (
              <div key={hour} className="flex border-b border-gray-200 py-2">
                <div className="w-20 font-medium text-gray-500">
                  {hourStart} - {hourEnd}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {hourAppointments.length > 0 ? (
                    hourAppointments.map(appt => (
                      <AppointmentCard key={appt.id} appt={appt} />
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm py-2">لا توجد مواعيد</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // عرض الأسبوع
  const renderWeekView = () => {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">أسبوع {currentMonth.toLocaleDateString('ar-EG', { month: 'long' })}</h3>
          <button 
            onClick={() => setQuickAdd(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            إضافة موعد
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayAppointments = appointments.filter(a => a.date === dateStr);
            
            return (
              <div 
                key={index} 
                onClick={() => setSelectedDate(dateStr)}
                className={`p-2 rounded-lg cursor-pointer text-center ${isSelected ? 'bg-blue-100 border border-blue-300' : isToday ? 'bg-amber-100' : 'bg-white'} ${dayAppointments.length > 0 ? 'border-l-4 border-l-green-500' : ''}`}
              >
                <div className="text-sm font-medium">
                  {day.toLocaleDateString('ar-EG', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold">
                  {day.getDate()}
                </div>
                <div className="text-xs text-gray-500">
                  {dayAppointments.length} مواعيد
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedDate && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">مواعيد {formatDateToDay(selectedDate)}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredAppointments.map(appt => (
                <AppointmentCard key={appt.id} appt={appt} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // عرض الشهر
  const renderMonthView = () => {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {currentMonth.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <button onClick={() => changeMonth("prev")} className="p-1 rounded-full hover:bg-gray-200">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentMonth(new Date())} className="text-sm text-blue-600 hover:underline">
              اليوم
            </button>
            <button onClick={() => changeMonth("next")} className="p-1 rounded-full hover:bg-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["أ", "إ", "ث", "أ", "خ", "ج", "س"].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, index) => {
            const dateStr = day.date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayAppointments = appointments.filter(a => a.date === dateStr);
            
            return (
              <div
                key={index}
                onClick={() => handleDateSelect(day.date)}
                className={`p-2 rounded-lg min-h-16 cursor-pointer ${!day.isCurrentMonth ? 'bg-gray-100 text-gray-400' : isSelected ? 'bg-blue-100 border border-blue-300' : isToday ? 'bg-amber-100' : 'bg-white'} ${dayAppointments.length > 0 ? 'border-l-4 border-l-green-500' : ''}`}
              >
                <div className="text-sm font-medium">
                  {day.date.getDate()}
                </div>
                {dayAppointments.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayAppointments.slice(0, 2).map(appt => (
                      <div key={appt.id} className={`text-xs p-1 rounded ${appt.status === 'Confirmed' ? 'bg-green-200' : appt.status === 'Canceled' ? 'bg-red-200' : 'bg-blue-200'}`}>
                        {appt.time} - {appt.patientName.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayAppointments.length - 2} أكثر</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  

  // عرض القائمة
  const renderListView = () => {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">قائمة المواعيد</h3>
          <button 
            onClick={() => setQuickAdd(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            إضافة موعد
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-sm font-medium text-gray-600">المريض</th>
                <th className="p-3 text-sm font-medium text-gray-600">التاريخ</th>
                <th className="p-3 text-sm font-medium text-gray-600">الوقت</th>
                <th className="p-3 text-sm font-medium text-gray-600">النوع</th>
                <th className="p-3 text-sm font-medium text-gray-600">الحالة</th>
                <th className="p-3 text-sm font-medium text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-3 font-medium">{appt.patientName}</td>
                  <td className="p-3">{formatDateToDay(appt.date)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appt.time}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      appt.type === "consultation" ? "bg-blue-100 text-blue-800" :
                      appt.type === "follow-up" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {appt.type === "consultation" ? "استشارة" :
                       appt.type === "follow-up" ? "متابعة" : "طوارئ"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      appt.status === "Booked" ? "bg-amber-500" :
                      appt.status === "Canceled" ? "bg-red-500" :
                      appt.status === "Confirmed" ? "bg-blue-500" :
                      "bg-green-600"
                    }`}>
                      {appt.status === "Booked" ? "محجوز" :
                       appt.status === "Canceled" ? "ملغي" :
                       appt.status === "Confirmed" ? "مؤكد" : "مكتمل"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {(appt.status === "Booked" || appt.status === "Confirmed") && (
                        <>
                          <button
                            onClick={() => handleReschedule(appt.id)}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1 text-sm hover:bg-blue-200 transition-colors"
                            title="إعادة جدولة"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          {appt.status === "Booked" && (
                            <button 
                                onClick={() => setConfirmAppt(appt)}   // ✅ يفتح المودال بالموعد المحدد
                                className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-2 py-1 text-sm hover:bg-green-200 transition-colors" 
                                title="تأكيد" 
                              > 
                              <CheckCircle className="w-4 h-4" /> 
                            </button> 
                          )}


                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="flex items-center gap-1 bg-red-100 text-red-700 rounded px-2 py-1 text-sm hover:bg-red-200 transition-colors"
                            title="إلغاء"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          
                          {appt.status === "Confirmed" && (
                            <button
                              onClick={() => handleComplete(appt.id)}
                              className="flex items-center gap-1 bg-purple-100 text-purple-700 rounded px-2 py-1 text-sm hover:bg-purple-200 transition-colors"
                              title="إكمال"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // بطاقة الموعد
  const AppointmentCard = ({ appt }: { appt: Appointment }) => {
    return (
      <div
        className={`border rounded-lg p-3 shadow-sm transition-all hover:shadow-md ${
          appt.status === "Booked"
            ? "border-amber-400 bg-amber-50"
            : appt.status === "Canceled"
            ? "border-red-400 bg-red-50"
            : appt.status === "Confirmed"
            ? "border-blue-400 bg-blue-50"
            : "border-green-400 bg-green-50"
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800">{appt.patientName}</h3>
          <span
            className={`px-2 py-1 rounded-full text-white text-xs ${
              appt.status === "Booked"
                ? "bg-amber-500"
                : appt.status === "Canceled"
                ? "bg-red-500"
                : appt.status === "Confirmed"
                ? "bg-blue-500"
                : "bg-green-600"
            }`}
          >
            {appt.status === "Booked" ? "محجوز" :
             appt.status === "Canceled" ? "ملغي" :
             appt.status === "Confirmed" ? "مؤكد" : "مكتمل"}
          </span>
        </div>
        
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{appt.time}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              appt.type === "consultation" ? "bg-blue-500" :
              appt.type === "follow-up" ? "bg-green-500" :
              "bg-red-500"
            }`}></span>
            <span>
              {appt.type === "consultation" ? "استشارة" :
               appt.type === "follow-up" ? "متابعة" : "طوارئ"}
            </span>
          </div>
          
          {appt.notes && (
            <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
              <span className="font-medium">ملاحظات: </span>
              {appt.notes}
            </div>
          )}
        </div>
        
        <div className="mt-3 flex gap-2">
          {(appt.status === "Booked" || appt.status === "Confirmed") && (
            <>
              <button
                onClick={() => handleReschedule(appt.id)}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1 text-sm hover:bg-blue-200 transition-colors"
                title="إعادة جدولة"
              >
                <RefreshCw className="w-3 h-3" />
              </button>

              {appt.status === "Booked" && (
                <button
                  onClick={() => handleConfirm(appt.id)}
                  className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-2 py-1 text-sm hover:bg-green-200 transition-colors"
                  title="تأكيد"
                >
                  <CheckCircle className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={() => handleCancel(appt.id)}
                className="flex items-center gap-1 bg-red-100 text-red-700 rounded px-2 py-1 text-sm hover:bg-red-200 transition-colors"
                title="إلغاء"
              >
                <XCircle className="w-3 h-3" />
              </button>
              
              {appt.status === "Confirmed" && (
                <button
                  onClick={() => handleComplete(appt.id)}
                  className="flex items-center gap-1 bg-purple-100 text-purple-700 rounded px-2 py-1 text-sm hover:bg-purple-200 transition-colors"
                  title="إكمال"
                >
                  <CheckCircle className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // مودال إضافة موعد سريع
  // const QuickAddModal = () => {
  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
  //       <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
  //         <h3 className="text-lg font-bold mb-4 text-right">إضافة موعد جديد</h3>
          
  //         <div className="space-y-4">
  //           <label className="block text-right">
  //             <span className="block mb-1">اسم المريض</span>
  //             <input
  //               type="text"
  //               value={newAppointment.patientName}
  //               onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
  //               className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               dir="rtl"
  //               placeholder="أدخل اسم المريض"
  //             />
  //           </label>

  //           <label className="block text-right">
  //             <span className="block mb-1">التاريخ</span>
  //             <input
  //               type="date"
  //               value={newAppointment.date ?? ""}
  //               onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
  //               className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               dir="rtl"
  //             />
  //           </label>

  //           <label className="block text-right">
  //             <span className="block mb-1">الوقت</span>
  //             <input
  //               type="time"
  //               value={newAppointment.time}
  //               onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
  //               className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               dir="rtl"
  //             />
  //           </label>
  //         </div>

  //         <div className="flex justify-end gap-2 mt-6">
  //           <button
  //             onClick={() => setQuickAdd(false)}
  //             className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
  //           >
  //             إلغاء
  //           </button>
  //           <button
  //             onClick={addNewAppointment}
  //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
  //           >
  //             إضافة
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };


  const QuickAddModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-right">إضافة موعد جديد</h3>

        <div className="space-y-4">
          {/* اسم المريض */}
          <label className="block text-right">
            <span className="block mb-1">اسم المريض</span>
            <input
              type="text"
              value={newAppointment.patientName}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, patientName: e.target.value })
              }
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
              placeholder="أدخل اسم المريض"
            />
          </label>

          {/* التاريخ */}
          <label className="block text-right">
            <span className="block mb-1">التاريخ</span>
            <input
              type="date"
              value={newAppointment.date ?? ""}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, date: e.target.value })
              }
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </label>

          {/* الوقت */}
          <label className="block text-right">
            <span className="block mb-1">الوقت</span>
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, time: e.target.value })
              }
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </label>

          {/* نوع العملية (حجز / تأكيد) */}
          <label className="block text-right">
            <span className="block mb-1">نوع العملية</span>
            <select
              value={newApptType}
              onChange={(e) =>
                setNewApptType(e.target.value as "Booked" | "Confirmed")
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="Booked">حجز</option>
              <option value="Confirmed">تأكيد</option>
            </select>
          </label>
        </div>

        {/* الأزرار */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setQuickAdd(false)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            إلغاء
          </button>

          {newApptType === "Booked" ? (
            // لو حجز
            <button
              onClick={addNewAppointment}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              حجز
            </button>
          ) : (
            // لو تأكيد
            <button
              onClick={() => {
                // إنشاء موعد مؤقت بحالة Booked
                const newAppt: Appointment = {
                  id: appointments.length + 1,
                  patientName: newAppointment.patientName,
                  date: newAppointment.date ?? "",
                  time: newAppointment.time,
                  status: "Booked", // مبدئيًا Booked
                  type: "consultation",
                  duration: 30,
                };
                setAppointments((prev) => [...prev, newAppt]);
                setConfirmAppt(newAppt); // يفتح ConfirmModal
                setQuickAdd(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};










  // مودال إعادة جدولة موعد
  const RescheduleModal = () => {
    if (!rescheduleAppt) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-right">إعادة جدولة موعد</h3>
          <p className="text-right mb-4">المريض: {rescheduleAppt.patientName}</p>
          
          <div className="space-y-4">
            <label className="block text-right">
              <span className="block mb-1">التاريخ الجديد</span>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </label>

            <label className="block text-right">
              <span className="block mb-1">الوقت الجديد</span>
              <input
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setRescheduleAppt(null)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleRescheduleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">
      {/* الهيدر */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">إدارة المواعيد</h1>
                <p className="text-sm text-gray-600">د. أحمد - عيادة القلب</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="search"
                  placeholder="ابحث باسم المريض..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-64 border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
                <SearchIcon className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* الشريط الجانبي */}
          <aside className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* إحصائيات سريعة */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-700 mb-3">نظرة سريعة</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-800">إجمالي المواعيد</div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                  <div className="text-sm text-green-800">مواعد مؤكدة</div>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.booked}</div>
                  <div className="text-sm text-amber-800">في انتظار التأكيد</div>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
                  <div className="text-sm text-red-800">ملغية</div>
                </div>
              </div>
            </div>

            {/* طرق العرض */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-700 mb-3">طريقة العرض</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setViewMode("day")}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "day" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <ClockIcon className="w-5 h-5" />
                  <span className="text-sm">اليوم</span>
                </button>
                
                <button
                  onClick={() => setViewMode("week")}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "week" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-sm">الأسبوع</span>
                </button>
                
                <button
                  onClick={() => setViewMode("month")}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "month" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Grid className="w-5 h-5" />
                  <span className="text-sm">الشهر</span>
                </button>
                
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "list" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <List className="w-5 h-5" />
                  <span className="text-sm">القائمة</span>
                </button>
              </div>
            </div>

            {/* الفلتر حسب النوع */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-700 mb-3">نوع الموعد</h3>
              
              <div className="space-y-2">
                {[
                  { value: "consultation", label: "استشارة", color: "bg-blue-500", count: stats.consultation },
                  { value: "follow-up", label: "متابعة", color: "bg-green-500", count: stats.followup },
                  { value: "emergency", label: "طوارئ", color: "bg-red-500", count: stats.emergency }
                ].map((type) => (
                  <div key={type.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${type.color}`}></span>
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{type.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* المواعيد القادمة */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-700 mb-3">مواعيد قريباً</h3>
              
              <div className="space-y-3">
                {appointments
                  .filter(a => a.status === "Confirmed" || a.status === "Booked")
                  .sort((a, b) => {
                    const aDate = new Date(`${a.date}T${a.time}`);
                    const bDate = new Date(`${b.date}T${b.time}`);
                    return aDate.getTime() - bDate.getTime();
                  })
                  .slice(0, 3)
                  .map(appt => (
                    <div key={appt.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-10 rounded-full ${
                        appt.status === "Confirmed" ? "bg-green-500" : "bg-amber-500"
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-medium">{appt.patientName}</div>
                        <div className="text-xs text-gray-500">
                          {formatDateToDay(appt.date)} - {appt.time}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </aside>

          {/* المحتوى الرئيسي */}
          <main className="flex-1">
            {/* التنبيهات */}
            {alertMsg && (
              <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-lg mb-6 flex items-start gap-3">
                <Bell className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">موعد قادم قريباً</p>
                  <p>{alertMsg}</p>
                </div>
                <button
                  onClick={() => setAlertMsg(null)}
                  className="text-amber-700 hover:text-amber-900 text-lg"
                >
                  ×
                </button>
              </div>
            )}

            {/* عرض المواعيد */}
            {renderAppointments()}
          </main>
        </div>
      </div>

      {/* مودال الإضافة السريعة */}
      {quickAdd && <QuickAddModal />}

      {/* مودال إعادة الجدولة */}
      {rescheduleAppt && <RescheduleModal />}
      {confirmAppt && <ConfirmModal />}

    </div>
  );
}
