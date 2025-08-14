"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  RefreshCw,
  XCircle,
  CheckCircle,
  Download,
  Search as SearchIcon,
} from "lucide-react";

interface Appointment {
  id: number;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "محجوز" | "ملغي" | "مؤكد";
  doctor: string; // يمكن تركها لكن لا نستخدم فلترة عليها
}

const appointmentsData: Appointment[] = [
  { id: 1, patientName: "محمد علي", date: "2025-08-11", time: "10:00", status: "محجوز", doctor: "د. أحمد" },
  { id: 2, patientName: "سارة محمود", date: "2025-08-11", time: "11:30", status: "ملغي", doctor: "د. أحمد" },
  { id: 3, patientName: "علي حسن", date: "2025-08-12", time: "09:00", status: "محجوز", doctor: "د. أحمد" },
  { id: 4, patientName: "ليلى محمد", date: "2025-08-15", time: "14:00", status: "محجوز", doctor: "د. أحمد" },
  { id: 5, patientName: "سلمان علي", date: "2025-08-11", time: "15:30", status: "مؤكد", doctor: "د. أحمد" },
  { id: 6, patientName: "هالة يوسف", date: "2025-08-12", time: "12:00", status: "محجوز", doctor: "د. أحمد" },
];

type ViewMode = "table" | "cards" | "timeline";

function formatDateToDay(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // استخراج تواريخ المواعيد (لتقسيم الأيام)
  const dates = useMemo(() => {
    const allDates = Array.from(new Set(appointments.map((a) => a.date))).sort();
    return allDates;
  }, [appointments]);

  // ضبط التاريخ المختار تلقائيًا ليكون أول تاريخ
  useEffect(() => {
    if (!selectedDate && dates.length) setSelectedDate(dates[0]);
  }, [dates, selectedDate]);

  // فلترة البيانات
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      if (selectedDate && appt.date !== selectedDate) return false;

      if (filterStatus.length > 0 && !filterStatus.includes(appt.status)) return false;

      if (searchText) {
        const q = searchText.trim().toLowerCase();
        if (
          !appt.patientName.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, selectedDate, filterStatus, searchText]);

  // تجميع حسب الوقت للـ Timeline
  const timelineAppointments = useMemo(() => {
    const appts = filteredAppointments.slice().sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });
    return appts;
  }, [filteredAppointments]);

  // إحصائيات
  const stats = useMemo(() => {
    const total = filteredAppointments.length;
    const booked = filteredAppointments.filter((a) => a.status === "محجوز").length;
    const canceled = filteredAppointments.filter((a) => a.status === "ملغي").length;
    const confirmed = filteredAppointments.filter((a) => a.status === "مؤكد").length;
    return { total, booked, canceled, confirmed };
  }, [filteredAppointments]);

  // تنبيه للمواعيد القادمة (داخل ساعة من الآن)
  useEffect(() => {
    const now = new Date();
    const soonAppt = appointments.find((a) => {
      if (a.status !== "محجوز" && a.status !== "مؤكد") return false;
      const apptDateTime = new Date(`${a.date}T${a.time}:00`);
      const diff = (apptDateTime.getTime() - now.getTime()) / (60 * 1000); // بالدقائق
      return diff > 0 && diff <= 60;
    });
    if (soonAppt) {
      setAlertMsg(`يوجد موعد قريب للمريض ${soonAppt.patientName} في الساعة ${soonAppt.time}`);
    } else {
      setAlertMsg(null);
    }
  }, [appointments]);

  // إجراءات الموعد
  function handleReschedule(id: number) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    setModalAppt(appt);
  }

  function handleCancel(id: number) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ملغي" } : a))
    );
    alert(`تم إلغاء الموعد رقم ${id}`);
  }

  function handleConfirm(id: number) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "مؤكد" }
          : a
      )
    );
    alert(`تم تأكيد الموعد رقم ${id}`);
  }

  // تحديث الموعد من المودال
  function saveModalChanges(updated: Appointment) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    setModalAppt(null);
  }

  // أزرار تصدير (مجرد توضيح - بدون تنفيذ حقيقي)
  function exportData(type: "pdf" | "excel") {
    alert(`تم تصدير البيانات كـ ${type.toUpperCase()} (هذا تنبيه توضيحي فقط)`);
  }

  // --- عرض المواعيد في الجدول ---
  function renderTable() {
    if (filteredAppointments.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center p-4 text-gray-500">
            لا توجد مواعيد
          </td>
        </tr>
      );
    }
    return filteredAppointments.map((appt) => (
      <tr key={appt.id} className="hover:bg-gray-50">
        <td className="p-2">{appt.patientName}</td>
        <td className="p-2">{formatDateToDay(appt.date)}</td>
        <td className="p-2 flex items-center gap-1"><Clock className="w-4 h-4" />{appt.time}</td>
        <td className="p-2">{appt.doctor}</td>
        <td className="p-2">
          <span
            className={`px-2 py-1 rounded-full text-white text-xs ${
              appt.status === "محجوز"
                ? "bg-blue-500"
                : appt.status === "ملغي"
                ? "bg-red-500"
                : "bg-green-600"
            }`}
          >
            {appt.status}
          </span>
        </td>
         <td className="p-2 flex gap-1 justify-center">
          {(appt.status === "محجوز" || appt.status === "مؤكد") && (
            <>
              <button
                onClick={() => handleReschedule(appt.id)}
                className="flex items-center gap-1 border border-blue-500 text-blue-500 rounded px-2 py-1 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة جدولة
              </button>

              {appt.status === "محجوز" && (
                <>
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                    إلغاء
                  </button>

                  <button
                    onClick={() => handleConfirm(appt.id)}
                    className="flex items-center gap-1 border border-green-600 text-green-600 rounded px-2 py-1 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    تأكيد
                  </button>
                </>
              )}

              {appt.status === "مؤكد" && (
                <button
                  onClick={() => handleCancel(appt.id)}
                  className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  إلغاء
                </button>
              )}
            </>
          )}
        </td>

      </tr>
    ));
  }

  // --- عرض البطاقات ---
  function renderCards() {
    if (filteredAppointments.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">لا توجد مواعيد</div>
      );
    }
    return filteredAppointments.map((appt) => (
      <div
        key={appt.id}
        className={`border rounded-md p-4 mb-4 shadow-sm ${
          appt.status === "محجوز"
            ? "border-blue-400"
            : appt.status === "ملغي"
            ? "border-red-400"
            : "border-green-600"
        }`}
      >
        <h3 className="text-lg font-bold mb-1">{appt.patientName}</h3>
        <p>
          <Calendar className="inline w-4 h-4 mr-1" />
          {formatDateToDay(appt.date)}
        </p>
        <p>
          <Clock className="inline w-4 h-4 mr-1" />
          {appt.time}
        </p>
        <p>الطبيب: {appt.doctor}</p>
        <p>
          الحالة:{" "}
          <span
            className={`px-2 py-1 rounded-full text-white text-xs ${
              appt.status === "محجوز"
                ? "bg-blue-500"
                : appt.status === "ملغي"
                ? "bg-red-500"
                : "bg-green-600"
            }`}
          >
            {appt.status}
          </span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(appt.status === "محجوز" || appt.status === "مؤكد") && (
            <>
              <button
                onClick={() => handleReschedule(appt.id)}
                className="flex items-center gap-1 border border-blue-500 text-blue-500 rounded px-3 py-1 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة جدولة
              </button>
              <button
                onClick={() => handleCancel(appt.id)}
                className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-3 py-1 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                إلغاء
              </button>
              {appt.status !== "مؤكد" && (
                <button
                  onClick={() => handleConfirm(appt.id)}
                  className="flex items-center gap-1 border border-green-600 text-green-600 rounded px-3 py-1 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  تأكيد
                </button>
              )}
            </>
          )}
        </div>
      </div>
    ));
  }

  // --- عرض المخطط الزمني (Timeline) ---
  function renderTimeline() {
    if (timelineAppointments.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">لا توجد مواعيد</div>
      );
    }
    return (
      <div className="flex overflow-x-auto gap-6 p-4">
        {timelineAppointments.map((appt) => (
          <div
            key={appt.id}
            className={`min-w-[200px] border rounded-md p-4 shadow-md flex-shrink-0 ${
              appt.status === "محجوز"
                ? "border-blue-400 bg-blue-50"
                : appt.status === "ملغي"
                ? "border-red-400 bg-red-50"
                : "border-green-600 bg-green-50"
            }`}
          >
            <h4 className="font-semibold mb-1">{appt.patientName}</h4>
            <p className="text-sm mb-1">{formatDateToDay(appt.date)}</p>
            <p className="flex items-center gap-1 font-mono text-lg font-bold">
              <Clock className="w-5 h-5" />
              {appt.time}
            </p>
            <p>الطبيب: {appt.doctor}</p>
            <p>
              الحالة:{" "}
              <span
                className={`px-2 py-1 rounded-full text-white text-xs ${
                  appt.status === "محجوز"
                    ? "bg-blue-500"
                    : appt.status === "ملغي"
                    ? "bg-red-500"
                    : "bg-green-600"
                }`}
              >
                {appt.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  // --- مودال التعديل ---
  function EditModal({
    appointment,
    onClose,
    onSave,
  }: {
    appointment: Appointment;
    onClose: () => void;
    onSave: (updated: Appointment) => void;
  }) {
    const [patientName, setPatientName] = useState(appointment.patientName);
    const [date, setDate] = useState(appointment.date);
    const [time, setTime] = useState(appointment.time);
    const [status, setStatus] = useState<Appointment["status"]>(appointment.status);
    const [doctor, setDoctor] = useState(appointment.doctor);

    function save() {
      if (!patientName || !date || !time || !status || !doctor) {
        alert("يرجى ملء جميع الحقول");
        return;
      }
      onSave({
        ...appointment,
        patientName,
        date,
        time,
        status,
        doctor,
      });
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-right">تعديل موعد</h3>

          <label className="block mb-2 text-right">
            اسم المريض:
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            />
          </label>

          <label className="block mb-2 text-right">
            التاريخ:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            />
          </label>

          <label className="block mb-2 text-right">
            الوقت:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            />
          </label>

          <label className="block mb-2 text-right">
            الحالة:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Appointment["status"])}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            >
              <option value="محجوز">محجوز</option>
              <option value="ملغي">ملغي</option>
              <option value="مؤكد">مؤكد</option>
            </select>
          </label>

          <label className="block mb-4 text-right">
            الطبيب:
            <input
              type="text"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
              readOnly
            />
            <small className="text-gray-500">لا يمكن تعديل الطبيب</small>
          </label>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              إلغاء
            </button>
            <button
              onClick={save}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              حفظ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6 min-h-screen bg-gray-50">
      {/* === الشريط الجانبي للفلترة والإحصائيات === */}
      <aside className="md:w-72 bg-white rounded shadow p-4 flex flex-col gap-6">
        {/* البحث */}
        <div>
          <label className="relative block">
            <input
              type="search"
              placeholder="ابحث بالاسم..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
            <SearchIcon className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
          </label>
        </div>

        {/* الفلترة */}
        <div>
          <h4 className="font-bold mb-2">الحالة</h4>
          <div className="flex flex-col gap-1">
            {["محجوز", "ملغي", "مؤكد"].map((status) => (
              <label key={status} className="inline-flex items-center gap-2" dir="rtl">
                <input
                  type="checkbox"
                  checked={filterStatus.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilterStatus((prev) => [...prev, status]);
                    } else {
                      setFilterStatus((prev) =>
                        prev.filter((s) => s !== status)
                      );
                    }
                  }}
                />
                <span>{status}</span>
              </label>
            ))}
            <button
              onClick={() => setFilterStatus([])}
              className="text-sm text-blue-600 hover:underline mt-1"
            >
              مسح الكل
            </button>
          </div>
        </div>

        {/* اختيار التاريخ */}
        <div>
          <h4 className="font-bold mb-2">التاريخ</h4>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`text-right p-1 rounded ${
                  selectedDate === date
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100"
                }`}
              >
                {formatDateToDay(date)}
              </button>
            ))}
            <button
              onClick={() => setSelectedDate(null)}
              className={`text-right p-1 rounded ${
                selectedDate === null ? "bg-blue-600 text-white" : ""
              }`}
            >
              كل التواريخ
            </button>
          </div>
        </div>

        {/* الإحصائيات */}
        <div>
          <h4 className="font-bold mb-2">إحصائيات</h4>
          <ul className="space-y-1 text-sm">
            <li>إجمالي المواعيد: <strong>{stats.total}</strong></li>
            <li>محجوزة: <strong>{stats.booked}</strong></li>
            <li>ملغاة: <strong>{stats.canceled}</strong></li>
            <li>مؤكدة: <strong>{stats.confirmed}</strong></li>
          </ul>
        </div>

        {/* أزرار التصدير */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => exportData("pdf")}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            تصدير PDF
          </button>
          <button
            onClick={() => exportData("excel")}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            تصدير Excel
          </button>
        </div>
      </aside>

      {/* === المحتوى الرئيسي === */}
      <main className="flex-1 flex flex-col gap-4">
        {/* شريط أدوات العرض */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            إدارة المواعيد
          </h1>

          {/* اختيار طريقة العرض */}
          <div className="flex gap-2">
            {(["table", "cards", "timeline"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded ${
                  viewMode === mode
                    ? "bg-blue-600 text-white"
                    : "border border-blue-600 text-blue-600 hover:bg-blue-100"
                }`}
              >
                {mode === "table"
                  ? "جدول"
                  : mode === "cards"
                  ? "بطاقات"
                  : "مخطط زمني"}
              </button>
            ))}
          </div>
        </div>

        {/* التنبيه */}
        {alertMsg && (
          <div className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded shadow flex items-center gap-2">
            ⚠️ {alertMsg}
            <button
              onClick={() => setAlertMsg(null)}
              className="mr-auto text-lg font-bold hover:text-yellow-900"
            >
              ×
            </button>
          </div>
        )}

        {/* عرض المواعيد حسب اختيار المستخدم */}
        <section className="bg-white rounded shadow p-4 flex-1 overflow-auto">
          {viewMode === "table" && (
            <table className="w-full border-collapse text-right" dir="rtl">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="p-2 text-sm">المريض</th>
                  <th className="p-2 text-sm">التاريخ</th>
                  <th className="p-2 text-sm">الوقت</th>
                  <th className="p-2 text-sm">الطبيب</th>
                  <th className="p-2 text-sm">الحالة</th>
                  <th className="p-2 text-sm text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>{renderTable()}</tbody>
            </table>
          )}
          {viewMode === "cards" && <div dir="rtl">{renderCards()}</div>}
          {viewMode === "timeline" && <div dir="rtl">{renderTimeline()}</div>}
        </section>
      </main>

      {/* --- مودال التعديل --- */}
      {modalAppt && (
        <EditModal
          appointment={modalAppt}
          onClose={() => setModalAppt(null)}
          onSave={saveModalChanges}
        />
      )}
    </div>
  );
}
