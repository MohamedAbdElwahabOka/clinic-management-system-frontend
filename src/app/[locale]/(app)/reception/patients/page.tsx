"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Phone,
  User,
  MoreVertical,
  Calendar,
  FileText,
  ShieldCheck,
  Filter,
  Users,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2
} from "lucide-react";
import { useTranslations } from "next-intl";

// --- Types ---
interface Patient {
  id: number;
  name: string;
  phone: string;
  gender: "male" | "female";
  age: number;
  lastVisit: string;
  insurance: string; // "None", "Allianz", "Axa", etc.
  totalVisits: number;
  status: "Active" | "Inactive";
}

// --- Mock Data ---
const initialPatients: Patient[] = [
  { id: 1, name: "محمد أحمد علي", phone: "01012345678", gender: "male", age: 34, lastVisit: "2024-12-01", insurance: "خاص (نقدي)", totalVisits: 5, status: "Active" },
  { id: 2, name: "سارة محمود حسن", phone: "01234567890", gender: "female", age: 28, lastVisit: "2024-11-20", insurance: "أليانز", totalVisits: 2, status: "Active" },
  { id: 3, name: "خالد إبراهيم", phone: "01122334455", gender: "male", age: 45, lastVisit: "2024-10-15", insurance: "أكسا", totalVisits: 12, status: "Active" },
  { id: 4, name: "منى سعيد", phone: "01555667788", gender: "female", age: 62, lastVisit: "2024-12-05", insurance: "خاص (نقدي)", totalVisits: 8, status: "Active" },
  { id: 5, name: "يوسف كمال", phone: "01099887766", gender: "male", age: 12, lastVisit: "2024-09-30", insurance: "ميتلايف", totalVisits: 1, status: "Inactive" },
];

// --- Components (Extracted for Performance) ---

// 1. Patient Card (Mobile View)
const PatientCard = ({ patient }: { patient: Patient }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${patient.gender === 'male' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'}`}>
          {patient.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{patient.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{patient.gender === 'male' ? 'ذكر' : 'أنثى'} • {patient.age} سنة</p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical className="w-5 h-5" /></button>
    </div>

    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-gray-400" />
        <span dir="ltr">{patient.phone}</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-gray-400" />
        <span className={patient.insurance !== "خاص (نقدي)" ? "text-blue-600 dark:text-blue-400 font-medium" : ""}>{patient.insurance}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>آخر زيارة: {patient.lastVisit}</span>
      </div>
    </div>

    <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-700">
      <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">حجز موعد</button>
      <button className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">الملف</button>
    </div>
  </div>
);

// 2. Add Patient Modal
const AddPatientModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({ name: "", phone: "", age: "", gender: "male", insurance: "خاص (نقدي)" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700">
        <div className="px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">تسجيل مريض جديد</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المريض رباعي</label>
            <input type="text" className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
              <input type="tel" className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none"
                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">السن</label>
              <input type="number" className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none"
                value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">النوع</label>
              <select className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">جهة التأمين</label>
              <select className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={formData.insurance} onChange={e => setFormData({ ...formData, insurance: e.target.value })}>
                <option value="خاص (نقدي)">خاص (نقدي)</option>
                <option value="أليانز">أليانز</option>
                <option value="أكسا">أكسا</option>
                <option value="ميتلايف">ميتلايف</option>
                <option value="نقابة المهندسين">نقابة المهندسين</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium">إلغاء</button>
          <button onClick={() => onSave(formData)} disabled={!formData.name} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">حفظ الملف</button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function PatientsPage() {
  const t = useTranslations("Patients"); // Assuming you have translations
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter Logic
  const filteredPatients = useMemo(() => {
    return patients.filter(p =>
      p.name.includes(searchQuery) ||
      p.phone.includes(searchQuery)
    );
  }, [patients, searchQuery]);

  // Actions
  const handleAddPatient = (data: any) => {
    const newPatient: Patient = {
      id: patients.length + 1,
      name: data.name,
      phone: data.phone,
      age: parseInt(data.age) || 0,
      gender: data.gender,
      insurance: data.insurance,
      lastVisit: new Date().toISOString().split('T')[0],
      totalVisits: 0,
      status: "Active"
    };
    setPatients([newPatient, ...patients]);
    setIsAddModalOpen(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8 font-sans text-gray-900 dark:text-white">

      {/* 1. Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            سجلات المرضى
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">إدارة ملفات المرضى والبحث السريع</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="بحث بالاسم أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Search className="absolute top-3 right-3 w-4 h-4 text-gray-400" />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>مريض جديد</span>
          </button>
        </div>
      </header>

      {/* 2. Stats Bar (Optional but nice) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">إجمالي المرضى</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{patients.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">مرضى اليوم</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">12</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">شركات التأمين</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">8</p>
        </div>
      </div>

      {/* 3. Patients List */}

      {/* Desktop View (Table) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">المريض</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">الهاتف</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">السن / النوع</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">التأمين</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">آخر زيارة</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 group transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${patient.gender === 'male' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400'}`}>
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{patient.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ملف #{patient.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300" dir="ltr">{patient.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {patient.age} سنة <span className="text-gray-300 dark:text-gray-600 mx-1">|</span> {patient.gender === 'male' ? 'ذكر' : 'أنثى'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${patient.insurance === "خاص (نقدي)"
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      : "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                    }`}>
                    {patient.insurance}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {patient.lastVisit}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">حجز</button>
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400" title="تعديل"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 dark:text-red-400" title="حذف"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>لا يوجد مرضى مطابقين للبحث</p>
          </div>
        )}
      </div>

      {/* Mobile View (Grid Cards) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      {/* Modals */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPatient}
      />

    </div>
  );
}