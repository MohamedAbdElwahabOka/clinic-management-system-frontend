"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import type { Locale } from "@/types";

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
  { id: 2, patientName: "سارة محمود", date: "2025-08-31", time: "11:30", status: "Canceled", type: "follow-up", duration: 20 },
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

export default function AppointmentsPage({ locale }: { locale: Locale }) {
  const t = useTranslations("Appointments");
  const translate = React.useCallback(
    (key: string, defaultValue?: string) => {
      const translation = t(key);
      return translation === key && defaultValue ? defaultValue : translation;
    },
    [t]
  );
  
  const [appointments, setAppointments] = useState(appointmentsData);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [timeOfDayFilter, setTimeOfDayFilter] = useState<TimeOfDayFilter>("all");
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [quickAdd, setQuickAdd] = useState(false);
  const [newAppointment, setNewAppointment] = useState({patientName: "", date: selectedDate, time: "09:00"});
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

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
  function saveModalChanges(updated: Appointment) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? { ...updated, status: updated.status } : a))
    );
    setModalAppt(null);
  }

  // أزرار تصدير
  function exportData(type: "pdf" | "excel") {
    alert(`تم تصدير البيانات كـ ${type.toUpperCase()} (هذا تنبيه توضيحي فقط)`);
  }

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
  function formatTime(timeStr: string) {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  }

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
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appt.type === "consultation" ? "bg-blue-100 text-blue-800" :
                      appt.type === "follow-up" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {appt.type === "consultation" ? "استشارة" :
                       appt.type === "follow-up" ? "متابعة" : "طوارئ"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${
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
                              onClick={() => handleConfirm(appt.id)}
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
  const QuickAddModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-right">إضافة موعد جديد</h3>
          
          <div className="space-y-4">
            <label className="block text-right">
              <span className="block mb-1">اسم المريض</span>
              <input
                type="text"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                placeholder="أدخل اسم المريض"
              />
            </label>

            <label className="block text-right">
              <span className="block mb-1">التاريخ</span>
              <input
                type="date"
                value={newAppointment.date ?? ""}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </label>

            <label className="block text-right">
              <span className="block mb-1">الوقت</span>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setQuickAdd(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={addNewAppointment}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              إضافة
            </button>
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
    </div>
  );
}

// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Calendar,
//   Clock,
//   RefreshCw,
//   XCircle,
//   CheckCircle,
//   Search as SearchIcon,
//   ChevronRight,
//   ChevronLeft,
//   Filter,
//   Plus,
//   Calendar as CalendarIcon,
//   Grid,
//   List,
//   Clock as ClockIcon,
//   Bell
// } from "lucide-react";
// import { useTranslations } from "next-intl";
// import type { Locale } from "@/types";

// interface Appointment {
//   id: number;
//   patientName: string;
//   date: string; // YYYY-MM-DD
//   time: string; // HH:mm
//   status: "Booked" | "Canceled" | "Confirmed" | "Completed";
//   type: "consultation" | "follow-up" | "emergency";
//   duration: number; // مدة الموعد بالدقائق
//   notes?: string;
// }

// const appointmentsData: Appointment[] = [
//   { id: 1, patientName: "محمد علي", date: "2025-08-30", time: "10:00", status: "Booked", type: "consultation", duration: 30 },
//   { id: 2, patientName: "سارة محمود", date: "2025-08-31", time: "11:30", status: "Canceled", type: "follow-up", duration: 20 },
//   { id: 3, patientName: "علي حسن", date: "2025-08-30", time: "09:00", status: "Booked", type: "consultation", duration: 45 },
//   { id: 4, patientName: "ليلى محمد", date: "2025-08-31", time: "14:00", status: "Booked", type: "follow-up", duration: 30 },
//   { id: 5, patientName: "سلمان علي", date: "2025-08-25", time: "15:30", status: "Confirmed", type: "emergency", duration: 60 },
//   { id: 6, patientName: "هالة يوسف", date: "2025-08-26", time: "12:00", status: "Booked", type: "consultation", duration: 30 },
//   { id: 7, patientName: "ناصر عبد الله", date: "2025-08-27", time: "16:00", status: "Confirmed", type: "follow-up", duration: 40 },
//   { id: 8, patientName: "فاطمة إبراهيم", date: "2025-08-26", time: "10:30", status: "Booked", type: "consultation", duration: 45 },
//   { id: 9, patientName: "يوسف أحمد", date: "2025-09-11", time: "09:30", status: "Completed", type: "follow-up", duration: 30, notes: "يحتاج متابعة بعد أسبوعين" },
// ];

// type ViewMode = "day" | "week" | "month" | "list";
// type TimeOfDayFilter = "all" | "morning" | "afternoon";

// export default function AppointmentsPage({ locale }: { locale: Locale }) {
//   const t = useTranslations("Appointments");
//   const translate = React.useCallback(
//     (key: string, defaultValue?: string) => {
//       const translation = t(key);
//       return translation === key && defaultValue ? defaultValue : translation;
//     },
//     [t]
//   );
  
//   const [appointments, setAppointments] = useState(appointmentsData);
//   const [viewMode, setViewMode] = useState<ViewMode>("day");
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
//   const [timeOfDayFilter, setTimeOfDayFilter] = useState<TimeOfDayFilter>("all");
//   const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
//   const [alertMsg, setAlertMsg] = useState<string | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [quickAdd, setQuickAdd] = useState(false);
//   const [newAppointment, setNewAppointment] = useState({patientName: "", date: selectedDate, time: "09:00"});

//   // توليد أيام الأسبوع الحالي
//   const weekDays = useMemo(() => {
//     if (!selectedDate) return [];
//     const currentDate = new Date(selectedDate);
//     const firstDayOfWeek = new Date(currentDate);
//     firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
//     const days = [];
//     for (let i = 0; i < 7; i++) {
//       const day = new Date(firstDayOfWeek);
//       day.setDate(firstDayOfWeek.getDate() + i);
//       days.push(day);
//     }
//     return days;
//   }, [selectedDate]);

//   // استخراج تواريخ المواعيد (لتقسيم الأيام)
//   const dates = useMemo(() => {
//     const allDates = Array.from(new Set(appointments.map((a) => a.date))).sort();
//     return allDates;
//   }, [appointments]);

//   // توليد أيام الشهر الحالي
//   const daysInMonth = useMemo(() => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days = [];
    
//     // أيام الشهر السابق
//     const prevMonthLastDay = new Date(year, month, 0).getDate();
//     const firstDayIndex = firstDay.getDay();
    
//     for (let i = firstDayIndex - 1; i >= 0; i--) {
//       days.push({
//         date: new Date(year, month - 1, prevMonthLastDay - i),
//         isCurrentMonth: false,
//         hasAppointments: false
//       });
//     }
    
//     // أيام الشهر الحالي
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
//       days.push({
//         date: new Date(year, month, i),
//         isCurrentMonth: true,
//         hasAppointments: dates.includes(dateStr)
//       });
//     }
    
//     // أيام الشهر التالي
//     const daysNeeded = 42 - days.length;
//     for (let i = 1; i <= daysNeeded; i++) {
//       days.push({
//         date: new Date(year, month + 1, i),
//         isCurrentMonth: false,
//         hasAppointments: false
//       });
//     }
    
//     return days;
//   }, [currentMonth, dates]);

//   // ضبط التاريخ المختار تلقائيًا ليكون تاريخ اليوم
//   useEffect(() => {
//     if (!selectedDate) {
//       const today = new Date().toISOString().split('T')[0];
//       setSelectedDate(today);
//     }
//   }, [selectedDate]);

//   // فلترة البيانات
//   const filteredAppointments = useMemo(() => {
//     return appointments.filter((appt) => {
//       if (selectedDate && appt.date !== selectedDate && viewMode !== "month") return false;

//       if (filterStatus.length > 0 && !filterStatus.includes(appt.status)) return false;

//       if (timeOfDayFilter !== "all") {
//         const hour = parseInt(appt.time.split(':')[0]);
//         if (timeOfDayFilter === "morning" && hour >= 12) return false;
//         if (timeOfDayFilter === "afternoon" && hour < 12) return false;
//       }

//       if (searchText) {
//         const q = searchText.trim().toLowerCase();
//         if (!appt.patientName.toLowerCase().includes(q)) {
//           return false;
//         }
//       }
//       return true;
//     });
//   }, [appointments, selectedDate, filterStatus, searchText, timeOfDayFilter, viewMode]);

//   // إحصائيات
//   const stats = useMemo(() => {
//     const total = filteredAppointments.length;
//     const booked = filteredAppointments.filter((a) => a.status === "Booked").length;
//     const canceled = filteredAppointments.filter((a) => a.status === "Canceled").length;
//     const confirmed = filteredAppointments.filter((a) => a.status === "Confirmed").length;
//     const completed = filteredAppointments.filter((a) => a.status === "Completed").length;
    
//     // إحصائيات حسب الوقت
//     const morning = filteredAppointments.filter(a => {
//       const hour = parseInt(a.time.split(':')[0]);
//       return hour < 12;
//     }).length;
    
//     const afternoon = filteredAppointments.filter(a => {
//       const hour = parseInt(a.time.split(':')[0]);
//       return hour >= 12;
//     }).length;
    
//     // إحصائيات حسب النوع
//     const consultation = filteredAppointments.filter(a => a.type === "consultation").length;
//     const followup = filteredAppointments.filter(a => a.type === "follow-up").length;
//     const emergency = filteredAppointments.filter(a => a.type === "emergency").length;
    
//     return { total, booked, canceled, confirmed, completed, morning, afternoon, consultation, followup, emergency };
//   }, [filteredAppointments]);

//   // تنبيه للمواعيد القادمة (داخل ساعة من الآن)
//   useEffect(() => {
//     const now = new Date();
//     const soonAppt = appointments.find((a) => {
//       if (a.status !== "Booked" && a.status !== "Confirmed") return false;
//       const apptDateTime = new Date(`${a.date}T${a.time}:00`);
//       const diff = (apptDateTime.getTime() - now.getTime()) / (60 * 1000);
//       return diff > 0 && diff <= 60;
//     });
//     if (soonAppt) {
//       setAlertMsg(t("upcomingAlert", { patient: soonAppt.patientName, time: soonAppt.time }));
//     } else {
//       setAlertMsg(null);
//     }
//   }, [appointments, t]);

//   // إجراءات الموعد
//   function handleReschedule(id: number) {
//     const appt = appointments.find((a) => a.id === id);
//     if (!appt) return;
//     setModalAppt(appt);
//   }

//   function handleCancel(id: number) {
//     setAppointments((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, status: "Canceled" } : a))
//     );
//     alert(t("canceledAlert", { id }));
//   }

//   function handleConfirm(id: number) {
//     setAppointments((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? { ...a, status: "Confirmed" }
//           : a
//       )
//     );
//     alert(t("confirmedAlert", { id }));
//   }

//   function handleComplete(id: number) {
//     setAppointments((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? { ...a, status: "Completed" }
//           : a
//       )
//     );
//     alert(t("completedAlert", { id }));
//   }

//   // إضافة موعد جديد
//   function addNewAppointment() {
//     if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) {
//       alert("يرجى ملء جميع الحقول المطلوبة");
//       return;
//     }
    
//     const newAppt: Appointment = {
//       id: appointments.length + 1,
//       patientName: newAppointment.patientName,
//       date: newAppointment.date,
//       time: newAppointment.time,
//       status: "Booked",
//       type: "consultation",
//       duration: 30
//     };
    
//     setAppointments(prev => [...prev, newAppt]);
//     setNewAppointment({patientName: "", date: selectedDate, time: "09:00"});
//     setQuickAdd(false);
//     alert("تم إضافة الموعد بنجاح");
//   }

//   // تحديث الموعد من المودال
//   function saveModalChanges(updated: Appointment) {
//     setAppointments((prev) =>
//       prev.map((a) => (a.id === updated.id ? { ...updated, status: updated.status } : a))
//     );
//     setModalAppt(null);
//   }

//   // أزرار تصدير
//   function exportData(type: "pdf" | "excel") {
//     alert(`تم تصدير البيانات كـ ${type.toUpperCase()} (هذا تنبيه توضيحي فقط)`);
//   }

//   // التبديل بين الأشهر في التقويم
//   const changeMonth = (direction: "prev" | "next") => {
//     setCurrentMonth(prev => {
//       const newMonth = new Date(prev);
//       if (direction === "prev") {
//         newMonth.setMonth(newMonth.getMonth() - 1);
//       } else {
//         newMonth.setMonth(newMonth.getMonth() + 1);
//       }
//       return newMonth;
//     });
//   };

//   // اختيار تاريخ من التقويم
//   const handleDateSelect = (date: Date) => {
//     const dateStr = date.toISOString().split('T')[0];
//     setSelectedDate(dateStr);
//   };

//   // تنسيق التاريخ للعرض
//   function formatDateToDay(dateStr: string) {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
//   }

//   // تنسيق الوقت للعرض
//   function formatTime(timeStr: string) {
//     const [hours, minutes] = timeStr.split(':');
//     return `${hours}:${minutes}`;
//   }

//   // عرض المواعيد حسب طريقة العرض المختارة
//   const renderAppointments = () => {
//     switch(viewMode) {
//       case "day":
//         return renderDayView();
//       case "week":
//         return renderWeekView();
//       case "month":
//         return renderMonthView();
//       case "list":
//         return renderListView();
//       default:
//         return renderDayView();
//     }
//   };

//   // عرض اليوم
//   const renderDayView = () => {
//     const hours = Array.from({length: 12}, (_, i) => i + 8); // من 8 صباحاً إلى 8 مساءً
    
//     return (
//       <div className="bg-gray-50 rounded-lg p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold">{selectedDate ? formatDateToDay(selectedDate) : "—"}</h3>
//           <div className="flex gap-2">
//             <button 
//               onClick={() => setQuickAdd(true)}
//               className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
//             >
//               <Plus className="w-4 h-4" />
//               إضافة موعد
//             </button>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
//           {hours.map(hour => {
//             const hourStart = `${hour.toString().padStart(2, '0')}:00`;
//             const hourEnd = `${hour === 23 ? '00' : (hour + 1).toString().padStart(2, '0')}:00`;
            
//             const hourAppointments = filteredAppointments.filter(appt => {
//               const apptHour = parseInt(appt.time.split(':')[0]);
//               return apptHour === hour;
//             });
            
//             return (
//               <div key={hour} className="flex border-b border-gray-200 py-2">
//                 <div className="w-20 font-medium text-gray-500">
//                   {hourStart} - {hourEnd}
//                 </div>
//                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//                   {hourAppointments.length > 0 ? (
//                     hourAppointments.map(appt => (
//                       <AppointmentCard key={appt.id} appt={appt} />
//                     ))
//                   ) : (
//                     <div className="text-gray-400 text-sm py-2">لا توجد مواعيد</div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   // عرض الأسبوع
//   const renderWeekView = () => {
//     return (
//       <div className="bg-gray-50 rounded-lg p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold">أسبوع {currentMonth.toLocaleDateString('ar-EG', { month: 'long' })}</h3>
//           <button 
//             onClick={() => setQuickAdd(true)}
//             className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
//           >
//             <Plus className="w-4 h-4" />
//             إضافة موعد
//           </button>
//         </div>
        
//         <div className="grid grid-cols-7 gap-2 mb-2">
//           {weekDays.map((day, index) => {
//             const dateStr = day.toISOString().split('T')[0];
//             const isSelected = selectedDate === dateStr;
//             const isToday = dateStr === new Date().toISOString().split('T')[0];
//             const dayAppointments = appointments.filter(a => a.date === dateStr);
            
//             return (
//               <div 
//                 key={index} 
//                 onClick={() => setSelectedDate(dateStr)}
//                 className={`p-2 rounded-lg cursor-pointer text-center ${isSelected ? 'bg-blue-100 border border-blue-300' : isToday ? 'bg-amber-100' : 'bg-white'} ${dayAppointments.length > 0 ? 'border-l-4 border-l-green-500' : ''}`}
//               >
//                 <div className="text-sm font-medium">
//                   {day.toLocaleDateString('ar-EG', { weekday: 'short' })}
//                 </div>
//                 <div className="text-lg font-bold">
//                   {day.getDate()}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {dayAppointments.length} مواعيد
//                 </div>
//               </div>
//             );
//           })}
//         </div>
        
//         {selectedDate && (
//           <div className="mt-4">
//             <h4 className="font-medium mb-2">مواعيد {formatDateToDay(selectedDate)}</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//               {filteredAppointments.map(appt => (
//                 <AppointmentCard key={appt.id} appt={appt} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // عرض الشهر
//   const renderMonthView = () => {
//     return (
//       <div className="bg-gray-50 rounded-lg p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold">
//             {currentMonth.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
//           </h3>
//           <div className="flex gap-2">
//             <button onClick={() => changeMonth("prev")} className="p-1 rounded-full hover:bg-gray-200">
//               <ChevronRight className="w-5 h-5" />
//             </button>
//             <button onClick={() => setCurrentMonth(new Date())} className="text-sm text-blue-600 hover:underline">
//               اليوم
//             </button>
//             <button onClick={() => changeMonth("next")} className="p-1 rounded-full hover:bg-gray-200">
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-7 gap-1 mb-2">
//           {["أ", "إ", "ث", "أ", "خ", "ج", "س"].map(day => (
//             <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
//               {day}
//             </div>
//           ))}
//         </div>
        
//         <div className="grid grid-cols-7 gap-1">
//           {daysInMonth.map((day, index) => {
//             const dateStr = day.date.toISOString().split('T')[0];
//             const isSelected = selectedDate === dateStr;
//             const isToday = dateStr === new Date().toISOString().split('T')[0];
//             const dayAppointments = appointments.filter(a => a.date === dateStr);
            
//             return (
//               <div
//                 key={index}
//                 onClick={() => handleDateSelect(day.date)}
//                 className={`p-2 rounded-lg min-h-16 cursor-pointer ${!day.isCurrentMonth ? 'bg-gray-100 text-gray-400' : isSelected ? 'bg-blue-100 border border-blue-300' : isToday ? 'bg-amber-100' : 'bg-white'} ${dayAppointments.length > 0 ? 'border-l-4 border-l-green-500' : ''}`}
//               >
//                 <div className="text-sm font-medium">
//                   {day.date.getDate()}
//                 </div>
//                 {dayAppointments.length > 0 && (
//                   <div className="mt-1 space-y-1">
//                     {dayAppointments.slice(0, 2).map(appt => (
//                       <div key={appt.id} className={`text-xs p-1 rounded ${appt.status === 'Confirmed' ? 'bg-green-200' : appt.status === 'Canceled' ? 'bg-red-200' : 'bg-blue-200'}`}>
//                         {appt.time} - {appt.patientName.split(' ')[0]}
//                       </div>
//                     ))}
//                     {dayAppointments.length > 2 && (
//                       <div className="text-xs text-gray-500">+{dayAppointments.length - 2} أكثر</div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   // عرض القائمة
//   const renderListView = () => {
//     return (
//       <div className="bg-gray-50 rounded-lg p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold">قائمة المواعيد</h3>
//           <button 
//             onClick={() => setQuickAdd(true)}
//             className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
//           >
//             <Plus className="w-4 h-4" />
//             إضافة موعد
//           </button>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-right" dir="rtl">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="p-3 text-sm font-medium text-gray-600">المريض</th>
//                 <th className="p-3 text-sm font-medium text-gray-600">التاريخ</th>
//                 <th className="p-3 text-sm font-medium text-gray-600">الوقت</th>
//                 <th className="p-3 text-sm font-medium text-gray-600">النوع</th>
//                 <th className="p-3 text-sm font-medium text-gray-600">الحالة</th>
//                 <th className="p-3 text-sm font-medium text-gray-600">الإجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAppointments.map((appt) => (
//                 <tr key={appt.id} className="border-b border-gray-200 hover:bg-gray-100">
//                   <td className="p-3 font-medium">{appt.patientName}</td>
//                   <td className="p-3">{formatDateToDay(appt.date)}</td>
//                   <td className="p-3">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-4 h-4" />
//                       {appt.time}
//                     </div>
//                   </td>
//                   <td className="p-3">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       appt.type === "consultation" ? "bg-blue-100 text-blue-800" :
//                       appt.type === "follow-up" ? "bg-green-100 text-green-800" :
//                       "bg-red-100 text-red-800"
//                     }`}>
//                       {appt.type === "consultation" ? "استشارة" :
//                        appt.type === "follow-up" ? "متابعة" : "طوارئ"}
//                     </span>
//                   </td>
//                   <td className="p-3">
//                     <span className={`px-2 py-1 rounded-full text-white text-xs ${
//                       appt.status === "Booked" ? "bg-amber-500" :
//                       appt.status === "Canceled" ? "bg-red-500" :
//                       appt.status === "Confirmed" ? "bg-blue-500" :
//                       "bg-green-600"
//                     }`}>
//                       {appt.status === "Booked" ? "محجوز" :
//                        appt.status === "Canceled" ? "ملغي" :
//                        appt.status === "Confirmed" ? "مؤكد" : "مكتمل"}
//                     </span>
//                   </td>
//                   <td className="p-3">
//                     <div className="flex gap-2">
//                       {(appt.status === "Booked" || appt.status === "Confirmed") && (
//                         <>
//                           <button
//                             onClick={() => handleReschedule(appt.id)}
//                             className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1 text-sm hover:bg-blue-200 transition-colors"
//                             title="إعادة جدولة"
//                           >
//                             <RefreshCw className="w-4 h-4" />
//                           </button>

//                           {appt.status === "Booked" && (
//                             <button
//                               onClick={() => handleConfirm(appt.id)}
//                               className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-2 py-1 text-sm hover:bg-green-200 transition-colors"
//                               title="تأكيد"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                             </button>
//                           )}

//                           <button
//                             onClick={() => handleCancel(appt.id)}
//                             className="flex items-center gap-1 bg-red-100 text-red-700 rounded px-2 py-1 text-sm hover:bg-red-200 transition-colors"
//                             title="إلغاء"
//                           >
//                             <XCircle className="w-4 h-4" />
//                           </button>
                          
//                           {appt.status === "Confirmed" && (
//                             <button
//                               onClick={() => handleComplete(appt.id)}
//                               className="flex items-center gap-1 bg-purple-100 text-purple-700 rounded px-2 py-1 text-sm hover:bg-purple-200 transition-colors"
//                               title="إكمال"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   // بطاقة الموعد
//   const AppointmentCard = ({ appt }: { appt: Appointment }) => {
//     return (
//       <div
//         className={`border rounded-lg p-3 shadow-sm transition-all hover:shadow-md ${
//           appt.status === "Booked"
//             ? "border-amber-400 bg-amber-50"
//             : appt.status === "Canceled"
//             ? "border-red-400 bg-red-50"
//             : appt.status === "Confirmed"
//             ? "border-blue-400 bg-blue-50"
//             : "border-green-400 bg-green-50"
//         }`}
//       >
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-bold text-gray-800">{appt.patientName}</h3>
//           <span
//             className={`px-2 py-1 rounded-full text-white text-xs ${
//               appt.status === "Booked"
//                 ? "bg-amber-500"
//                 : appt.status === "Canceled"
//                 ? "bg-red-500"
//                 : appt.status === "Confirmed"
//                 ? "bg-blue-500"
//                 : "bg-green-600"
//             }`}
//           >
//             {appt.status === "Booked" ? "محجوز" :
//              appt.status === "Canceled" ? "ملغي" :
//              appt.status === "Confirmed" ? "مؤكد" : "مكتمل"}
//           </span>
//         </div>
        
//         <div className="space-y-1 text-sm text-gray-600">
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4" />
//             <span className="font-mono">{appt.time}</span>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <span className={`w-3 h-3 rounded-full ${
//               appt.type === "consultation" ? "bg-blue-500" :
//               appt.type === "follow-up" ? "bg-green-500" :
//               "bg-red-500"
//             }`}></span>
//             <span>
//               {appt.type === "consultation" ? "استشارة" :
//                appt.type === "follow-up" ? "متابعة" : "طوارئ"}
//             </span>
//           </div>
          
//           {appt.notes && (
//             <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
//               <span className="font-medium">ملاحظات: </span>
//               {appt.notes}
//             </div>
//           )}
//         </div>
        
//         <div className="mt-3 flex gap-2">
//           {(appt.status === "Booked" || appt.status === "Confirmed") && (
//             <>
//               <button
//                 onClick={() => handleReschedule(appt.id)}
//                 className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1 text-sm hover:bg-blue-200 transition-colors"
//                 title="إعادة جدولة"
//               >
//                 <RefreshCw className="w-3 h-3" />
//               </button>

//               {appt.status === "Booked" && (
//                 <button
//                   onClick={() => handleConfirm(appt.id)}
//                   className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-2 py-1 text-sm hover:bg-green-200 transition-colors"
//                   title="تأكيد"
//                 >
//                   <CheckCircle className="w-3 h-3" />
//                 </button>
//               )}

//               <button
//                 onClick={() => handleCancel(appt.id)}
//                 className="flex items-center gap-1 bg-red-100 text-red-700 rounded px-2 py-1 text-sm hover:bg-red-200 transition-colors"
//                 title="إلغاء"
//               >
//                 <XCircle className="w-3 h-3" />
//               </button>
              
//               {appt.status === "Confirmed" && (
//                 <button
//                   onClick={() => handleComplete(appt.id)}
//                   className="flex items-center gap-1 bg-purple-100 text-purple-700 rounded px-2 py-1 text-sm hover:bg-purple-200 transition-colors"
//                   title="إكمال"
//                 >
//                   <CheckCircle className="w-3 h-3" />
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // مودال إضافة موعد سريع
//   const QuickAddModal = () => {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
//         <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
//           <h3 className="text-lg font-bold mb-4 text-right">إضافة موعد جديد</h3>
          
//           <div className="space-y-4">
//             <label className="block text-right">
//               <span className="block mb-1">اسم المريض</span>
//               <input
//                 type="text"
//                 value={newAppointment.patientName}
//                 onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
//                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//                 placeholder="أدخل اسم المريض"
//               />
//             </label>

//             <label className="block text-right">
//               <span className="block mb-1">التاريخ</span>
//               <input
//                 type="date"
//                 value={newAppointment.date ?? ""}
//                 onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
//                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//               />
//             </label>

//             <label className="block text-right">
//               <span className="block mb-1">الوقت</span>
//               <input
//                 type="time"
//                 value={newAppointment.time}
//                 onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
//                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//               />
//             </label>
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               onClick={() => setQuickAdd(false)}
//               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
//             >
//               إلغاء
//             </button>
//             <button
//               onClick={addNewAppointment}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//             >
//               إضافة
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div dir="rtl" className="min-h-screen bg-gray-100">
//       {/* الهيدر */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="bg-blue-100 p-2 rounded-lg">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">إدارة المواعيد</h1>
//                 <p className="text-sm text-gray-600">د. أحمد - عيادة القلب</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <input
//                   type="search"
//                   placeholder="ابحث باسم المريض..."
//                   value={searchText}
//                   onChange={(e) => setSearchText(e.target.value)}
//                   className="w-64 border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   dir="rtl"
//                 />
//                 <SearchIcon className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
//               </div>
              
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`p-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//               >
//                 <Filter className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* المحتوى الرئيسي */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* الشريط الجانبي */}
//           <aside className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
//             {/* إحصائيات سريعة */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3">نظرة سريعة</h3>
              
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-blue-50 p-3 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
//                   <div className="text-sm text-blue-800">إجمالي المواعيد</div>
//                 </div>
                
//                 <div className="bg-green-50 p-3 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
//                   <div className="text-sm text-green-800">مواعد مؤكدة</div>
//                 </div>
                
//                 <div className="bg-amber-50 p-3 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-amber-600">{stats.booked}</div>
//                   <div className="text-sm text-amber-800">في انتظار التأكيد</div>
//                 </div>
                
//                 <div className="bg-red-50 p-3 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
//                   <div className="text-sm text-red-800">ملغية</div>
//                 </div>
//               </div>
//             </div>

//             {/* طرق العرض */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3">طريقة العرض</h3>
              
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   onClick={() => setViewMode("day")}
//                   className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "day" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 >
//                   <ClockIcon className="w-5 h-5" />
//                   <span className="text-sm">اليوم</span>
//                 </button>
                
//                 <button
//                   onClick={() => setViewMode("week")}
//                   className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "week" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 >
//                   <CalendarIcon className="w-5 h-5" />
//                   <span className="text-sm">الأسبوع</span>
//                 </button>
                
//                 <button
//                   onClick={() => setViewMode("month")}
//                   className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "month" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 >
//                   <Grid className="w-5 h-5" />
//                   <span className="text-sm">الشهر</span>
//                 </button>
                
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 ${viewMode === "list" ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 >
//                   <List className="w-5 h-5" />
//                   <span className="text-sm">القائمة</span>
//                 </button>
//               </div>
//             </div>

//             {/* الفلتر حسب النوع */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3">نوع الموعد</h3>
              
//               <div className="space-y-2">
//                 {[
//                   { value: "consultation", label: "استشارة", color: "bg-blue-500", count: stats.consultation },
//                   { value: "follow-up", label: "متابعة", color: "bg-green-500", count: stats.followup },
//                   { value: "emergency", label: "طوارئ", color: "bg-red-500", count: stats.emergency }
//                 ].map((type) => (
//                   <div key={type.value} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span className={`w-3 h-3 rounded-full ${type.color}`}></span>
//                       <span className="text-sm">{type.label}</span>
//                     </div>
//                     <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{type.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* المواعيد القادمة */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3">مواعيد قريباً</h3>
              
//               <div className="space-y-3">
//                 {appointments
//                   .filter(a => a.status === "Confirmed" || a.status === "Booked")
//                   .sort((a, b) => {
//                     const aDate = new Date(`${a.date}T${a.time}`);
//                     const bDate = new Date(`${b.date}T${b.time}`);
//                     return aDate.getTime() - bDate.getTime();
//                   })
//                   .slice(0, 3)
//                   .map(appt => (
//                     <div key={appt.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
//                       <div className={`w-2 h-10 rounded-full ${
//                         appt.status === "Confirmed" ? "bg-green-500" : "bg-amber-500"
//                       }`}></div>
//                       <div className="flex-1">
//                         <div className="font-medium">{appt.patientName}</div>
//                         <div className="text-xs text-gray-500">
//                           {formatDateToDay(appt.date)} - {appt.time}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           </aside>

//           {/* المحتوى الرئيسي */}
//           <main className="flex-1">
//             {/* التنبيهات */}
//             {alertMsg && (
//               <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-lg mb-6 flex items-start gap-3">
//                 <Bell className="w-5 h-5 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-medium">موعد قادم قريباً</p>
//                   <p>{alertMsg}</p>
//                 </div>
//                 <button
//                   onClick={() => setAlertMsg(null)}
//                   className="text-amber-700 hover:text-amber-900 text-lg"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}

//             {/* عرض المواعيد */}
//             {renderAppointments()}
//           </main>
//         </div>
//       </div>

//       {/* مودال الإضافة السريعة */}
//       {quickAdd && <QuickAddModal />}
//     </div>
//   );
// }




















// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Calendar,
//   Clock,
//   RefreshCw,
//   XCircle,
//   CheckCircle,
//   Download,
//   Search as SearchIcon,
//   ChevronRight,
//   ChevronLeft,
//   Sun,
//   Moon,
//   User,
//   Filter,
//   BarChart3
// } from "lucide-react";
// import { useTranslations } from "next-intl";
// import type { Locale } from "@/types";

// interface Appointment {
//   id: number;
//   patientName: string;
//   date: string; // YYYY-MM-DD
//   time: string; // HH:mm
//   status: "Booked" | "Canceled" | "Confirmed";
//   doctor: string;
// }

// const appointmentsData: Appointment[] = [
//   { id: 1, patientName: "محمد علي", date: "2025-08-11", time: "10:00", status: "Booked", doctor: "د. ااااا" },
//   { id: 2, patientName: "سارة محمود", date: "2025-09-11", time: "11:30", status: "Canceled", doctor: "د. أحمد" },
//   { id: 3, patientName: "علي حسن", date: "2025-08-12", time: "09:00", status: "Booked", doctor: "د. أحمد" },
//   { id: 4, patientName: "ليلى محمد", date: "2025-08-15", time: "14:00", status: "Booked", doctor: "د. أحمد" },
//   { id: 5, patientName: "سلمان علي", date: "2025-08-11", time: "15:30", status: "Confirmed", doctor: "د. أحمد" },
//   { id: 6, patientName: "هالة يوسف", date: "2025-08-12", time: "12:00", status: "Booked", doctor: "د. أحمد" },
//   { id: 7, patientName: "ناصر عبد الله", date: "2025-08-11", time: "16:00", status: "Confirmed", doctor: "د. أحمد" },
//   { id: 8, patientName: "فاطمة إبراهيم", date: "2025-08-15", time: "10:30", status: "Booked", doctor: "د. أحمد" },
// ];

// type ViewMode = "table" | "cards" | "timeline";
// type TimeOfDayFilter = "all" | "morning" | "afternoon";

// export default function AppointmentsPage({ locale }: { locale: Locale }) {
//   const t = useTranslations("Appointments");
//   const translate = React.useCallback(
//     (key: string, defaultValue?: string) => {
//       const translation = t(key);
//       return translation === key && defaultValue ? defaultValue : translation;
//     },
//     [t]
//   );
  
//   const [appointments, setAppointments] = useState(appointmentsData);
//   const [viewMode, setViewMode] = useState<ViewMode>("cards");
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [timeOfDayFilter, setTimeOfDayFilter] = useState<TimeOfDayFilter>("all");
//   const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
//   const [alertMsg, setAlertMsg] = useState<string | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date());

//   // استخراج تواريخ المواعيد (لتقسيم الأيام)
//   const dates = useMemo(() => {
//     const allDates = Array.from(new Set(appointments.map((a) => a.date))).sort();
//     return allDates;
//   }, [appointments]);

//   // توليد أيام الشهر الحالي
//   const daysInMonth = useMemo(() => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days = [];
    
//     // أيام الشهر السابق
//     const prevMonthLastDay = new Date(year, month, 0).getDate();
//     const firstDayIndex = firstDay.getDay();
    
//     for (let i = firstDayIndex - 1; i >= 0; i--) {
//       days.push({
//         date: new Date(year, month - 1, prevMonthLastDay - i),
//         isCurrentMonth: false,
//         hasAppointments: false
//       });
//     }
    
//     // أيام الشهر الحالي
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
//       days.push({
//         date: new Date(year, month, i),
//         isCurrentMonth: true,
//         hasAppointments: dates.includes(dateStr)
//       });
//     }
    
//     // أيام الشهر التالي
//     const daysNeeded = 42 - days.length; // 6 أسطر × 7 أيام
//     for (let i = 1; i <= daysNeeded; i++) {
//       days.push({
//         date: new Date(year, month + 1, i),
//         isCurrentMonth: false,
//         hasAppointments: false
//       });
//     }
    
//     return days;
//   }, [currentMonth, dates]);

//   // ضبط التاريخ المختار تلقائيًا ليكون أول تاريخ
//   useEffect(() => {
//     if (!selectedDate && dates.length) setSelectedDate(dates[0]);
//   }, [dates, selectedDate]);

//   // فلترة البيانات
//   const filteredAppointments = useMemo(() => {
//     return appointments.filter((appt) => {
//       if (selectedDate && appt.date !== selectedDate) return false;

//       if (filterStatus.length > 0 && !filterStatus.includes(appt.status)) return false;

//       if (timeOfDayFilter !== "all") {
//         const hour = parseInt(appt.time.split(':')[0]);
//         if (timeOfDayFilter === "morning" && hour >= 12) return false;
//         if (timeOfDayFilter === "afternoon" && hour < 12) return false;
//       }

//       if (searchText) {
//         const q = searchText.trim().toLowerCase();
//         if (!appt.patientName.toLowerCase().includes(q)) {
//           return false;
//         }
//       }
//       return true;
//     });
//   }, [appointments, selectedDate, filterStatus, searchText, timeOfDayFilter]);

//   // تجميع حسب الوقت للـ Timeline
//   const timelineAppointments = useMemo(() => {
//     const appts = filteredAppointments.slice().sort((a, b) => {
//       if (a.time < b.time) return -1;
//       if (a.time > b.time) return 1;
//       return 0;
//     });
//     return appts;
//   }, [filteredAppointments]);

//   // إحصائيات
//   const stats = useMemo(() => {
//     const total = filteredAppointments.length;
//     const booked = filteredAppointments.filter((a) => a.status === "Booked").length;
//     const canceled = filteredAppointments.filter((a) => a.status === "Canceled").length;
//     const confirmed = filteredAppointments.filter((a) => a.status === "Confirmed").length;
    
//     // إحصائيات حسب الوقت
//     const morning = filteredAppointments.filter(a => {
//       const hour = parseInt(a.time.split(':')[0]);
//       return hour < 12;
//     }).length;
    
//     const afternoon = filteredAppointments.filter(a => {
//       const hour = parseInt(a.time.split(':')[0]);
//       return hour >= 12;
//     }).length;
    
//     return { total, booked, canceled, confirmed, morning, afternoon };
//   }, [filteredAppointments]);

//   // تنبيه للمواعيد القادمة (داخل ساعة من الآن)
//   useEffect(() => {
//     const now = new Date();
//     const soonAppt = appointments.find((a) => {
//       if (a.status !== "Booked" && a.status !== "Confirmed") return false;
//       const apptDateTime = new Date(`${a.date}T${a.time}:00`);
//       const diff = (apptDateTime.getTime() - now.getTime()) / (60 * 1000); // بالدقائق
//       return diff > 0 && diff <= 60;
//     });
//     if (soonAppt) {
//       setAlertMsg(t("upcomingAlert", { patient: soonAppt.patientName, time: soonAppt.time }));
//     } else {
//       setAlertMsg(null);
//     }
//   }, [appointments, t]);

//   // إجراءات الموعد
//   function handleReschedule(id: number) {
//     const appt = appointments.find((a) => a.id === id);
//     if (!appt) return;
//     setModalAppt(appt);
//   }

//   function handleCancel(id: number) {
//     setAppointments((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, status: "Canceled" } : a))
//     );
//     alert(t("canceledAlert", { id }));
//   }

//   function handleConfirm(id: number) {
//     setAppointments((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? { ...a, status: "Confirmed" }
//           : a
//       )
//     );
//     alert(t("confirmedAlert", { id }));
//   }

//   // تحديث الموعد من المودال
//   function saveModalChanges(updated: Appointment) {
//     setAppointments((prev) =>
//       prev.map((a) => (a.id === updated.id ? { ...updated, status: updated.status } : a))
//     );
//     setModalAppt(null);
//   }

//   // أزرار تصدير (مجرد توضيح - بدون تنفيذ حقيقي)
//   function exportData(type: "pdf" | "excel") {
//     alert(`تم تصدير البيانات كـ ${type.toUpperCase()} (هذا تنبيه توضيحي فقط)`);
//     alert(type === "pdf" ? t("exportPdfAlert") : t("exportExcelAlert"));
//   }

//   // التبديل بين الأشهر في التقويم
//   const changeMonth = (direction: "prev" | "next") => {
//     setCurrentMonth(prev => {
//       const newMonth = new Date(prev);
//       if (direction === "prev") {
//         newMonth.setMonth(newMonth.getMonth() - 1);
//       } else {
//         newMonth.setMonth(newMonth.getMonth() + 1);
//       }
//       return newMonth;
//     });
//   };

//   // اختيار تاريخ من التقويم
//   const handleDateSelect = (date: Date) => {
//     const dateStr = date.toISOString().split('T')[0];
//     setSelectedDate(dateStr);
//   };

//   // تنسيق التاريخ للعرض
//   function formatDateToDay(dateStr: string) {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
//   }

//   // --- عرض المواعيد في الجدول ---
//   function renderTable() {
//     if (filteredAppointments.length === 0) {
//       return (
//         <tr dir={locale === "ar" ? "rtl" : "ltr"}>
//           <td colSpan={6} className="text-center p-8 text-gray-500">
//             {translate("noAppointments", "لا توجد مواعيد")}
//           </td>
//         </tr>
//       );
//     }
//     return filteredAppointments.map((appt) => (
//       <tr 
//         dir={locale === "ar" ? "rtl" : "ltr"} 
//         key={appt.id} 
//         className={`hover:bg-gray-50 border-b ${appt.status === 'Canceled' ? 'bg-red-50' : appt.status === 'Confirmed' ? 'bg-green-50' : ''}`}
//       >
//         <td className="p-3 font-medium">{appt.patientName}</td>
//         <td className="p-3">{formatDateToDay(appt.date)}</td>
//         <td className="p-3">
//           <div className="flex items-center gap-1">
//             <Clock className="w-4 h-4" />
//             {appt.time}
//           </div>
//         </td>
//         <td className="p-3">{appt.doctor}</td>
//         <td className="p-3">
//           <span
//             className={`px-3 py-1 rounded-full text-white text-xs ${
//               appt.status === "Booked"
//                 ? "bg-amber-500"
//                 : appt.status === "Canceled"
//                 ? "bg-red-500"
//                 : "bg-green-600"
//             }`}
//           >
//             {appt.status === "Booked" ? translate("booked", "محجوز") : 
//              appt.status === "Canceled" ? translate("canceled", "ملغي") : 
//              translate("confirmed", "مؤكد")}
//           </span>
//         </td>
//         <td className="p-3">
//           <div className="flex gap-2 justify-end">
//             {(appt.status === "Booked" || appt.status === "Confirmed") && (
//               <>
//                 <button
//                   onClick={() => handleReschedule(appt.id)}
//                   className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-3 py-1.5 hover:bg-blue-200 transition-colors"
//                   title={translate("reschedule", "إعادة جدولة")}
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                 </button>

//                 {appt.status === "Booked" && (
//                   <button
//                     onClick={() => handleConfirm(appt.id)}
//                     className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-3 py-1.5 hover:bg-green-200 transition-colors"
//                     title={translate("confirm", "تأكيد")}
//                   >
//                     <CheckCircle className="w-4 h-4" />
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handleCancel(appt.id)}
//                   className="flex items-center gap-1 bg-red-100 text-red-700 rounded px-3 py-1.5 hover:bg-red-200 transition-colors"
//                   title={translate("cancel", "إلغاء")}
//                 >
//                   <XCircle className="w-4 h-4" />
//                 </button>
//               </>
//             )}
//           </div>
//         </td>
//       </tr>
//     ));
//   }

//   // --- عرض البطاقات ---
//   function renderCards() {
//     if (filteredAppointments.length === 0) {
//       return (
//         <div className="text-center text-gray-500 py-8">
//           {translate("noAppointments", "لا توجد مواعيد")}
//         </div>
//       );
//     }
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredAppointments.map((appt) => (
//           <div
//             key={appt.id}
//             className={`border rounded-lg p-4 shadow-sm transition-all hover:shadow-md ${
//               appt.status === "Booked"
//                 ? "border-amber-400 bg-amber-50"
//                 : appt.status === "Canceled"
//                 ? "border-red-400 bg-red-50"
//                 : "border-green-600 bg-green-50"
//             }`}
//           >
//             <div className="flex justify-between items-start mb-3">
//               <h3 className="text-lg font-bold text-gray-800">{appt.patientName}</h3>
//               <span
//                 className={`px-2 py-1 rounded-full text-white text-xs ${
//                   appt.status === "Booked"
//                     ? "bg-amber-500"
//                     : appt.status === "Canceled"
//                     ? "bg-red-500"
//                     : "bg-green-600"
//                 }`}
//               >
//                 {appt.status === "Booked" ? translate("booked", "محجوز") : 
//                  appt.status === "Canceled" ? translate("canceled", "ملغي") : 
//                  translate("confirmed", "مؤكد")}
//               </span>
//             </div>
            
//             <div className="space-y-2 text-sm text-gray-600">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 <span>{formatDateToDay(appt.date)}</span>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span>{appt.time}</span>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 <span>{appt.doctor}</span>
//               </div>
//             </div>
            
//             <div className="mt-4 flex flex-wrap gap-2">
//               {(appt.status === "Booked" || appt.status === "Confirmed") && (
//                 <>
//                   <button
//                     onClick={() => handleReschedule(appt.id)}
//                     className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-3 py-1.5 text-sm hover:bg-blue-200 transition-colors"
//                     title={translate("reschedule", "إعادة جدولة")}
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                   </button>

//                   {appt.status === "Booked" && (
//                     <button
//                       onClick={() => handleConfirm(appt.id)}
//                       className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-3 py-1.5 text-sm hover:bg-green-200 transition-colors"
//                       title={translate("confirm", "تأكيد")}
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                     </button>
//                   )}

//                   <button
//                     onClick={() => handleCancel(appt.id)}
//                     className="flex items-center gap-1 bg-red-100 text-red-700 rounded px-3 py-1.5 text-sm hover:bg-red-200 transition-colors"
//                     title={translate("cancel", "إلغاء")}
//                   >
//                     <XCircle className="w-4 h-4" />
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // --- عرض المخطط الزمني (Timeline) ---
//   function renderTimeline() {
//     if (timelineAppointments.length === 0) {
//       return (
//         <div className="text-center text-gray-500 py-8">
//           {translate("noAppointments", "لا توجد مواعيد")}
//         </div>
//       );
//     }
    
//     // تجميع المواعيد حسب الوقت
//     const morningAppointments = timelineAppointments.filter(a => {
//       const hour = parseInt(a.time.split(':')[0]);
//       return hour < 12;
//     });
    
//     const afternoonAppointments = timelineAppointments.filter(a => {
//       const hour = parseInt(a.time.split(':')[0]);
//       return hour >= 12;
//     });
    
//     return (
//       <div className="space-y-6">
//         {/* المواعيد الصباحية */}
//         {morningAppointments.length > 0 && (
//           <div>
//             <div className="flex items-center gap-2 mb-4 text-amber-600">
//               <Sun className="w-5 h-5" />
//               <h3 className="font-bold">{translate("morning", "الصباح")}</h3>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {morningAppointments.map((appt) => (
//                 <AppointmentCard key={appt.id} appt={appt} />
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* المواعيد المسائية */}
//         {afternoonAppointments.length > 0 && (
//           <div>
//             <div className="flex items-center gap-2 mb-4 text-blue-600">
//               <Moon className="w-5 h-5" />
//               <h3 className="font-bold">{translate("afternoon", "المساء")}</h3>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {afternoonAppointments.map((appt) => (
//                 <AppointmentCard key={appt.id} appt={appt} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
  
//   // بطاقة موعد للمخطط الزمني
//   function AppointmentCard({ appt }: { appt: Appointment }) {
//     return (
//       <div
//         className={`border rounded-lg p-4 shadow-sm transition-all hover:shadow-md ${
//           appt.status === "Booked"
//             ? "border-amber-400 bg-amber-50"
//             : appt.status === "Canceled"
//             ? "border-red-400 bg-red-50"
//             : "border-green-600 bg-green-50"
//         }`}
//       >
//         <div className="flex justify-between items-start mb-3">
//           <h3 className="text-lg font-bold text-gray-800">{appt.patientName}</h3>
//           <span
//             className={`px-2 py-1 rounded-full text-white text-xs ${
//               appt.status === "Booked"
//                 ? "bg-amber-500"
//                 : appt.status === "Canceled"
//                 ? "bg-red-500"
//                 : "bg-green-600"
//             }`}
//           >
//             {appt.status === "Booked" ? translate("booked", "محجوز") : 
//              appt.status === "Canceled" ? translate("canceled", "ملغي") : 
//              translate("confirmed", "مؤكد")}
//           </span>
//         </div>
        
//         <div className="space-y-2 text-sm text-gray-600">
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4" />
//             <span className="font-mono font-bold">{appt.time}</span>
//           </div>
//         </div>
        
//         <div className="mt-4 flex gap-2">
//           {(appt.status === "Booked" || appt.status === "Confirmed") && (
//             <>
//               <button
//                 onClick={() => handleReschedule(appt.id)}
//                 className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-3 py-1.5 text-sm hover:bg-blue-200 transition-colors"
//                 title={translate("reschedule", "إعادة جدولة")}
//               >
//                 <RefreshCw className="w-4 h-4" />
//               </button>

//               {appt.status === "Booked" && (
//                 <button
//                   onClick={() => handleConfirm(appt.id)}
//                   className="flex items-center gap-1 bg-green-100 text-green-700 rounded px-3 py-1.5 text-sm hover:bg-green-200 transition-colors"
//                   title={translate("confirm", "تأكيد")}
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                 </button>
//               )}

//               <button
//                 onClick={() => handleCancel(appt.id)}
//                 className="flex items-center gap-1 bg-red-100 text-red-700 rounded px-3 py-1.5 text-sm hover:bg-red-200 transition-colors"
//                 title={translate("cancel", "إلغاء")}
//               >
//                 <XCircle className="w-4 h-4" />
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // --- مودال التعديل ---
//   function EditModal({
//     appointment,
//     onClose,
//     onSave,
//   }: {
//     appointment: Appointment;
//     onClose: () => void;
//     onSave: (updated: Appointment) => void;
//   }) {
//     const [patientName, setPatientName] = useState(appointment.patientName);
//     const [date, setDate] = useState(appointment.date);
//     const [time, setTime] = useState(appointment.time);
//     const [status, setStatus] = useState<Appointment["status"]>(appointment.status);
//     const [doctor, setDoctor] = useState(appointment.doctor);

//     function save() {
//       if (!patientName || !date || !time || !status || !doctor) {
//         alert("يرجى ملء جميع الحقول");
//         return;
//       }
//       onSave({
//         ...appointment,
//         patientName,
//         date,
//         time,
//         status,
//         doctor,
//       });
//     }

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
//         <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
//           <h3 className="text-lg font-bold mb-4 text-right">{translate("editAppointment", "تعديل الموعد")}</h3>

//           <div className="space-y-4">
//             <label className="block text-right">
//               <span className="block mb-1">{translate("patientName", "اسم المريض")}</span>
//               <input
//                 type="text"
//                 value={patientName}
//                 onChange={(e) => setPatientName(e.target.value)}
//                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//               />
//             </label>

//             <label className="block text-right">
//               <span className="block mb-1">{translate("date", "التاريخ")}</span>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//               />
//             </label>

//             <label className="block text-right">
//               <span className="block mb-1">{translate("time", "الوقت")}</span>
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//               />
//             </label>

//             <label className="block text-right">
//               <span className="block mb-1">{translate("status", "الحالة")}</span>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value as Appointment["status"])}
//                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//               >
//                 <option value="Booked">{translate("booked", "محجوز")}</option>
//                 <option value="Canceled">{translate("canceled", "ملغي")}</option>
//                 <option value="Confirmed">{translate("confirmed", "مؤكد")}</option>
//               </select>
//             </label>

//             <label className="block text-right">
//               <span className="block mb-1">{translate("doctor", "الطبيب")}</span>
//               <input
//                 type="text"
//                 value={doctor}
//                 readOnly
//                 className="w-full border rounded px-3 py-2 bg-gray-100"
//                 dir="rtl"
//               />
//               <small className="text-gray-500 block mt-1">{translate("doctorReadOnly", "الطبيب غير قابل للتغيير")}</small>
//             </label>
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
//             >
//               {translate("cancel", "إلغاء")}
//             </button>
//             <button
//               onClick={save}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//             >
//               {translate("save", "حفظ")}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-gray-50">
//       {/* === الهيدر والشريط العلوي === */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="bg-blue-100 p-2 rounded-lg">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {translate("appointmentsTitle", "مواعيد العيادة")}
//               </h1>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//               >
//                 <Filter className="w-4 h-4" />
//                 <span>{translate("filters", "الفلاتر")}</span>
//               </button>
              
//               <div className="flex bg-gray-100 rounded-lg p-1">
//                 {(["table", "cards", "timeline"] as ViewMode[]).map((mode) => (
//                   <button
//                     key={mode}
//                     onClick={() => setViewMode(mode)}
//                     className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
//                       viewMode === mode
//                         ? "bg-white text-blue-600 shadow-sm"
//                         : "text-gray-600 hover:text-gray-800"
//                     }`}
//                   >
//                     {mode === "table" ? translate("table", "جدول") :
//                      mode === "cards" ? translate("cards", "بطاقات") :
//                      translate("timeline", "زمني")}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* === المحتوى الرئيسي === */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* === الشريط الجانبي للفلترة === */}
//           <aside className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
//             {/* البحث */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
//                 <SearchIcon className="w-4 h-4" />
//                 {translate("search", "بحث")}
//               </h3>
//               <input
//                 type="search"
//                 placeholder={translate("searchPlaceholder", "ابحث باسم المريض...")}
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dir="rtl"
//               />
//             </div>

//             {/* التقويم */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3">{translate("calendar", "التقويم")}</h3>
              
//               <div className="flex items-center justify-between mb-3">
//                 <button 
//                   onClick={() => changeMonth("prev")}
//                   className="p-1 rounded-full hover:bg-gray-100"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
                
//                 <h4 className="font-medium">
//                   {currentMonth.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
//                 </h4>
                
//                 <button 
//                   onClick={() => changeMonth("next")}
//                   className="p-1 rounded-full hover:bg-gray-100"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-7 gap-1 mb-2">
//                 {["أ", "إ", "ث", "أ", "خ", "ج", "س"].map(day => (
//                   <div key={day} className="text-center text-xs text-gray-500 py-1">
//                     {day}
//                   </div>
//                 ))}
//               </div>
              
//               <div className="grid grid-cols-7 gap-1">
//                 {daysInMonth.map((day, index) => {
//                   const dateStr = day.date.toISOString().split('T')[0];
//                   const isSelected = selectedDate === dateStr;
//                   const isToday = dateStr === new Date().toISOString().split('T')[0];
                  
//                   return (
//                     <button
//                       key={index}
//                       onClick={() => handleDateSelect(day.date)}
//                       disabled={!day.isCurrentMonth}
//                       className={`p-1.5 rounded-full text-sm flex items-center justify-center relative
//                         ${!day.isCurrentMonth ? 'text-gray-300' : 
//                           isSelected ? 'bg-blue-600 text-white' :
//                           isToday ? 'border border-blue-600 text-blue-600' :
//                           'text-gray-700 hover:bg-gray-100'}
//                       `}
//                     >
//                       {day.date.getDate()}
//                       {day.hasAppointments && day.isCurrentMonth && !isSelected && (
//                         <span className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full"></span>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
              
//               <button
//                 onClick={() => setSelectedDate(null)}
//                 className={`w-full mt-3 py-2 text-sm rounded-lg ${selectedDate === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//               >
//                 {translate("allDates", "جميع الأيام")}
//               </button>
//             </div>

//             {/* الفلترة */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
//                 <Filter className="w-4 h-4" />
//                 {translate("filters", "الفلاتر")}
//               </h3>
              
//               <div className="space-y-4">
//                 {/* حالة الموعد */}
//                 <div>
//                   <h4 className="font-medium text-sm mb-2">{translate("status", "الحالة")}</h4>
//                   <div className="space-y-2">
//                     {[
//                       { value: "Booked", label: translate("booked", "محجوز"), color: "bg-amber-500" },
//                       { value: "Canceled", label: translate("canceled", "ملغي"), color: "bg-red-500" },
//                       { value: "Confirmed", label: translate("confirmed", "مؤكد"), color: "bg-green-600" }
//                     ].map((status) => (
//                       <label key={status.value} className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={filterStatus.includes(status.value)}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setFilterStatus((prev) => [...prev, status.value]);
//                             } else {
//                               setFilterStatus((prev) => prev.filter((s) => s !== status.value));
//                             }
//                           }}
//                           className="rounded text-blue-600 focus:ring-blue-500"
//                         />
//                         <div className="flex items-center gap-2">
//                           <span className={`w-3 h-3 rounded-full ${status.color}`}></span>
//                           <span>{status.label}</span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => setFilterStatus([])}
//                     className="text-sm text-blue-600 hover:underline mt-2"
//                   >
//                     {translate("clearAll", "مسح الكل")}
//                   </button>
//                 </div>
                
//                 {/* وقت اليوم */}
//                 <div>
//                   <h4 className="font-medium text-sm mb-2">{translate("timeOfDay", "وقت اليوم")}</h4>
//                   <div className="grid grid-cols-3 gap-2">
//                     {[
//                       { value: "all", label: translate("all", "الكل"), icon: null },
//                       { value: "morning", label: translate("morning", "الصباح"), icon: <Sun className="w-4 h-4" /> },
//                       { value: "afternoon", label: translate("afternoon", "المساء"), icon: <Moon className="w-4 h-4" /> }
//                     ].map((time) => (
//                       <button
//                         key={time.value}
//                         onClick={() => setTimeOfDayFilter(time.value as TimeOfDayFilter)}
//                         className={`py-2 rounded-lg text-sm flex flex-col items-center justify-center gap-1 ${timeOfDayFilter === time.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                       >
//                         {time.icon}
//                         <span>{time.label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* الإحصائيات */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
//                 <BarChart3 className="w-4 h-4" />
//                 {translate("statistics", "الإحصائيات")}
//               </h3>
              
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">{translate("totalAppointments", "إجمالي المواعيد")}</span>
//                   <span className="font-medium">{stats.total}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <span className="w-3 h-3 rounded-full bg-amber-500"></span>
//                     <span className="text-sm text-gray-600">{translate("booked", "محجوز")}</span>
//                   </div>
//                   <span className="font-medium">{stats.booked}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <span className="w-3 h-3 rounded-full bg-green-600"></span>
//                     <span className="text-sm text-gray-600">{translate("confirmed", "مؤكد")}</span>
//                   </div>
//                   <span className="font-medium">{stats.confirmed}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <span className="w-3 h-3 rounded-full bg-red-500"></span>
//                     <span className="text-sm text-gray-600">{translate("canceled", "ملغي")}</span>
//                   </div>
//                   <span className="font-medium">{stats.canceled}</span>
//                 </div>
                
//                 <div className="pt-2 border-t border-gray-200">
//                   <div className="flex justify-between items-center mb-2">
//                     <div className="flex items-center gap-2">
//                       <Sun className="w-4 h-4 text-amber-500" />
//                       <span className="text-sm text-gray-600">{translate("morning", "الصباح")}</span>
//                     </div>
//                     <span className="font-medium">{stats.morning}</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <Moon className="w-4 h-4 text-blue-500" />
//                       <span className="text-sm text-gray-600">{translate("afternoon", "المساء")}</span>
//                     </div>
//                     <span className="font-medium">{stats.afternoon}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* أزرار التصدير */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="font-medium text-gray-700 mb-3">{translate("export", "تصدير البيانات")}</h3>
              
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   onClick={() => exportData("pdf")}
//                   className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition-colors"
//                 >
//                   <Download className="w-4 h-4" />
//                   <span className="text-sm">PDF</span>
//                 </button>
                
//                 <button
//                   onClick={() => exportData("excel")}
//                   className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors"
//                 >
//                   <Download className="w-4 h-4" />
//                   <span className="text-sm">Excel</span>
//                 </button>
//               </div>
//             </div>
//           </aside>

//           {/* === المحتوى الرئيسي === */}
//           <main className="flex-1">
//             {/* ملخص اليوم */}
//             {selectedDate && (
//               <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-800">
//                       {formatDateToDay(selectedDate)}
//                     </h2>
//                     <p className="text-gray-600">
//                       {translate("totalAppointments", "إجمالي المواعيد")}: <span className="font-medium">{stats.total}</span>
//                     </p>
//                   </div>
                  
//                   <div className="flex gap-4">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-amber-600">{stats.booked}</div>
//                       <div className="text-sm text-gray-600">{translate("booked", "محجوز")}</div>
//                     </div>
                    
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
//                       <div className="text-sm text-gray-600">{translate("confirmed", "مؤكد")}</div>
//                     </div>
                    
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
//                       <div className="text-sm text-gray-600">{translate("canceled", "ملغي")}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* التنبيه */}
//             {alertMsg && (
//               <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-lg mb-6 flex items-start gap-3">
//                 <div className="flex-1">
//                   <p className="font-medium">{translate("upcomingAppointment", "موعد قادم")}</p>
//                   <p>{alertMsg}</p>
//                 </div>
//                 <button
//                   onClick={() => setAlertMsg(null)}
//                   className="text-amber-700 hover:text-amber-900 text-lg"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}

//             {/* عرض المواعيد حسب اختيار المستخدم */}
//             <section className="bg-white rounded-lg shadow-sm p-4">
//               {viewMode === "table" && (
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-right" dir={locale === "ar" ? "rtl" : "ltr"}>
//                     <thead>
//                       <tr className="border-b border-gray-200">
//                         <th className="p-3 text-sm font-medium text-gray-600">{translate("patient", "المريض")}</th>
//                         <th className="p-3 text-sm font-medium text-gray-600">{translate("date", "التاريخ")}</th>
//                         <th className="p-3 text-sm font-medium text-gray-600">{translate("time", "الوقت")}</th>
//                         <th className="p-3 text-sm font-medium text-gray-600">{translate("doctor", "الطبيب")}</th>
//                         <th className="p-3 text-sm font-medium text-gray-600">{translate("status", "الحالة")}</th>
//                         <th className="p-3 text-sm font-medium text-gray-600 text-center">{translate("actions", "الإجراءات")}</th>
//                       </tr>
//                     </thead>
//                     <tbody>{renderTable()}</tbody>
//                   </table>
//                 </div>
//               )}
              
//               {viewMode === "cards" && <div dir="rtl">{renderCards()}</div>}
//               {viewMode === "timeline" && <div dir="rtl">{renderTimeline()}</div>}
//             </section>
//           </main>
//         </div>
//       </div>

//       {/* --- مودال التعديل --- */}
//       {modalAppt && (
//         <EditModal
//           appointment={modalAppt}
//           onClose={() => setModalAppt(null)}
//           onSave={saveModalChanges}
//         />
//       )}
//     </div>
//   );
// }













// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import {Calendar,Clock,RefreshCw,XCircle,CheckCircle,Download,Search as SearchIcon,} from "lucide-react";
// import { useTranslations } from "next-intl";
// import type { Locale } from "@/types";

// interface Appointment {
//   id: number;
//   patientName: string;
//   date: string; // YYYY-MM-DD
//   time: string; // HH:mm
//   status: "Booked" | "Canceled" | "Confirmed";
//   doctor: string; // يمكن تركها لكن لا نستخدم فلترة عليها
// }

// const appointmentsData: Appointment[] = [
//   { id: 1, patientName: "محمد علي", date: "2025-08-11", time: "10:00", status: "Booked", doctor: "د. أحمد" },
//   { id: 2, patientName: "سارة محمود", date: "2025-08-11", time: "11:30", status: "Canceled", doctor: "د. أحمد" },
//   { id: 3, patientName: "علي حسن", date: "2025-08-12", time: "09:00", status: "Booked", doctor: "د. أحمد" },
//   { id: 4, patientName: "ليلى محمد", date: "2025-08-15", time: "14:00", status: "Booked", doctor: "د. أحمد" },
//   { id: 5, patientName: "سلمان علي", date: "2025-08-11", time: "15:30", status: "Confirmed", doctor: "د. أحمد" },
//   { id: 6, patientName: "هالة يوسف", date: "2025-08-12", time: "12:00", status: "Booked", doctor: "د. أحمد" },
// ];

// type ViewMode = "table" | "cards" | "timeline";

// function formatDateToDay(dateStr: string) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
// }

// export default function AppointmentsPage({ locale }: { locale: Locale }) {
//   const t = useTranslations("Appointments");
//   const translate = React.useCallback(
//       (key: string, defaultValue?: string) => {
//         const translation = t(key);
//         return translation === key && defaultValue ? defaultValue : translation;
//       },
//       [t]
//     );
//   const [appointments, setAppointments] = useState(appointmentsData);
//   const [viewMode, setViewMode] = useState<ViewMode>("table");
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
//   const [alertMsg, setAlertMsg] = useState<string | null>(null);

//   // استخراج تواريخ المواعيد (لتقسيم الأيام)
//   const dates = useMemo(() => {
//     const allDates = Array.from(new Set(appointments.map((a) => a.date))).sort();
//     return allDates;
//   }, [appointments]);

//   // ضبط التاريخ المختار تلقائيًا ليكون أول تاريخ
//   useEffect(() => {
//     if (!selectedDate && dates.length) setSelectedDate(dates[0]);
//   }, [dates, selectedDate]);

//   // فلترة البيانات
//   const filteredAppointments = useMemo(() => {
//     return appointments.filter((appt) => {
//       if (selectedDate && appt.date !== selectedDate) return false;

//       if (filterStatus.length > 0 && !filterStatus.includes(appt.status)) return false;

//       if (searchText) {
//         const q = searchText.trim().toLowerCase();
//         if (
//           !appt.patientName.toLowerCase().includes(q)
//         ) {
//           return false;
//         }
//       }
//       return true;
//     });
//   }, [appointments, selectedDate, filterStatus, searchText]);

//   // تجميع حسب الوقت للـ Timeline
//   const timelineAppointments = useMemo(() => {
//     const appts = filteredAppointments.slice().sort((a, b) => {
//       if (a.time < b.time) return -1;
//       if (a.time > b.time) return 1;
//       return 0;
//     });
//     return appts;
//   }, [filteredAppointments]);

//   // إحصائيات
//   const stats = useMemo(() => {
//     const total = filteredAppointments.length;
//     const booked = filteredAppointments.filter((a) => a.status === "Booked").length;
//     const canceled = filteredAppointments.filter((a) => a.status === "Canceled").length;
//     const confirmed = filteredAppointments.filter((a) => a.status === "Confirmed").length;
//     return { total, booked, canceled, confirmed };
//   }, [filteredAppointments]);

//   // تنبيه للمواعيد القادمة (داخل ساعة من الآن)
//   useEffect(() => {
//     const now = new Date();
//     const soonAppt = appointments.find((a) => {
//       if (a.status !== "Booked" && a.status !== "Confirmed") return false;
//       const apptDateTime = new Date(`${a.date}T${a.time}:00`);
//       const diff = (apptDateTime.getTime() - now.getTime()) / (60 * 1000); // بالدقائق
//       return diff > 0 && diff <= 60;
//     });
//     if (soonAppt) {
//  setAlertMsg(t("upcomingAlert", { patient: soonAppt.patientName, time: soonAppt.time }));
//     } else {
//       setAlertMsg(null);
//     }
//   }, [appointments]);

//   // إجراءات الموعد
//   function handleReschedule(id: number) {
//     const appt = appointments.find((a) => a.id === id);
//     if (!appt) return;
//     setModalAppt(appt);
//   }

//   function handleCancel(id: number) {
//     setAppointments((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, status: "Canceled" } : a))
//     );
//  alert(t("canceledAlert", { id }));
//   }

//   function handleConfirm(id: number) {
//     setAppointments((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? { ...a, status: "Confirmed" }
//           : a
//       )
//     );
//  alert(t("confirmedAlert", { id }));
//   }

//   // تحديث الموعد من المودال
//   function saveModalChanges(updated: Appointment) {
//     setAppointments((prev) =>
//       prev.map((a) => (a.id === updated.id ? { ...updated, status: updated.status } : a))
//     );
//     setModalAppt(null);
//   }

//   // أزرار تصدير (مجرد توضيح - بدون تنفيذ حقيقي)
//   function exportData(type: "pdf" | "excel") {
//     alert(`تم تصدير البيانات كـ ${type.toUpperCase()} (هذا تنبيه توضيحي فقط)`);
//     alert(type === "pdf" ? t("exportPdfAlert") : t("exportExcelAlert"));
//   }

//   // --- عرض المواعيد في الجدول ---
//   function renderTable() {
//     if (filteredAppointments.length === 0) {
//       return (
//         <tr dir={locale === "ar" ? "rtl" : "ltr"}>
//           <td colSpan={6} className="text-center p-4 text-gray-500">
//             {translate("noAppointments", "noAppointments")}
//           </td>
//         </tr>
//       );
//     }
//     return filteredAppointments.map((appt) => (
//  <tr dir={locale === "ar" ? "rtl" : "ltr"} key={appt.id} className={`hover:bg-gray-50 ${appt.status === 'Canceled' ? 'bg-red-100' : appt.status === 'Confirmed' ? 'bg-green-100' : ''}`}>
//         <td className="p-2">{appt.patientName}</td>
//         <td className="p-">{formatDateToDay(appt.date)}</td>
//         <td className="p-2 flex items-center gap-1"><Clock className="w-4 h-4" />{appt.time}</td>
//         <td className="p-2">{appt.doctor}</td>
//         <td className="p-2">
//           <span
//             className={`px-2 py-1 rounded-full text-white text-xs ${
//               appt.status === "Booked"
//                 ? "bg-blue-500"
//                 : appt.status === "Canceled"
//                 ? "bg-red-500"
//                 : "bg-green-600"
//             }`}
//           >
//             {appt.status}
//           </span>
//         </td>
//          <td className="p-2 flex gap-1 justify-center">
//           {(appt.status === "Booked" || appt.status === "Confirmed") && (
//             <>
//               <button
//                 onClick={() => handleReschedule(appt.id)}
//                 className="flex items-center gap-1 border border-blue-500 text-blue-500 rounded px-2 py-1 hover:bg-blue-50"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 {translate("reschedule", "reschedule")} 
//               </button>

//               {appt.status === "Booked" && (
//                 <>
//                   <button
//                     onClick={() => handleCancel(appt.id)}
//                     className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
//                   >
//                     <XCircle className="w-4 h-4" />
//                     {translate("cancel", "cancel")}
//                   </button>

//                   <button
//                     onClick={() => handleConfirm(appt.id)}
//                     className="flex items-center gap-1 border border-green-600 text-green-600 rounded px-2 py-1 hover:bg-green-50"
//                   >
//                     <CheckCircle className="w-4 h-4" />
//                     {translate("confirm", "confirm")}
//                   </button>
//                 </>
//               )}

//               {appt.status === "Confirmed" && (
//                 <button
//                   onClick={() => handleCancel(appt.id)}
//                   className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
//                 >
//                   <XCircle className="w-4 h-4" />
//                   {translate("cancel", "cancel")}
//                 </button>
//               )}
//             </>
//           )}
//         </td>

//       </tr>
//     ));
//   }

//   // --- عرض البطاقات ---
//   function renderCards() {
//     if (filteredAppointments.length === 0) {
//       return (
//         <div className="text-center text-gray-500 py-8">{translate("noAppointments", "noAppointments")}</div>
//       );
//     }
//     return filteredAppointments.map((appt) => (
//       <div
//         key={appt.id}
//         className={`border rounded-md p-4 mb-4 shadow-sm ${
//           appt.status === "Booked"
//             ? "border-blue-400"
//             : appt.status === "Canceled"
//             ? "border-red-400"
//             : "border-green-600"
//         }`}
//       >
//         <h3 className="text-lg font-bold mb-1">{appt.patientName}</h3>
//         <p>
//           <Calendar className="inline w-4 h-4 mr-1" />
//           {formatDateToDay(appt.date)}
//         </p>
//         <p>
//           <Clock className="inline w-4 h-4 mr-1" />
//           {appt.time}
//         </p>
//         <p>{translate("doctor", "doctor")}: {appt.doctor}</p>
//         <p>
//           {translate("status", "status")}:{" "}
//           <span
//             className={`px-2 py-1 rounded-full text-white text-xs ${
//               appt.status === "Booked"
//                 ? "bg-blue-500"
//                 : appt.status === "Canceled"
//                 ? "bg-red-500"
//                 : "bg-green-600"
//             }`}
//           >
//             {appt.status}
//           </span>
//         </p>
//         <div className="mt-2 flex flex-wrap gap-2">
//           {(appt.status === "Booked" || appt.status === "Confirmed") && (
//             <>
//               <button
//                 onClick={() => handleReschedule(appt.id)}
//                 className="flex items-center gap-1 border border-blue-500 text-blue-500 rounded px-3 py-1 hover:bg-blue-50"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 {translate("reschedule", "reschedule")}
//               </button>
//               <button
//                 onClick={() => handleCancel(appt.id)}
//                 className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-3 py-1 hover:bg-red-50"
//               >
//                 <XCircle className="w-4 h-4" />
//                 {translate("cancel", "cancel")}
//               </button>
//               {appt.status !== "Confirmed" && (
//                 <button
//                   onClick={() => handleConfirm(appt.id)}
//                   className="flex items-center gap-1 border border-green-600 text-green-600 rounded px-3 py-1 hover:bg-green-50"
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   {translate("confirm", "confirm")}
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     ));
//   }

//   // --- عرض المخطط الزمني (Timeline) ---
//   function renderTimeline() {
//     if (timelineAppointments.length === 0) {
//       return (
//         <div className="text-center text-gray-500 py-8">{translate("noAppointments", "noAppointments")}</div>
//       );
//     }
//     return (
//       <div className="flex overflow-x-auto gap-6 p-4">
//         {timelineAppointments.map((appt) => (
//           <div
//             key={appt.id}
//             className={`min-w-[200px] border rounded-md p-4 shadow-md flex-shrink-0 ${
//               appt.status === "Booked"
//                 ? "border-blue-400 bg-blue-50"
//                 : appt.status === "Canceled"
//                 ? "border-red-400 bg-red-50"
//                 : "border-green-600 bg-green-50"
//             }`}
//           >
//             <h4 className="font-semibold mb-1">{appt.patientName}</h4>
//             <p className="text-sm mb-1">{formatDateToDay(appt.date)}</p>
//             <p className="flex items-center gap-1 font-mono text-lg font-bold">
//               <Clock className="w-5 h-5" />
//               {appt.time}
//             </p>
//             <p>{translate("doctor", "doctor")}: {appt.doctor}</p>
//             <p>
//               {translate("status", "status")}:{" "}
//               <span
//                 className={`px-2 py-1 rounded-full text-white text-xs ${
//                   appt.status === "Booked"
//                     ? "bg-blue-500"
//                     : appt.status === "Canceled"
//                     ? "bg-red-500"
//                     : "bg-green-600"
//                 }`}
//               >
//                 {appt.status}
//               </span>
//             </p>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // --- مودال التعديل ---
//   function EditModal({
//     appointment,
//     onClose,
//     onSave,
//   }: {
//     appointment: Appointment;
//     onClose: () => void;
//     onSave: (updated: Appointment) => void;
//   }) {
//     const [patientName, setPatientName] = useState(appointment.patientName);
//     const [date, setDate] = useState(appointment.date);
//     const [time, setTime] = useState(appointment.time);
//     const [status, setStatus] = useState<Appointment["status"]>(appointment.status);
//     const [doctor, setDoctor] = useState(appointment.doctor);

//     function save() {
//       if (!patientName || !date || !time || !status || !doctor) {
//         alert("يرجى ملء جميع الحقول");
//         return;
//       }
//       onSave({
//         ...appointment,
//         patientName,
//         date,
//         time,
//         status,
//         doctor,
//       });
//     }

//     return (
//       <div  className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//         <div  className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
//           <h3   className="text-lg font-bold mb-4 text-right">{translate("editAppointment", "editAppointment")}</h3>

//           <label className="block mb-2 text-right">
//             {translate("patientName", "patientName")}
//             <input
//               type="text"
//               value={patientName}
//               onChange={(e) => setPatientName(e.target.value)}
//               className="w-full border rounded px-2 py-1 mt-1"
//               dir="rtl"
//             />
//           </label>

//           <label className="block mb-2 text-right">
//             {translate("date", "date")}:
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full border rounded px-2 py-1 mt-1"
//               dir="rtl"
//             />
//           </label>

//           <label className="block mb-2 text-right">
//             {translate("time", "time")}:
//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               className="w-full border rounded px-2 py-1 mt-1"
//               dir="rtl"
//             />
//           </label>

//           <label className="block mb-2 text-right">
//             {translate("status", "status")}:
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value as Appointment["status"])}
//               className="w-full border rounded px-2 py-1 mt-1"
//               dir="rtl"
//             >
//               <option value="Booked">{translate("booked", "Booked")}</option>
//               <option value="Canceled">{translate("canceled", "Canceled")}</option>
//               <option value="Confirmed">{translate("confirmed", "Confirmed")}</option>
//             </select>
//           </label>

//           <label className="block mb-4 text-right">
//             {translate("doctor", "doctor")}:
//             <input
//               type="text"
//               value={doctor}
//               onChange={(e) => setDoctor(e.target.value)}
//               className="w-full border rounded px-2 py-1 mt-1"
//               dir="rtl"
//               readOnly
//             />
//             <small className="text-gray-500">{translate("doctorReadOnly", "doctorReadOnly")}</small>
//           </label>

//           <div className="flex justify-end gap-2">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border rounded hover:bg-gray-100"
//             >
//               {translate("canceled", "canceled")}
//             </button>
//             <button
//               onClick={save}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               {translate("save", "save")}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-col md:flex-row p-6 gap-6 min-h-screen bg-gray-50">
//       {/* === الشريط الجانبي للفلترة والإحصائيات === */}
//       <aside className="md:w-72 bg-white rounded shadow p-4 flex flex-col gap-6">
//         {/* البحث */}
//         <div>
//           <label className="relative block">
//             <input
//               type="search"
//               placeholder={translate("searchPlaceholder", "Search by name...")}
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               dir="rtl"
//             />
//             <SearchIcon className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
//           </label>
//         </div>

//         {/* الفلترة */}
//         <div>
//           <h4 className="font-bold mb-2">{translate("status", "status")}</h4>
//           <div className="flex flex-col gap-1">
//             {["Booked", "Canceled", "Confirmed"].map((status) => (
//               <label key={status} className="inline-flex items-center gap-2" dir="rtl">
//                 <input
//                   type="checkbox"
//                   checked={filterStatus.includes(status)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setFilterStatus((prev) => [...prev, status]);
//                     } else {
//                       setFilterStatus((prev) =>
//                         prev.filter((s) => s !== status)
//                       );
//                     }
//                   }}
//                 />
//                 <span>{status}</span>
//               </label>
//             ))}
//             <button
//               onClick={() => setFilterStatus([])}
//               className="text-sm text-blue-600 hover:underline mt-1"
//             >
//               {translate("clearAll", "Clear All")}
//             </button>
//           </div>
//         </div>

//         {/* اختيار التاريخ */}
//         <div>
//           <h4 className="font-bold mb-2">{translate("date", "Date")}</h4>
//           <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
//             {dates.map((date) => (
//               <button
//                 key={date}
//                 onClick={() => setSelectedDate(date)}
//                 className={`text-right p-1 rounded ${
//                   selectedDate === date
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-blue-100"
//                 }`}
//               >
//                 {formatDateToDay(date)}
//               </button>
//             ))}
//             <button
//               onClick={() => setSelectedDate(null)}
//               className={`text-right p-1 rounded ${
//                 selectedDate === null ? "bg-blue-600 text-white" : ""
//               }`}
//             >
//               {translate("allDates", "All Dates")}
//             </button>
//           </div>
//         </div>

//         {/* الإحصائيات */}
//         <div>
//           <h4 className="font-bold mb-2">{translate("statistics", "Statistics")}</h4>
//           <ul className="space-y-1 text-sm">
//             <li>{translate("totalAppointments", "Total Appointments")}: <strong>{stats.total}</strong></li>
//             <li>{translate("booked", "Booked")}: <strong>{stats.booked}</strong></li>
//             <li>{translate("canceled", "Canceled")}: <strong>{stats.canceled}</strong></li>
//             <li>{translate("confirmed", "Confirmed")}: <strong>{stats.confirmed}</strong></li>
//           </ul>
//         </div>

//         {/* أزرار التصدير */}
//         <div className="mt-auto flex gap-2">
//           <button
//             onClick={() => exportData("pdf")}
//             className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
//           >
//             <Download className="w-5 h-5" />
//             {translate("exportPdf", "exportPdf")}
//           </button>
//           <button
//             onClick={() => exportData("excel")}
//             className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
//           >
//             <Download className="w-5 h-5" />
//             {translate("exportExcel", "exportExcel")}
//           </button>
//         </div>
//       </aside>

//       {/* === المحتوى الرئيسي === */}
//       <main className="flex-1 flex flex-col gap-4">
//         {/* شريط أدوات العرض */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <Calendar className="w-6 h-6 text-blue-600" />
//             {translate("appointmentsTitle", "Appointments")}
//           </h1>

//           {/* اختيار طريقة العرض */}
//           <div className="flex gap-2">
//             {(["table", "cards", "timeline"] as ViewMode[]).map((mode) => (
//               <button
//                 key={mode}
//                 onClick={() => setViewMode(mode)}
//                 className={`px-3 py-1 rounded ${
//                   viewMode === mode
//                     ? "bg-blue-600 text-white"
//                     : "border border-blue-600 text-blue-600 hover:bg-blue-100"
//                 }`}
//               >
//                 {mode === "table"
//                   ? `${translate("table", "Table")}`
//                   : mode === "cards"
//                   ? `${translate("cards", "Cards")}`
//                   : `${translate("timeline", "Timeline")}`}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* التنبيه */}
//         {alertMsg && (
//           <div className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded shadow flex items-center gap-2">
//             ⚠️ {alertMsg}
//             <button
//               onClick={() => setAlertMsg(null)}
//               className="mr-auto text-lg font-bold hover:text-yellow-900"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* عرض المواعيد حسب اختيار المستخدم */}
//         <section className="bg-white rounded shadow p-4 flex-1 overflow-auto">
//           {viewMode === "table" && (
//             <table className="w-full border-collapse text-right" dir={locale === "ar" ? "rtl" : "ltr"}>
//               <thead>
//                 <tr className="border-b border-gray-300">
//                   <th className="p-2 text-sm">{translate("patient", "patient")}</th>
//                   <th className="p-2 text-sm">{translate("date", "Date")}</th>
//                   <th className="p-2 text-sm">{translate("time", "Time")}</th>
//                   <th className="p-2 text-sm">{translate("doctor", "Doctor")}</th>
//                   <th className="p-2 text-sm">{translate("status", "Status")}</th>
//                   <th className="p-2 text-sm text-center">{translate("actions", "Actions")}</th>
//                 </tr>
//               </thead>
//               <tbody>{renderTable()}</tbody>
//             </table>
//           )}
//           {viewMode === "cards" && <div dir="rtl">{renderCards()}</div>}
//           {viewMode === "timeline" && <div dir="rtl">{renderTimeline()}</div>}
//         </section>
//       </main>

//       {/* --- مودال التعديل --- */}
//       {modalAppt && (
//         <EditModal
//           appointment={modalAppt}
//           onClose={() => setModalAppt(null)}
//           onSave={saveModalChanges}
//         />
//       )}
//     </div>
//   );
// }
