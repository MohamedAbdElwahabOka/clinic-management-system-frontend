"use client";

import { useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Banknote,
  Phone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock Data (بيانات وهمية للتجربة)
// Mock Data
const appointmentsData = [
  { id: 1, time: '09:00 AM', patient: 'أحمد محمد', type: 'visitTypeNew', status: 'completed', payment: 'paid', avatar: 'AM' },
  { id: 2, time: '09:30 AM', patient: 'سارة علي', type: 'visitTypeConsultation', status: 'in-progress', payment: 'paid', avatar: 'SA' },
  { id: 3, time: '10:00 AM', patient: 'محمود حسن', type: 'visitTypeFollowUp', status: 'waiting', payment: 'unpaid', avatar: 'MH' },
  { id: 4, time: '10:30 AM', patient: 'كريم عادل', type: 'visitTypeNew', status: 'scheduled', payment: 'unpaid', avatar: 'KA' },
  { id: 5, time: '11:00 AM', patient: 'نادية يوسف', type: 'visitTypeNew', status: 'cancelled', payment: 'unpaid', avatar: 'NY' },
];

const patientsDB = [
  {
    id: 101,
    name: "محمد أحمد علي",
    phone: "01012345678",
    age: 34,
    gender: "male",
  },
  {
    id: 102,
    name: "سارة محمود الدين",
    phone: "01012345678",
    age: 28,
    gender: "female",
  },
  {
    id: 103,
    name: "خالد إبراهيم",
    phone: "01012345678",
    age: 45,
    gender: "male",
  },
  { id: 104, name: "علي راشد", phone: "01098765432", age: 50, gender: "male" },
  { id: 105, name: "يوسف كمال", phone: "01012345678", age: 12, gender: "male" },
];

export default function ReceptionAppointments() {
  const t = useTranslations('ReceptionAppointments');
  const [filterStatus, setFilterStatus] = useState("all");
  const [appointments, setAppointments] = useState(appointmentsData);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient: "",
    time: "",
    type: "visitTypeNew",
  });
  const [searchPhone, setSearchPhone] = useState("");
  const [foundPatients, setFoundPatients] = useState<typeof patientsDB>([]);

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPhone(value);
    if (value.length > 3) {
      const results = patientsDB.filter((p) => p.phone.includes(value));
      setFoundPatients(results);
    } else {
      setFoundPatients([]);
    }
  };

  const selectPatient = (name: string) => {
    setFormData({ ...formData, patient: name });
    setFoundPatients([]);
    setSearchPhone("");
  };

  const handleSave = () => {
    const newId = appointments.length + 1;
    const newApp = {
      id: newId,
      time: formData.time || "09:00 AM",
      patient: formData.patient || "زائر",
      type: formData.type,
      status: "scheduled",
      payment: "unpaid",
      avatar: formData.patient
        ? formData.patient
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
        : "UN",
    };

    setAppointments([newApp, ...appointments]);
    setIsOpen(false);
    setFormData({ patient: '', time: '', type: 'visitTypeNew' });
    setSearchPhone('');
    setFoundPatients([]);
  };

  // دالة بسيطة لتحديد لون الحالة
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200 animate-pulse dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "waiting":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"; // scheduled
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('statusCompleted');
      case 'in-progress': return t('statusInProgress');
      case 'waiting': return t('statusWaiting');
      case 'cancelled': return t('statusCancelled');
      default: return t('statusScheduled');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            الأحد، 7 ديسمبر 2025
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 bg-[#0582EB] hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-95 font-medium">
              <Plus className="w-5 h-5" />
              <span>{t('newReservation')}</span>
            </button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[600px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl dark:bg-gray-900/95"
            dir="rtl"
          >
            <div className="p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white text-center">{t('addReservationTitle')}</DialogTitle>
                <DialogDescription className="text-center text-gray-500">
                  {t('addReservationDesc')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Phone Search */}
                <div className="relative space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    بحث بالاسم أو رقم الهاتف
                  </Label>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder={t('searchPlaceholder')}
                      value={searchPhone}
                      onChange={handlePhoneSearch}
                      className="pr-9"
                    />
                  </div>

                  {/* Search Results Dropdown */}
                  {foundPatients.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl max-h-60 overflow-y-auto">
                      <div className="p-2 text-xs text-gray-400 font-medium px-4">{t('searchResults', { count: foundPatients.length })}</div>
                      {foundPatients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => selectPatient(patient.name)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right border-b border-gray-50 dark:border-gray-700 last:border-0"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${patient.gender === "male"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-pink-100 text-pink-600"
                              }`}
                          >
                            {patient.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {patient.name}
                            </p>
                            <p className="text-xs text-gray-500 dir-ltr text-right">
                              {patient.phone}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {patient.age} {t('years')}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Patient Name Display */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('patientName')}</Label>
                  <Input
                    value={formData.patient}
                    onChange={(e) =>
                      setFormData({ ...formData, patient: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-gray-800/50 border-blue-200 dark:border-blue-800"
                    placeholder={t('autoFillPlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('age')}</Label>
                    <Input placeholder="" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('phoneNumber')}</Label>
                    <Input placeholder="" dir="ltr" className="text-right" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('insuranceProvider')}</Label>
                    <Select defaultValue="cash">
                      <SelectTrigger className="text-right" dir="rtl">
                        <SelectValue placeholder={t('select')} />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="cash">{t('insurancePrivate')}</SelectItem>
                        <SelectItem value="insurance">{t('insuranceCoverage')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('gender')}</Label>
                    <Select defaultValue="male">
                      <SelectTrigger className="text-right" dir="rtl">
                        <SelectValue placeholder={t('select')} />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="male">{t('male')}</SelectItem>
                        <SelectItem value="female">{t('female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('reservationTime')}</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('visitType')}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(val) => setFormData({ ...formData, type: val })}
                    >
                      <SelectTrigger className="text-right" dir="rtl">
                        <SelectValue placeholder={t('selectType')} />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="visitTypeNew">{t('visitTypeNew')}</SelectItem>
                        <SelectItem value="visitTypeConsultation">{t('visitTypeConsultation')}</SelectItem>
                        <SelectItem value="visitTypeFollowUp">{t('visitTypeFollowUp')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <DialogClose asChild>
                  <Button variant="ghost" className="flex-1">{t('cancel')}</Button>
                </DialogClose>
                <Button
                  onClick={handleSave}
                  className="flex-[2] bg-[#5B93FF] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-lg"
                >
                  {t('save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. Quick Stats Cards (نظرة سريعة) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('statsTotal'), value: '24', icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: t('statsWaiting'), value: '5', icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { label: t('statsCompleted'), value: '12', icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: t('statsCancelled'), value: '2', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchBarPlaceholder')}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0582EB]/20 focus:border-[#0582EB] transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#0582EB] cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">{t('filterAll')}</option>
            <option value="scheduled">{t('filterScheduled')}</option>
            <option value="waiting">{t('filterWaiting')}</option>
            <option value="completed">{t('filterCompleted')}</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4" />
            <span>{t('filterAdvanced')}</span>
          </button>
        </div>
      </div>

      {/* 4. Appointments Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('tableTime')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('tablePatient')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('tableType')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('tableStatus')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('tablePayment')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                >
                  {/* Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {apt.time}
                    </div>
                  </td>

                  {/* Patient */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#0582EB] dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                        {apt.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {apt.patient}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          010xxxxxxx
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {t(apt.type as any)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${getStatusStyle(
                        apt.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${apt.status === "in-progress"
                            ? "bg-blue-500 animate-pulse"
                            : "bg-current"
                          }`}
                      ></span>
                      {getStatusText(apt.status)}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {apt.payment === "paid" ? (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-100 dark:border-green-800 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('paymentPaid')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-bold bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded border border-orange-100 dark:border-orange-800 w-fit">
                        <Banknote className="w-3 h-3" />
                        {t('paymentUnpaid')}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* زرار تسجيل الدخول السريع */}
                      {apt.status === "scheduled" && (
                        <button className="text-xs bg-[#0582EB] text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors">
                          {t('actionCheckIn')}
                        </button>
                      )}
                      {apt.status === "waiting" && (
                        <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors">
                          {t('actionStart')}
                        </button>
                      )}

                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('paginationShowing', { start: 1, end: 5, total: 24 })}</span>
          <div className="flex gap-2">
            <button className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />{" "}
              {/* انتبه للاتجاه في العربي */}
            </button>
            <button className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
