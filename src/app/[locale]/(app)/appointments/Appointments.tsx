"use client";

import React, { useState, useMemo, useEffect } from "react";
import {Calendar,Clock,RefreshCw,XCircle,CheckCircle,Download,Search as SearchIcon,} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/types";

interface Appointment {
  id: number;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "Booked" | "Canceled" | "Confirmed";
  doctor: string; // يمكن تركها لكن لا نستخدم فلترة عليها
}

const appointmentsData: Appointment[] = [
  { id: 1, patientName: "محمد علي", date: "2025-08-11", time: "10:00", status: "Booked", doctor: "د. أحمد" },
  { id: 2, patientName: "سارة محمود", date: "2025-08-11", time: "11:30", status: "Canceled", doctor: "د. أحمد" },
  { id: 3, patientName: "علي حسن", date: "2025-08-12", time: "09:00", status: "Booked", doctor: "د. أحمد" },
  { id: 4, patientName: "ليلى محمد", date: "2025-08-15", time: "14:00", status: "Booked", doctor: "د. أحمد" },
  { id: 5, patientName: "سلمان علي", date: "2025-08-11", time: "15:30", status: "Confirmed", doctor: "د. أحمد" },
  { id: 6, patientName: "هالة يوسف", date: "2025-08-12", time: "12:00", status: "Booked", doctor: "د. أحمد" },
];

type ViewMode = "table" | "cards" | "timeline";

function formatDateToDay(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
}

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
    const booked = filteredAppointments.filter((a) => a.status === "Booked").length;
    const canceled = filteredAppointments.filter((a) => a.status === "Canceled").length;
    const confirmed = filteredAppointments.filter((a) => a.status === "Confirmed").length;
    return { total, booked, canceled, confirmed };
  }, [filteredAppointments]);

  // تنبيه للمواعيد القادمة (داخل ساعة من الآن)
  useEffect(() => {
    const now = new Date();
    const soonAppt = appointments.find((a) => {
      if (a.status !== "Booked" && a.status !== "Confirmed") return false;
      const apptDateTime = new Date(`${a.date}T${a.time}:00`);
      const diff = (apptDateTime.getTime() - now.getTime()) / (60 * 1000); // بالدقائق
      return diff > 0 && diff <= 60;
    });
    if (soonAppt) {
 setAlertMsg(t("upcomingAlert", { patient: soonAppt.patientName, time: soonAppt.time }));
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

  // تحديث الموعد من المودال
  function saveModalChanges(updated: Appointment) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? { ...updated, status: updated.status } : a))
    );
    setModalAppt(null);
  }

  // أزرار تصدير (مجرد توضيح - بدون تنفيذ حقيقي)
  function exportData(type: "pdf" | "excel") {
    alert(`تم تصدير البيانات كـ ${type.toUpperCase()} (هذا تنبيه توضيحي فقط)`);
    alert(type === "pdf" ? t("exportPdfAlert") : t("exportExcelAlert"));
  }

  // --- عرض المواعيد في الجدول ---
  function renderTable() {
    if (filteredAppointments.length === 0) {
      return (
        <tr dir={locale === "ar" ? "rtl" : "ltr"}>
          <td colSpan={6} className="text-center p-4 text-gray-500">
            {translate("noAppointments", "noAppointments")}
          </td>
        </tr>
      );
    }
    return filteredAppointments.map((appt) => (
 <tr dir={locale === "ar" ? "rtl" : "ltr"} key={appt.id} className={`hover:bg-gray-50 ${appt.status === 'Canceled' ? 'bg-red-100' : appt.status === 'Confirmed' ? 'bg-green-100' : ''}`}>
        <td className="p-2">{appt.patientName}</td>
        <td className="p-2">{formatDateToDay(appt.date)}</td>
        <td className="p-2 flex items-center gap-1"><Clock className="w-4 h-4" />{appt.time}</td>
        <td className="p-2">{appt.doctor}</td>
        <td className="p-2">
          <span
            className={`px-2 py-1 rounded-full text-white text-xs ${
              appt.status === "Booked"
                ? "bg-blue-500"
                : appt.status === "Canceled"
                ? "bg-red-500"
                : "bg-green-600"
            }`}
          >
            {appt.status}
          </span>
        </td>
         <td className="p-2 flex gap-1 justify-center">
          {(appt.status === "Booked" || appt.status === "Confirmed") && (
            <>
              <button
                onClick={() => handleReschedule(appt.id)}
                className="flex items-center gap-1 border border-blue-500 text-blue-500 rounded px-2 py-1 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4" />
                {translate("reschedule", "reschedule")} 
              </button>

              {appt.status === "Booked" && (
                <>
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {translate("cancel", "cancel")}
                  </button>

                  <button
                    onClick={() => handleConfirm(appt.id)}
                    className="flex items-center gap-1 border border-green-600 text-green-600 rounded px-2 py-1 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {translate("confirm", "confirm")}
                  </button>
                </>
              )}

              {appt.status === "Confirmed" && (
                <button
                  onClick={() => handleCancel(appt.id)}
                  className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-2 py-1 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  {translate("cancel", "cancel")}
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
        <div className="text-center text-gray-500 py-8">{translate("noAppointments", "noAppointments")}</div>
      );
    }
    return filteredAppointments.map((appt) => (
      <div
        key={appt.id}
        className={`border rounded-md p-4 mb-4 shadow-sm ${
          appt.status === "Booked"
            ? "border-blue-400"
            : appt.status === "Canceled"
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
        <p>{translate("doctor", "doctor")}: {appt.doctor}</p>
        <p>
          {translate("status", "status")}:{" "}
          <span
            className={`px-2 py-1 rounded-full text-white text-xs ${
              appt.status === "Booked"
                ? "bg-blue-500"
                : appt.status === "Canceled"
                ? "bg-red-500"
                : "bg-green-600"
            }`}
          >
            {appt.status}
          </span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(appt.status === "Booked" || appt.status === "Confirmed") && (
            <>
              <button
                onClick={() => handleReschedule(appt.id)}
                className="flex items-center gap-1 border border-blue-500 text-blue-500 rounded px-3 py-1 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4" />
                {translate("reschedule", "reschedule")}
              </button>
              <button
                onClick={() => handleCancel(appt.id)}
                className="flex items-center gap-1 border border-red-500 text-red-500 rounded px-3 py-1 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                {translate("cancel", "cancel")}
              </button>
              {appt.status !== "Confirmed" && (
                <button
                  onClick={() => handleConfirm(appt.id)}
                  className="flex items-center gap-1 border border-green-600 text-green-600 rounded px-3 py-1 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {translate("confirm", "confirm")}
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
        <div className="text-center text-gray-500 py-8">{translate("noAppointments", "noAppointments")}</div>
      );
    }
    return (
      <div className="flex overflow-x-auto gap-6 p-4">
        {timelineAppointments.map((appt) => (
          <div
            key={appt.id}
            className={`min-w-[200px] border rounded-md p-4 shadow-md flex-shrink-0 ${
              appt.status === "Booked"
                ? "border-blue-400 bg-blue-50"
                : appt.status === "Canceled"
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
            <p>{translate("doctor", "doctor")}: {appt.doctor}</p>
            <p>
              {translate("status", "status")}:{" "}
              <span
                className={`px-2 py-1 rounded-full text-white text-xs ${
                  appt.status === "Booked"
                    ? "bg-blue-500"
                    : appt.status === "Canceled"
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
      <div  className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div  className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
          <h3   className="text-lg font-bold mb-4 text-right">{translate("editAppointment", "editAppointment")}</h3>

          <label className="block mb-2 text-right">
            {translate("patientName", "patientName")}
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            />
          </label>

          <label className="block mb-2 text-right">
            {translate("date", "date")}:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            />
          </label>

          <label className="block mb-2 text-right">
            {translate("time", "time")}:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            />
          </label>

          <label className="block mb-2 text-right">
            {translate("status", "status")}:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Appointment["status"])}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
            >
              <option value="Booked">{translate("booked", "Booked")}</option>
              <option value="Canceled">{translate("canceled", "Canceled")}</option>
              <option value="Confirmed">{translate("confirmed", "Confirmed")}</option>
            </select>
          </label>

          <label className="block mb-4 text-right">
            {translate("doctor", "doctor")}:
            <input
              type="text"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              dir="rtl"
              readOnly
            />
            <small className="text-gray-500">{translate("doctorReadOnly", "doctorReadOnly")}</small>
          </label>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {translate("canceled", "canceled")}
            </button>
            <button
              onClick={save}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {translate("save", "save")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-col md:flex-row p-6 gap-6 min-h-screen bg-gray-50">
      {/* === الشريط الجانبي للفلترة والإحصائيات === */}
      <aside className="md:w-72 bg-white rounded shadow p-4 flex flex-col gap-6">
        {/* البحث */}
        <div>
          <label className="relative block">
            <input
              type="search"
              placeholder={translate("searchPlaceholder", "Search by name...")}
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
          <h4 className="font-bold mb-2">{translate("status", "status")}</h4>
          <div className="flex flex-col gap-1">
            {["Booked", "Canceled", "Confirmed"].map((status) => (
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
              {translate("clearAll", "Clear All")}
            </button>
          </div>
        </div>

        {/* اختيار التاريخ */}
        <div>
          <h4 className="font-bold mb-2">{translate("date", "Date")}</h4>
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
              {translate("allDates", "All Dates")}
            </button>
          </div>
        </div>

        {/* الإحصائيات */}
        <div>
          <h4 className="font-bold mb-2">{translate("statistics", "Statistics")}</h4>
          <ul className="space-y-1 text-sm">
            <li>{translate("totalAppointments", "Total Appointments")}: <strong>{stats.total}</strong></li>
            <li>{translate("booked", "Booked")}: <strong>{stats.booked}</strong></li>
            <li>{translate("canceled", "Canceled")}: <strong>{stats.canceled}</strong></li>
            <li>{translate("confirmed", "Confirmed")}: <strong>{stats.confirmed}</strong></li>
          </ul>
        </div>

        {/* أزرار التصدير */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => exportData("pdf")}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {translate("exportPdf", "exportPdf")}
          </button>
          <button
            onClick={() => exportData("excel")}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {translate("exportExcel", "exportExcel")}
          </button>
        </div>
      </aside>

      {/* === المحتوى الرئيسي === */}
      <main className="flex-1 flex flex-col gap-4">
        {/* شريط أدوات العرض */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            {translate("appointmentsTitle", "Appointments")}
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
                  ? `${translate("table", "Table")}`
                  : mode === "cards"
                  ? `${translate("cards", "Cards")}`
                  : `${translate("timeline", "Timeline")}`}
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
            <table className="w-full border-collapse text-right" dir={locale === "ar" ? "rtl" : "ltr"}>
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="p-2 text-sm">{translate("patient", "patient")}</th>
                  <th className="p-2 text-sm">{translate("date", "Date")}</th>
                  <th className="p-2 text-sm">{translate("time", "Time")}</th>
                  <th className="p-2 text-sm">{translate("doctor", "Doctor")}</th>
                  <th className="p-2 text-sm">{translate("status", "Status")}</th>
                  <th className="p-2 text-sm text-center">{translate("actions", "Actions")}</th>
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
